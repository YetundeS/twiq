"use client";

import "./lp.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import useLIP from "@/hooks/useLIP";
import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import ModelName from "@/components/modelsComponent/modelName";

const LinkedInPersonalModel = () => {
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
  } = useLIP();

  return (
    <div className="lp-page_content">
      <div className="lp-pageTop">
        {!isSidebarOpen && (
          <>
            <div onClick={toggleSidebar} className="lp-pageTop_iconWrapper">
              <PanelRightOpen size="22px" />
            </div>
            <div className="lp-pageTop_iconWrapper">
              <SquarePen size="22px" />
            </div>
          </>
        )}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="lp-pageBody">
        <div className="lp-pageBody_innerBox">
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

export default LinkedInPersonalModel;
