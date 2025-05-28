"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import { useIsMobile } from "@/hooks/use-mobile";
import useAssistantChat from "@/hooks/useAssistantChat";
import { PanelRightOpen } from "lucide-react";
import "../video-scripts.css";

const CarouselChat = () => {
  const isMobile = useIsMobile();

  const {
    isSidebarOpen,
    toggleSidebar,
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
    } = useAssistantChat('Video Scripts', 'video_scripts');

  return (
    <div className="vs-page_content">
      <div className="vs-pageTop">
        {(!isSidebarOpen || isMobile) && (
          <>
            <div
              onClick={toggleSidebar}
              className="vs-pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={'Video Scripts'} content={modelDescription} />
      </div>
      <div className="vs-pageBody">
        <div className="vs-pageBody_innerBox">
          <ChatMessageWindow
            chats={chats}
            streamingData={streamingData}
            streaming={streaming}
            messagesEndRef={messagesEndRef}
            setInputValue={setInputValue}
            assistantSlug={'video_scripts'}
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
