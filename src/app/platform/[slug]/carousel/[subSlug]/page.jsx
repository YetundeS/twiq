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

const CarouselChat = () => {
  const isMobile = useIsMobile();

  const {
    isSidebarOpen,
    toggleSidebar,
    // modelDescription,
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
  } = useAssistantChat('Carousel', 'carousel');

  return (
    <div className="page_content">
      <div className="pageTop">
        {(!isSidebarOpen || isMobile) && (
          <>
            <div
              onClick={toggleSidebar}
              className="pageTop_iconWrapper"
            >
              <PanelRightOpen className="pageIcon" size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <TwiqBg />
        <PlatformTop />
      </div>
      <div className="pageBody">
        <div className="pageBody_innerBox">
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
