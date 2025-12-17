import { memo, useMemo, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import FileBadge from "../fileBadge";
import { MarkdownComponents } from "../markdown";
import MessageCopyButton from "./MessageCopyButton";
import MessageSpeakerButton from "./MessageSpeakerButton";
import MessageContextMenu from "./MessageContextMenu";
import "./cm.css";

// Memoized function to parse OpenAI response
const parseOpenAIResponse = (raw) => {
  if (!raw) return { markdown: "", trailingText: null };

  const markdownRegex = /```(?:markdown)?\n([\s\S]*?)\n```/;
  const match = raw.match(markdownRegex);

  if (match) {
    const markdown = match[1].trim(); // the actual markdown content
    const afterMarkdown = raw.slice(match.index + match[0].length).trim(); // trailing text

    return {
      markdown,
      trailingText: afterMarkdown || null,
    };
  }

  // If there's no markdown block, treat entire text as markdown
  return {
    markdown: raw.trim(),
    trailingText: null,
  };
};

const ChatMessage = memo(({ chat, uploadedFiles }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isAIMessage = chat?.sender !== "user";

  // Memoize the parsed AI response to avoid recalculating on every render
  const aiRes = useMemo(() => {
    if (isAIMessage && chat?.content) {
      return parseOpenAIResponse(chat.content);
    }
    return { markdown: "", trailingText: null };
  }, [chat?.content, isAIMessage]);

  // Memoize the file badges to avoid re-rendering if files haven't changed
  const fileBadges = useMemo(() => {
    if (!chat?.has_files || !chat?.linkedFiles) return null;

    return chat.linkedFiles.map((file, index) => (
      <FileBadge
        key={`${file.name}-${index}`}
        file={file}
        messageBadge={true}
      />
    ));
  }, [chat?.linkedFiles, chat?.has_files]);

  const messageContent = (
    <div
      className="messageWrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chat?.sender === "user" && chat?.has_files && (
        <div className="messageUploads hide-scrollbar">
          <div className="messageUploads_innerCont">{fileBadges}</div>
        </div>
      )}
      <div
        className={`chatMessage_message ${
          chat?.sender === "user" ? "user" : "markdown"
        } ${chat?.status === "error" ? "error" : ""}`}
      >
        <div className="aitextMessageBlock">
          {isAIMessage ? (
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
      {isAIMessage && (
        <div
          className={`message-actions-container ${isHovered ? "visible" : ""}`}
        >
          <MessageCopyButton content={chat?.content} />
          <MessageSpeakerButton content={chat?.content} />
        </div>
      )}
    </div>
  );

  if (isAIMessage) {
    return (
      <MessageContextMenu content={chat?.content}>
        {messageContent}
      </MessageContextMenu>
    );
  }

  return messageContent;
});

export const ChatLoader = memo(() => {
  return (
    <div className="chatMessage loading">
      <p className="fade-text">Thinking...</p>
    </div>
  );
});

export default ChatMessage;
