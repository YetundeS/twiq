"use client";

import useLIB from "@/hooks/useLIB";
import "./lb.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import ModelName from "@/components/modelsComponent/modelName";

const LinkedInBusinessModel = () => {
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
  } = useLIB();

  return (
    <div className="lb-page_content">
      <div className="lb-pageTop">
        {!isSidebarOpen && (
          <>
            <div onClick={toggleSidebar} className="lb-pageTop_iconWrapper">
              <PanelRightOpen size="22px" />
            </div>
            <div className="lb-pageTop_iconWrapper">
              <SquarePen size="22px" />
            </div>
          </>
        )}{" "}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="lb-pageBody">
        <div className="lb-pageBody_innerBox">
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

export default LinkedInBusinessModel;
