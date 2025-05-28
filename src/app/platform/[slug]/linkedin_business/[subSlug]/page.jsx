"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import { useIsMobile } from "@/hooks/use-mobile";
import useAssistantChat from "@/hooks/useAssistantChat";
import { PanelRightOpen } from "lucide-react";
import "../lb.css";

const LBChat = () => {
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
    } = useAssistantChat("LinkedIn Your Business", 'linkedin_business');
    
  return (
    <div className="lb-page_content">
      <div className="lb-pageTop">
        {(!isSidebarOpen || isMobile) && (
          <>
            <div
              onClick={toggleSidebar}
              className="lb-pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={'"LinkedIn Your Business"'} content={modelDescription} />
      </div>
      <div className="lb-pageBody">
        <div className="lb-pageBody_innerBox">
          <ChatMessageWindow
            chats={chats}
            streamingData={streamingData}
            streaming={streaming}
            messagesEndRef={messagesEndRef}
            setInputValue={setInputValue}
            assistantSlug={'linkedin_business'}
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

export default LBChat;
