"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import useCaption from "@/hooks/useCaption";
import { PanelRightOpen } from "lucide-react";
import "./caption.css";

const CaptionModel = () => {
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
  } = useCaption();

  return (
    <div className="caption-page_content">
      <div className="caption-pageTop">
        {!isSidebarOpen && (
          <>
            <div
              onClick={toggleSidebar}
              className="caption-pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="caption-pageBody">
        <div className="caption-pageBody_innerBox">
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

export default CaptionModel;
