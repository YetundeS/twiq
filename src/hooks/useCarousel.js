// import { sendChatMessage } from "@/apiCalls/sendChatMessage";
// import { modelDetailsMap } from "@/constants/carousel";
// import { useSideBar } from "@/store/sidebarStore";
// import useModelsStore from "@/store/useModelsStore";
// import { usePathname } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { usePromptSuggestions } from "./usePromptSuggestion";



// export default function useCarousel() {
//   const [inputValue, setInputValue] = useState("");
//   const [sendBtnActive, setSendBtnActive] = useState(false);
//   const [streamingData, setStreamingData] = useState("");
//   const [streaming, setStreaming] = useState(false);
//   const [aiSuggestions, setAISuggestions] = useState([]);
//   const streamingDataRef = useRef("");
//   const eventSourceRef = useRef(null);
//   const messagesEndRef = useRef(null);


//   const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
//   const { activeSessionID, activeChatMessages: chats, updateActiveChatMessages } = useModelsStore();

//   const [modelName, setModelName] = useState("Model");
//   const [assistantSlug, setAssistantSlug] = useState('');
//   const [modelDescription, setModelDescription] = useState([]);

//   const { suggestions } = usePromptSuggestions(inputValue, modelName, modelDescription);

//   const pathname = usePathname();

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };



//   useEffect(() => {
//     const segments = pathname.split("/").filter(Boolean);
//     const current = segments[segments.length - 1];

//     const model = modelDetailsMap[current];
//     if (model) {
//       setAssistantSlug(current);
//       setModelName(model.name);
//       setModelDescription(model.description);
//     } else {
//       setModelName("");
//       setModelDescription([]);
//     }
//   }, [pathname]);

// // imported


//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chats]);

//   useEffect(() => {
//     setSendBtnActive(inputValue && !streaming);
//   }, [inputValue, streaming]);


//   const sendMessage = async () => {
//     if (!inputValue || streaming) return;

//     const userChat = {
//       sender: "user", // "user" || 'assistant'
//       content: inputValue,
//       sessionID: activeSessionID || 'newChat',
//       created_at: new Date(),
//     };

//     // Update local state 
//     updateActiveChatMessages(userChat);

//     setStreaming(true);
//     setStreamingData("");
//     streamingDataRef.current = "";

//     const abortController = new AbortController();
//     eventSourceRef.current = abortController;

//     sendChatMessage(
//       inputValue,
//       activeSessionID,
//       assistantSlug,
//       (streamedData) => {
//         setStreamingData((prev) => {
//           if (prev.endsWith(streamedData)) return prev;
//           const updatedData = prev + streamedData;
//           streamingDataRef.current = updatedData;
//           return updatedData;
//         });
//       },
//       () => {
//         const assistantChat = {
//           sender: "assistant",
//           content: streamingDataRef.current,
//           sessionID: activeSessionID || 'newChat',
//           created_at: new Date(),
//         };

//         updateActiveChatMessages(assistantChat)

//         setStreaming(false);
//         setStreamingData("");
//       },
//       (error) => {
//         closeStreaming();
//         const assistantErrorChat = {
//           sender: "assistant",
//           status: "error",
//           content: error?.includes("Unauthorized")
//             ? "Unauthorized - Please login"
//             : "Server Error - Please try again.",
//           sessionID: activeSessionID || 'newChat',
//           created_at: new Date(),
//         };

//         updateActiveChatMessages(assistantErrorChat);
//       },
//       abortController
//     );

//     setInputValue("");
//   };

//   const closeStreaming = () => {
//     if (eventSourceRef.current instanceof AbortController) {
//       eventSourceRef.current.abort();
//       if (streamingDataRef.current) {
//         const assistantChat = {
//           sender: "assistant",
//           content: streamingDataRef.current,
//           sessionID: activeSessionID || 'newChat',
//           created_at: new Date(),
//         };

//         updateActiveChatMessages(assistantChat);
//       }
//       setStreaming(false);
//       setStreamingData("");
//       streamingDataRef.current = "";
//       eventSourceRef.current = null;
//     }
//   };

// // imported end

// useEffect(() => {
//   if(suggestions && suggestions?.length > 0) {
//     setAISuggestions(suggestions)
//   }

// }, [suggestions])

//   return {
//     isSidebarOpen,
//     toggleSidebar,
//     modelName,
//     modelDescription,
//     inputValue,
//     setInputValue,
//     sendMessage,
//     closeStreaming,
//     streamingData,
//     streaming,
//     sendBtnActive,
//     chats,
//     messagesEndRef,
//     aiSuggestions
//   };
// }
