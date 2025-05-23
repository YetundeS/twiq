import ModelTemplates from "../modelsComponent/modelTemplates";
import "./cc.css";
import ChatMessage, { ChatLoader } from "./chatMessage/chatMessage";

const ChatMessageWindow = ({
  chats,
  streamingData,
  streaming,
  messagesEndRef,
}) => {
  return (
    <div className="chats_area">
      {chats?.length > 0 ? (
        <>
          {chats?.map((chat, i) => (
            <ChatMessage chat={chat} key={i} />
          ))}
          {streamingData && (
            <ChatMessage chat={{ message: streamingData, sender: "bot" }} />
          )}
          {streaming && !streamingData && <ChatLoader />}
          <div className="messagesEnd" ref={messagesEndRef} />
        </>
      ) : (
        <div className="newChatArea">
          <ModelTemplates />
          <div className="messagesEnd" ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatMessageWindow;
