import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "../markdown";
import "./cm.css";

const ChatMessage = ({ chat }) => {
  
  return (
    <div
      className={`chatMessage_message ${
        chat?.sender === "user" ? "user" : "markdown"
      } ${chat?.status == 'error' && 'error'}`}
    >
      <div className="aitextMessageBlock">
        {chat?.sender !== "user" ? (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={MarkdownComponents}
          >
            {chat?.content}
          </Markdown>
        ) : (
          <p>{chat?.content}</p>
        )}
      </div>
    </div>
  );
};

export const ChatLoader = () => {
  return (
    <div className={`chatMessage loading`}>
        {/* <div className="loader"></div> */}
        <p className="fade-text">Thinking...</p>
    </div>
  );
};

export default ChatMessage;
