"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import PlatformTop from "@/components/dashboardComponent/platformTop";
import { useIsMobile } from "@/hooks/use-mobile";
import useAssistantChat from "@/hooks/useAssistantChat";
import { PanelRightOpen } from "lucide-react";

import TwiqBg from "@/components/dashboardComponent/twiqBg";
import "@/styles/platformStyles.css";

const StorytellerModel = () => {
  const isMobile = useIsMobile();

  const {
    isSidebarOpen,
    toggleSidebar,
    // modelName,
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
  } = useAssistantChat('Storyteller', 'storyteller');


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
            assistantSlug={'storyteller'}
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
