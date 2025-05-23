"use client";

import "./headlines.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import useHeadlines from "@/hooks/useHeadlines";
import ModelName from "@/components/modelsComponent/modelName";
import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";

const HeadlinesModel = () => {

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
    } = useHeadlines();

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
            <div className="headline-pageTop_iconWrapper">
              <SquarePen size="22px" />
            </div>
          </>
        )}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="headline-pageBody">
        <div className="headlines-pageBody_innerBox">
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

export default HeadlinesModel;
