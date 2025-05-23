"use client";

import "./storyteller.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import ModelName from "@/components/modelsComponent/modelName";
import useStoryteller from "@/hooks/useStoryteller";
import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";

const StorytellerModel = () => {
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
    aiSuggestions,
  } = useStoryteller();

  return (
    <div className="storytelling-page_content">
      <div className="storytelling-pageTop">
        {!isSidebarOpen && (
          <>
            <div
              onClick={toggleSidebar}
              className="storytelling-pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <div className="storytelling-pageTop_iconWrapper">
              <SquarePen size="22px" />
            </div>
          </>
        )}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="storytelling-pageBody">
        <div className="storytelling-pageBody_innerBox">
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

export default StorytellerModel;
