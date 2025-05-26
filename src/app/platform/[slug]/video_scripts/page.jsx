"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import useVSM from "@/hooks/useVSM";
import { PanelRightOpen } from "lucide-react";
import "./video-scripts.css";

const VideoScriptsModel = () => {
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
  } = useVSM();

  return (
    <div className="vs-page_content">
      <div className="vs-pageTop">
        {!isSidebarOpen && (
          <>
            <div onClick={toggleSidebar} className="vs-pageTop_iconWrapper">
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={modelName} content={modelDescription} />
      </div>
      <div className="vs-pageBody">
        <div className="vs-pageBody_innerBox">
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

export default VideoScriptsModel;
