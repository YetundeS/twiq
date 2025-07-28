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
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "./use-mobile";


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
  const [isFetchingChats, setIsFetchingChats] = useState(true);


  const { addToSideBarSessions, isSidebarOpen, isMobileSidebarOpen } = useSideBar();
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
    
    // Set loading state
    setIsFetchingChats(isLoadingMessages);
    
    // Update messages when SWR data changes
    if (messages && messages.length > 0) {
      setActiveChatMessages(messages);
      setMessagesHasMore(hasMore);
    }
  }, [
    sessionId, 
    messages, 
    hasMore, 
    isLoadingMessages,
    updateActiveSessionID, 
    setActiveChatMessages, 
    setMessagesHasMore,
    setIsFetchingChats,
    resetMessagesPagination
  ]);

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

  const sendMessage = useCallback(async () => {
    if (!inputValue || streaming) return;

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

    const userChat = {
      sender: "user", // "user" || 'assistant'
      content: inputValue,
      sessionID: activeSessionID || 'newChat',
      created_at: new Date(),
      has_files: Array.isArray(uploadedFiles) && uploadedFiles.length > 0,
      linkedFiles: Array.isArray(uploadedFiles)
        ? uploadedFiles.map(({ name, type }) => ({ name, type }))
        : null,
    };

    // Update local state 
    updateActiveChatMessages(userChat);

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    const currentInput = inputValue;
    const currentFiles = uploadedFiles;

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


  const handleNewChatSession = async (newChatSession) => {
    addToSideBarSessions(newChatSession);
    updateActiveSessionID(newChatSession?.id);
  };

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
    if (!isSidebarOpen || isMobile) {
      setShowToggleChat(true)
    } else {
      setShowToggleChat(false)
    }
  }, [isSidebarOpen, isMobileSidebarOpen, isMobile])
  


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
    // New optimized features
    loadMoreMessages,
    messagesHasMore,
    isLoadingMessages,
    mutateMessages
  };
}
