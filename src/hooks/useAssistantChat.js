import { fetchMessages } from "@/apiCalls/chatMessage";
import { sendChatMessage } from "@/apiCalls/sendChatMessage";
import { hasAccess } from "@/components/appSideBar";
import { modelDetailsMap } from "@/constants/carousel";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import useModelsStore from "@/store/useModelsStore";
import { useResponsiveSidebarToggle } from "@/store/useResponsiveSidebarToggle";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const { activeSessionID, activeChatMessages: chats, updateActiveSessionID, updateActiveChatMessages, setActiveChatMessages } = useModelsStore();

  const modelDescription = modelDetailsMap[assistantSlug]?.description;

  const toggleSidebar = useResponsiveSidebarToggle();

  useEffect(() => {
    const match = pathname.match(/\/platform\/@[^/]+\/[^/]+\/([^/?#]+)/);
    const sessionId = match?.[1];

    if (!sessionId) return;

    setIsFetchingChats(true);

    updateActiveSessionID(sessionId)
    fetchMessages(sessionId, assistantSlug, setIsFetchingChats, setActiveChatMessages);
  }, [pathname, setActiveChatMessages, updateActiveSessionID]);


  // imported

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

  const sendMessage = async () => {
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

    sendChatMessage(
      inputValue,
      activeSessionID,
      assistantSlug,
      uploadedFiles,
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
  };

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
    showToggleChat
  };
}
