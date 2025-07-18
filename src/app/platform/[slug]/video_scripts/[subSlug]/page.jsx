"use client";

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import PlatformTop from "@/components/dashboardComponent/platformTop";
import TwiqBg from "@/components/dashboardComponent/twiqBg";
import useAssistantChat from "@/hooks/useAssistantChat";
import "@/styles/platformStyles.css";
import { PanelRightOpen } from "lucide-react";

const CarouselChat = () => {

  const {
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
    uploadBtnActive,
    setUploadedFiles,
    uploadedFiles,
    chats,
    messagesEndRef,
    aiSuggestions,
    showToggleChat
    } = useAssistantChat('Video Scripts', 'video_scripts');

  return (
    <div className="page_content">
      <div className="pageTop">
        {(showToggleChat) && (
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
            isFetchingChats={isFetchingChats}
            uploadedFiles={uploadedFiles}
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
            uploadBtnActive={uploadBtnActive}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselChat;
