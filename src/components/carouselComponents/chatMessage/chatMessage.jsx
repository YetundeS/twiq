import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import FileBadge from "../fileBadge";
import { MarkdownComponents } from "../markdown";
import "./cm.css";

const ChatMessage = ({ chat, uploadedFiles }) => {

  const [aiRes, setAiRes] = useState({})

  useEffect(() => {
    if (chat?.sender !== 'user') {
      const response = parseOpenAIResponse(chat?.content)
      setAiRes(response)
    };
  }, [chat])



  function parseOpenAIResponse(raw) {
    const markdownRegex = /```(?:markdown)?\n([\s\S]*?)\n```/;
    const match = raw.match(markdownRegex);

    if (match) {
      const markdown = match[1].trim(); // the actual markdown content
      const afterMarkdown = raw.slice(match.index + match[0].length).trim(); // trailing text

      return {
        markdown,
        trailingText: afterMarkdown || null
      };
    }

    // If there's no markdown block, treat entire text as markdown
    return {
      markdown: raw.trim(),
      trailingText: null
    };
  }


  return (
    <div className="messageWrapper">
      {chat?.sender === "user" && chat?.hasFile && (
        <div className="messageUploads hide-scrollbar">
          <div className="messageUploads_innerCont">
            {chat?.linkedFiles?.map((file, index) => (
              <FileBadge key={index} file={file} messageBadge={true} />
            ))}
          </div>
      </div>
      )}
      <div
        className={`chatMessage_message ${chat?.sender === "user" ? "user" : "markdown"
          } ${chat?.status == 'error' && 'error'}`}
      >
        <div className="aitextMessageBlock">
          {chat?.sender !== "user" ? (
            <>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
              >
                {aiRes.markdown}
              </Markdown>
              {aiRes.trailingText && (
                <p className="mt-4 text-gray-700">{aiRes.trailingText}</p>
              )}
            </>
          ) : (
            <p>{chat?.content}</p>
          )}
        </div>
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
