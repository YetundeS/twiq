"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import PlatformTop from "@/components/dashboardComponent/platformTop";
import TwiqBg from "@/components/dashboardComponent/twiqBg";
import { useIsMobile } from "@/hooks/use-mobile";
import useAssistantChat from "@/hooks/useAssistantChat";
import "@/styles/platformStyles.css";
import { PanelRightOpen } from "lucide-react";

const VideoScriptsModel = () => {
  const isMobile = useIsMobile();

  const {
    isSidebarOpen,
    toggleSidebar,
    // modelDescription,
    // isFetchingChats,
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
    <div className="page_content">
      <div className="pageTop">
        {(!isSidebarOpen || isMobile) && (
          <>
            <div onClick={toggleSidebar} className="pageTop_iconWrapper">
              <PanelRightOpen className="pageIcon" size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <PlatformTop />
      </div>
        <TwiqBg />
      <div className="pageBody">
        <div className="pageBody_innerBox">
          <ChatMessageWindow
            chats={chats}
            streamingData={streamingData}
            streaming={streaming}
            messagesEndRef={messagesEndRef}
            setInputValue={setInputValue}
            assistantSlug={'video_scripts'}
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
