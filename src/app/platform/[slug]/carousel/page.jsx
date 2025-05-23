"use client";

import "./carousel.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import useCarousel from "@/hooks/useCarousel";
import ModelName from "@/components/modelsComponent/modelName";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import ChatInputArea from "@/components/carouselComponents/chatInputArea";

const CarouselPage = () => {
  const {
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
  } = useCarousel();

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
            <div className="carousel_pageTop_iconWrapper">
              <SquarePen size="22px" />
            </div>
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

export default CarouselPage;
