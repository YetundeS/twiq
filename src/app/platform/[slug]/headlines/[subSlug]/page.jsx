"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import useAssistantChat from "@/hooks/useAssistantChat";
import { PanelRightOpen } from "lucide-react";
import "../headlines.css";

const CarouselChat = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    modelName,
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
    aiSuggestions
      } = useAssistantChat('Headlines', 'headlines');

  return (
    <div className="headline-page_content">
      <div className="headline-pageTop">
        {!isSidebarOpen && (
          <>
            <div
              onClick={toggleSidebar}
              className="headline-pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={'headlines'} content={modelDescription} />
      </div>
      <div className="headline-pageBody">
        <div className="headlines-pageBody_innerBox">
          <ChatMessageWindow
            chats={chats}
            streamingData={streamingData}
            streaming={streaming}
            messagesEndRef={messagesEndRef}
            setInputValue={setInputValue}
            assistantSlug={'headlines'}
            isFetchingChats={isFetchingChats}
          />
          <ChatInputArea
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMessage={sendMessage}
            closeStreaming={closeStreaming}
            streamingData={streamingData}
            sendBtnActive={sendBtnActive}
            aiSuggestions={aiSuggestions}
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselChat;
