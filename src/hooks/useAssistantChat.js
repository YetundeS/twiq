import { fetchMessages } from "@/apiCalls/chatMessage";
import { sendChatMessage } from "@/apiCalls/sendChatMessage";
import { useSidebar } from "@/components/ui/sidebar";
import { modelDetailsMap } from "@/constants/carousel";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import useModelsStore from "@/store/useModelsStore";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePromptSuggestions } from "./usePromptSuggestion";

const starterModels = ["LinkedIn Personal", "Headlines", "Storyteller"].map(m => m.toLowerCase());
const proModels = ["LinkedIn Your Business", "Caption", "Video Scripts", "Carousel"].map(m => m.toLowerCase());

const hasAccess = (plan, title) => {
  if (!plan || !title) return false;

  const normalizedPlan = plan.toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedPlan === "none") return false;
  if (normalizedPlan === "starter") return starterModels.includes(normalizedTitle);
  if (normalizedPlan === "pro") return starterModels.includes(normalizedTitle) || proModels.includes(normalizedTitle);
  if (normalizedPlan === "enterprise") return true;

  return false;
};




export default function useAssistantChat(modelName, assistantSlug) {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { toggleSidebar: mainToggle } = useSidebar();
  const { user } = useAuthStore()

  const pathname = usePathname();
  const [isFetchingChats, setIsFetchingChats] = useState(true);


  const { addToSideBarSessions, isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const { activeSessionID, activeChatMessages: chats, updateActiveSessionID, updateActiveChatMessages, setActiveChatMessages } = useModelsStore();

  const modelDescription = modelDetailsMap[assistantSlug]?.description;

  const { suggestions } = usePromptSuggestions(inputValue, modelName, modelDescription);


  const toggleSidebar = () => {
    mainToggle()
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    setSendBtnActive(inputValue && !streaming);
  }, [inputValue, streaming]);

  function getErrorMessage(error = '') {
    if (error.includes('Unauthorized')) return 'Unauthorized - Please login';
    if (error.includes('Quota exceeded')) return 'Quota exceeded - Please upgrade your plan';
    if (error.includes('Your current plan')) return error;
    return 'Server Error - Please try again.';
  }


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
      (streamedData) => {
        setStreamingData((prev) => {
          const updatedData = prev + streamedData;
          streamingDataRef.current = updatedData;
          return updatedData;
        });
      },
      () => {
        setStreaming(false);
        const finalMessage = streamingDataRef.current; // capture here
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
          // console.log('chatSession: ', chatSession)
          handleNewChatSession(chatSession);
        }
      }
    );

    setInputValue("");
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
    }
  };


  const handleNewChatSession = async (newChatSession) => {
    // console.log('newChatSession: ', newChatSession)
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
    if (suggestions && suggestions?.length > 0) {
      setAISuggestions(suggestions)
    }

  }, [suggestions])


  return {
    isSidebarOpen,
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
    chats,
    messagesEndRef,
    aiSuggestions,
  };
}
