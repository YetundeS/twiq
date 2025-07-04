import SpinnerLoader from "../dashboardComponent/spinnerLoader";
import ModelTemplates from "../modelsComponent/modelTemplates";
import "./cc.css";
import ChatMessage, { ChatLoader } from "./chatMessage/chatMessage";

const ChatMessageWindow = ({
  chats,
  streamingData,
  streaming,
  messagesEndRef,
  setInputValue,
  assistantSlug,
  isFetchingChats
}) => {
  
  return (
    <div className="chats_area">
      {isFetchingChats ? (
        <div className="loadingIndicator">
          <SpinnerLoader />
        </div>
      ) : (
        <div className="chats_area_container">
          {chats?.length > 0 ? (
            <>
              {chats?.map((chat, i) => (
                <ChatMessage chat={chat} key={i} />
              ))}
              {streaming && streamingData && (
                <ChatMessage chat={{ content: streamingData, sender: "assistant" }} />
              )}
              {streaming && !streamingData && <ChatLoader />}
              <div className="messagesEnd" ref={messagesEndRef}></div>
            </>
          ) : (
            <div className="newChatArea">
              <ModelTemplates assistantSlug={assistantSlug} setInputValue={setInputValue} />
              <div className="messagesEnd" ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessageWindow;
