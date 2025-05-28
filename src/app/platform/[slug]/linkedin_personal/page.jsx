"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import ModelName from "@/components/modelsComponent/modelName";
import { useIsMobile } from "@/hooks/use-mobile";
import useAssistantChat from "@/hooks/useAssistantChat";
import { PanelRightOpen } from "lucide-react";
import "./lp.css";

const LinkedInPersonalModel = () => {
  const isMobile = useIsMobile();

  const {
    isSidebarOpen,
    toggleSidebar,
    modelDescription,
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
  } = useAssistantChat('LinkedIn Personal', 'linkedin_personal');

  return (
    <div className="lp-page_content">
      <div className="lp-pageTop">
        {(!isSidebarOpen || isMobile) && (
          <>
            <div onClick={toggleSidebar} className="lp-pageTop_iconWrapper">
              <PanelRightOpen size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <ModelName name={'LinkedIn Personal'} content={modelDescription} />
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
