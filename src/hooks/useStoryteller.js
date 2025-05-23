import { modelDetailsMap } from "@/constants/carousel";
import { useSideBar } from "@/store/sidebarStore";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePromptSuggestions } from "./usePromptSuggestion";



export default function useStoryteller() {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);


  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const [modelName, setModelName] = useState("Model");
  const [modelDescription, setModelDescription] = useState([]);

  const { suggestions } = usePromptSuggestions(inputValue, modelName, modelDescription);

  const chats = []

  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const current = segments[segments.length - 1];

    const model = modelDetailsMap[current];
    if (model) {
      setModelName(model.name);
      setModelDescription(model.description);
    } else {
      setModelName("Model");
      setModelDescription([]);
    }
  }, [pathname]);

// imported


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    setSendBtnActive(inputValue && !streaming);
  }, [inputValue, streaming]);


  const sendMessage = async () => {
    if (!inputValue || streaming) return;

    // const userChat = {
    //   sender: "user",
    //   status: "la_request",
    //   message: inputValue,
    //   time: new Date(),
    // };

    // // Update local state + storage
    // updateChats(userChat);
    // // Queue for batched DB write
    // queueLAChatForDB(userChat);

    // setStreaming(true);
    // setStreamingData("");
    // streamingDataRef.current = "";

    // const abortController = new AbortController();
    // eventSourceRef.current = abortController;

    // queryLegalAssistant(
    //   inputValue,
    //   (streamedData) => {
    //     setStreamingData((prev) => {
    //       if (prev.endsWith(streamedData)) return prev;
    //       const updatedData = prev + streamedData;
    //       streamingDataRef.current = updatedData;
    //       return updatedData;
    //     });
    //   },
    //   (error) => {
    //     closeStreaming();
    //     const errorChat = {
    //       sender: "bot",
    //       status: "error",
    //       message: error?.includes("Unauthorized")
    //         ? "Unauthorized - Please login"
    //         : "Server Error - Please try again.",
    //       time: new Date(),
    //     };
    //     updateChats(errorChat);
    //     queueLAChatForDB(errorChat);
    //   },
    //   () => {
    //     const botChat = {
    //       sender: "bot",
    //       status: "la_request",
    //       message: streamingDataRef.current,
    //       time: new Date(),
    //     };
    //     updateChats(botChat);
    //     queueLAChatForDB(botChat);
    //     setStreaming(false);
    //     setStreamingData("");
    //   },
    //   abortController
    // );

    setInputValue("");
  };

  const closeStreaming = () => {
    // if (eventSourceRef.current instanceof AbortController) {
    //   eventSourceRef.current.abort();
    //   if (streamingDataRef.current) {
    //     const botChat = {
    //       sender: "bot",
    //       status: "la_request",
    //       message: streamingDataRef.current,
    //       time: new Date(),
    //     };

    //     updateChats(botChat);
    //     queueLAChatForDB(botChat); // ← Batch this too
    //   }
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    // }
  };

// imported end

useEffect(() => {
  if(suggestions && suggestions?.length > 0) {
    setAISuggestions(suggestions)
  }

}, [suggestions])

  return {
    isSidebarOpen,
    toggleSidebar,
    modelName,
    modelDescription,
    inputValue,
    setInputValue,
    sendMessage,
    closeStreaming,
    streamingData,
    streaming,
    sendBtnActive,
    chats,
    messagesEndRef,
    aiSuggestions
  };
}
