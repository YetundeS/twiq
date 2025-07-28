import { memo, useMemo } from "react";
import SpinnerLoader from "../dashboardComponent/spinnerLoader";
import ModelTemplates from "../modelsComponent/modelTemplates";
import "./cc.css";
import ChatMessage, { ChatLoader } from "./chatMessage/chatMessage";

const ChatMessageWindow = memo(({
  chats,
  streamingData,
  streaming,
  messagesEndRef,
  setInputValue,
  assistantSlug,
  isFetchingChats,
  uploadedFiles,
  loadMoreMessages,
  messagesHasMore,
  isLoadingMessages
}) => {
  
  // Memoize the chat messages to avoid re-rendering all messages when only streaming data changes
  const chatMessages = useMemo(() => {
    if (!chats?.length) return null;
    
    return chats.map((chat, i) => (
      <ChatMessage 
        uploadedFiles={uploadedFiles} 
        chat={chat} 
        key={chat.id || `${chat.sessionID}-${i}`} // Use unique key if available
      />
    ));
  }, [chats, uploadedFiles]);

  // Memoize the streaming message to avoid unnecessary re-renders
  const streamingMessage = useMemo(() => {
    if (!streaming) return null;
    
    if (streamingData) {
      return <ChatMessage chat={{ content: streamingData, sender: "assistant" }} />;
    }
    
    return <ChatLoader />;
  }, [streaming, streamingData]);

  // Load more messages button for infinite scroll
  const loadMoreButton = useMemo(() => {
    if (!messagesHasMore || isLoadingMessages) return null;
    
    return (
      <button 
        onClick={loadMoreMessages}
        className="load-more-messages-btn"
        disabled={isLoadingMessages}
      >
        {isLoadingMessages ? 'Loading...' : 'Load older messages'}
      </button>
    );
  }, [messagesHasMore, isLoadingMessages, loadMoreMessages]);
  
  if (isFetchingChats) {
    return (
      <div className="chats_area">
        <div className="loadingIndicator">
          <SpinnerLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="chats_area">
      <div className="chats_area_container">
        {chats?.length > 0 ? (
          <>
            {loadMoreButton}
            {chatMessages}
            {streamingMessage}
            <div className="messagesEnd" ref={messagesEndRef}></div>
          </>
        ) : (
          <div className="newChatArea">
            <ModelTemplates assistantSlug={assistantSlug} setInputValue={setInputValue} />
            <div className="messagesEnd" ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessageWindow.displayName = 'ChatMessageWindow';

export default ChatMessageWindow;
