import { fetchMessages } from "@/apiCalls/chatMessage";
import { sendChatMessage } from "@/apiCalls/sendChatMessage";
import { hasAccess } from "@/components/appSideBar";
import { modelDetailsMap } from "@/constants/carousel";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import useModelsStore from "@/store/useModelsStore";
import { useResponsiveSidebarToggle } from "@/store/useResponsiveSidebarToggle";
import { useChatMessages } from "./useApiCache";
import { withDeduplication } from "@/utils/requestDeduplication";
import { generateSignString } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "./use-mobile";
import useKeyboardShortcuts from "./useKeyboardShortcuts";


export default function useAssistantChat(modelName, assistantSlug) {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [uploadBtnActive, setUploadBtnActive] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [showToggleChat, setShowToggleChat] = useState(false);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore()
  const isMobile = useIsMobile();

  const pathname = usePathname();
  const router = useRouter();
  const [isFetchingChats, setIsFetchingChats] = useState(true);


  const { addToSideBarSessions, updateSessionInSideBar, isSidebarOpen, isMobileSidebarOpen } = useSideBar();
  const { 
    activeSessionID, 
    activeChatMessages: chats, 
    messagesHasMore,
    messagesPage,
    updateActiveSessionID, 
    updateActiveChatMessages, 
    setActiveChatMessages,
    setMessagesHasMore,
    setMessagesPage,
    resetMessagesPagination
  } = useModelsStore();

  const modelDescription = modelDetailsMap[assistantSlug]?.description;

  const toggleSidebar = useResponsiveSidebarToggle();

  // Extract session ID from pathname
  const sessionId = useMemo(() => {
    const match = pathname.match(/\/platform\/@[^/]+\/[^/]+\/([^/?#]+)/);
    return match?.[1];
  }, [pathname]);

  // Use SWR hook for cached message fetching
  const { 
    messages, 
    hasMore, 
    isLoading: isLoadingMessages,
    mutate: mutateMessages 
  } = useChatMessages(sessionId, assistantSlug, {
    enabled: !!sessionId && !!assistantSlug,
    page: messagesPage,
  });

  // Optimized fetch messages with deduplication
  const fetchMessagesDeduped = useMemo(
    () => withDeduplication(fetchMessages),
    []
  );

  useEffect(() => {
    if (!sessionId) {
      resetMessagesPagination();
      return;
    }

    updateActiveSessionID(sessionId);
  }, [sessionId, updateActiveSessionID, resetMessagesPagination]);

  useEffect(() => {
    setIsFetchingChats(isLoadingMessages);
  }, [isLoadingMessages]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setActiveChatMessages(messages);
      setMessagesHasMore(hasMore);
    }
  }, [messages, hasMore, setActiveChatMessages, setMessagesHasMore]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    if(inputValue && !streaming) {  // active when not streaming and there's prompt
      setSendBtnActive(true)
    } else {
      setSendBtnActive(false)
    }

    if(!streaming) {  // active when not streaming
      setUploadBtnActive(true)
    } else {
      setUploadBtnActive(false)
    }
  }, [inputValue, streaming]);


  function getErrorMessage(error = '') {
    if (error.includes('Unauthorized')) return 'Unauthorized - Please login';
    if (error.includes('Quota exceeded')) return 'Quota exceeded - Please upgrade your plan';
    if (error.includes('Your current plan')) return error;
    return 'Server Error - Please try again.';
  }

  const updateStreamingData = (chunk) => {
    streamingDataRef.current += chunk;
    setStreamingData(streamingDataRef.current);
  };

  // sendMessage accepts an optional `overrideText`. Retry-on-error uses it to
  // re-send the last user message without going through the input state
  // (inputValue is asynchronous — setState + call in the same tick loses the
  // new value). Files aren't carried through on retry: if you had uploads, the
  // errored turn either succeeded far enough to consume them or fell back to
  // a plain retry.
  const sendMessage = useCallback(async (overrideText) => {
    const text = typeof overrideText === "string" ? overrideText : inputValue;
    if (!text || streaming) return;

    const hasModelAccess = hasAccess(user?.subscription_plan, modelName);

    if (!hasModelAccess) {
      toast.error(`Upgrade to access "${modelName}" model`, {
        style: {
          border: "none",
          color: "red",
        },
      });

      setInputValue("");
      return; // stop execution
    }

    const usingOverride = typeof overrideText === "string";
    const filesForTurn = usingOverride ? [] : uploadedFiles;

    const userChat = {
      sender: "user", // "user" || 'assistant'
      content: text,
      sessionID: activeSessionID || 'newChat',
      created_at: new Date(),
      has_files: Array.isArray(filesForTurn) && filesForTurn.length > 0,
      linkedFiles: Array.isArray(filesForTurn)
        ? filesForTurn.map(({ name, type }) => ({ name, type }))
        : null,
    };

    // Update local state 
    updateActiveChatMessages(userChat);

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    const currentInput = text;
    const currentFiles = filesForTurn;

    sendChatMessage(
      currentInput,
      activeSessionID,
      assistantSlug,
      currentFiles,
      (streamedData) => {
          updateStreamingData(streamedData);
      },
      () => {
        setStreaming(false);
        const finalMessage = streamingDataRef.current;
        setStreamingData(""); // reset

        const assistantChat = {
          sender: "assistant",
          content: finalMessage,
          sessionID: activeSessionID || 'newChat',
          created_at: new Date(),
        };

        updateActiveChatMessages(assistantChat);
        
        // Invalidate cache to get latest messages
        mutateMessages();
      },
      (error) => {
        closeStreaming();
        const assistantErrorChat = {
          sender: "assistant",
          status: "error",
          content: getErrorMessage(error),
          sessionID: activeSessionID || 'newChat',
          created_at: new Date(),
        };

        updateActiveChatMessages(assistantErrorChat);
      },
      abortController,
      (chatSession) => {
        if (chatSession.id) {
          handleNewChatSession(chatSession);
        }
      },
      (newTitle) => {
        if (activeSessionID && newTitle) {
          updateSessionInSideBar(activeSessionID, { title: newTitle });
        }
      }
    );

    setInputValue("");
    setUploadedFiles([])
  }, [
    inputValue,
    streaming,
    user?.subscription_plan,
    modelName,
    uploadedFiles,
    activeSessionID,
    assistantSlug,
    updateActiveChatMessages,
    updateSessionInSideBar,
    mutateMessages
  ]);

  // end streaming output from assistant
  const closeStreaming = () => {
    if (eventSourceRef.current instanceof AbortController) {
      eventSourceRef.current.abort();
      if (streamingDataRef.current) {
        const assistantChat = {
          sender: "assistant",
          content: streamingDataRef.current,
          sessionID: activeSessionID || 'newChat',
          created_at: new Date(),
        };

        updateActiveChatMessages(assistantChat);
      }
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
      setUploadedFiles([])
    }
  };


  const handleNewChatSession = useCallback(async (newChatSession) => {
    addToSideBarSessions(newChatSession);
    updateActiveSessionID(newChatSession?.id);
  }, [addToSideBarSessions, updateActiveSessionID]);

  // Load more messages for infinite scroll
  const loadMoreMessages = useCallback(async () => {
    if (!messagesHasMore || isLoadingMessages || !sessionId) return;

    const nextPage = messagesPage + 1;
    setMessagesPage(nextPage);

    try {
      const result = await fetchMessagesDeduped(
        sessionId, 
        assistantSlug, 
        () => {}, // No need for loading state since we have SWR
        setActiveChatMessages, 
        nextPage
      );

      if (result && result.messages) {
        setActiveChatMessages(result.messages, true); // Prepend older messages
        setMessagesHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
      toast.error('Failed to load more messages', {
        description: 'Please try again',
        style: { border: "none", color: "red" },
      });
    }
  }, [
    messagesHasMore, 
    isLoadingMessages, 
    sessionId, 
    messagesPage, 
    assistantSlug,
    fetchMessagesDeduped,
    setActiveChatMessages,
    setMessagesPage,
    setMessagesHasMore
  ]);

  // closes stream when component unmounts unexpectedly
  useEffect(() => {
    return () => {
      closeStreaming();
    };
  }, []);

  useEffect(() => {
    setShowToggleChat(!isSidebarOpen || isMobile);
  }, [isSidebarOpen, isMobile]);

  const startNewChat = useCallback(() => {
    if (!assistantSlug) return;
    const organization = user?.organization_name
      ? generateSignString(user.organization_name)
      : "";
    if (!organization) return;
    router.push(`/platform/${organization}/${assistantSlug}/`);
  }, [assistantSlug, user?.organization_name, router]);

  const handleEscape = useCallback(() => {
    // closeStreaming is a plain function defined in this hook; it reads from
    // refs, so a stale closure here is safe but eslint-react-hooks flags it.
    if (streaming) closeStreaming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);

  useKeyboardShortcuts({
    onNewChat: startNewChat,
    onEscape: handleEscape,
  });

  // Retry the failed turn: drop the errored assistant + its user message
  // from state, then re-run sendMessage with the user text as an override.
  // No-op unless the tail of `chats` is the errored assistant preceded by a
  // user turn (i.e., we actually have something to retry).
  const retryLastMessage = useCallback(() => {
    if (streaming) return;
    if (!Array.isArray(chats) || chats.length < 2) return;

    const errored = chats[chats.length - 1];
    if (errored?.sender !== "assistant" || errored?.status !== "error") return;

    const userTurn = chats[chats.length - 2];
    if (userTurn?.sender !== "user" || !userTurn.content) return;

    const trimmed = chats.slice(0, -2);
    setActiveChatMessages(trimmed);
    sendMessage(userTurn.content);
  }, [chats, streaming, setActiveChatMessages, sendMessage]);


  return {
    toggleSidebar,
    modelDescription,
    isFetchingChats,
    inputValue,
    setInputValue,
    sendMessage,
    closeStreaming,
    streamingData,
    streaming,
    sendBtnActive,
    uploadBtnActive,
    uploadedFiles,
    setUploadedFiles,
    chats,
    messagesEndRef,
    aiSuggestions,
    showToggleChat,
    retryLastMessage,
    // New optimized features
    loadMoreMessages,
    messagesHasMore,
    isLoadingMessages,
    mutateMessages
  };
}
