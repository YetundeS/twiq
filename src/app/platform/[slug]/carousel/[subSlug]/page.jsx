"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import useCarouselChat from "@/hooks/useCarouselChat";
import { PanelRightOpen } from "lucide-react";
import "./carouselChat.css";

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
  } = useCarouselChat();

  return (
    <div className="carousel_page_content">
      <div className="carousel_pageTop">
        {!isSidebarOpen && (
          <>
            <div
              onClick={toggleSidebar}
              className="carousel_pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="carousel_pageBody">
        <div className="carousel_pageBody_innerBox">
          <ChatMessageWindow
            chats={chats}
            streamingData={streamingData}
            streaming={streaming}
            messagesEndRef={messagesEndRef}
            setInputValue={setInputValue}
            assistantSlug={'carousel'}
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
