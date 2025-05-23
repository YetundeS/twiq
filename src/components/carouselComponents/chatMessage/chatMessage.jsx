import Markdown from "react-markdown";
import "./cm.css";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ chat }) => {
  return (
    <div
      className={`chatMessage_message ${
        chat?.sender === "user" ? "user" : "markdown"
      } ${chat?.status == 'error' && 'error'}`}
    >
      <div className="aitextMessageBlock">
        {chat?.sender !== "user" ? (
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{chat?.message}</Markdown>
        ) : (
          <p>{chat?.message}</p>
        )}
      </div>
    </div>
  );
};

export const ChatLoader = () => {
  return (
    <div className={`chatMessage loading`}>
        <div className="loader"></div>
    </div>
  );
};

export default ChatMessage;
