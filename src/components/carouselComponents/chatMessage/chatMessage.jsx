import { memo, useMemo, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Pencil, RefreshCw } from "lucide-react";
import FileBadge from "../fileBadge";
import { MarkdownComponents } from "../markdown";
import BranchPicker from "./BranchPicker";
import CoachIdentity from "./CoachIdentity";
import MessageCopyButton from "./MessageCopyButton";
import MessageSpeakerButton from "./MessageSpeakerButton";
import MessageContextMenu from "./MessageContextMenu";
import MessageErrorBanner from "./MessageErrorBanner";
import ModelBadge from "./ModelBadge";
import RetryWithModelMenu from "./RetryWithModelMenu";
import UserMessageEditor from "./UserMessageEditor";
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

const ChatMessage = memo(({
  chat,
  uploadedFiles,
  assistantSlug,
  coach,
  siblingInfo,
  onRetry,
  onRegenerate,
  onEdit,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isAIMessage = chat?.sender !== "user";
  const isErrorMessage = isAIMessage && chat?.status === "error";
  // Only rows persisted to DB have an id we can act on. Optimistic UI rows
  // (added during streaming) don't yet — hide edit/regenerate for them.
  const canRegenerate = isAIMessage && !isErrorMessage && !!chat?.id && typeof onRegenerate === "function";
  const canEdit = !isAIMessage && !!chat?.id && typeof onEdit === "function";
  const wasEdited = !isAIMessage && !!chat?.edited_at;

  // Memoize the parsed AI response to avoid recalculating on every render
  const aiRes = useMemo(() => {
    if (isAIMessage && !isErrorMessage && chat?.content) {
      return parseOpenAIResponse(chat.content);
    }
    return { markdown: "", trailingText: null };
  }, [chat?.content, isAIMessage, isErrorMessage]);

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
      // id + data-message-id let the search-fragment scroll-into-view effect
      // (chatMessageWindow useEffect) find this element via #message-N.
      id={chat?.id != null ? `message-${chat.id}` : undefined}
      data-message-id={chat?.id != null ? String(chat.id) : undefined}
      className="messageWrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAIMessage && !isErrorMessage && assistantSlug && (
        <CoachIdentity assistantSlug={assistantSlug} />
      )}
      {siblingInfo && (
        <BranchPicker
          index={siblingInfo.index}
          total={siblingInfo.total}
          onPrev={siblingInfo.onPrev}
          onNext={siblingInfo.onNext}
        />
      )}
      {chat?.sender === "user" && chat?.has_files && (
        <div className="messageUploads hide-scrollbar">
          <div className="messageUploads_innerCont">{fileBadges}</div>
        </div>
      )}
      <div
        className={`chatMessage_message ${
          chat?.sender === "user" ? "user" : "markdown"
        } ${isErrorMessage ? "errorBanner" : ""}`}
      >
        <div className="aitextMessageBlock">
          {isErrorMessage ? (
            <MessageErrorBanner content={chat?.content} onRetry={onRetry} />
          ) : isEditing ? (
            <UserMessageEditor
              initialContent={chat?.content}
              onCancel={() => setIsEditing(false)}
              onSave={async (next) => {
                const ok = await onEdit(chat.id, next);
                if (ok) setIsEditing(false);
              }}
            />
          ) : isAIMessage ? (
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
      {isAIMessage && !isErrorMessage && (
        <div
          className={`message-actions-container ${isHovered ? "visible" : ""}`}
        >
          <MessageCopyButton content={chat?.content} />
          {process.env.NEXT_PUBLIC_TTS_ENABLED === "true" && (
            <MessageSpeakerButton content={chat?.content} />
          )}
          {canRegenerate && (
            <>
              <button
                type="button"
                className="messageActionBtn"
                aria-label="Regenerate reply"
                onClick={() => onRegenerate(chat.id)}
                title="Regenerate reply"
              >
                <RefreshCw size={14} />
              </button>
              <RetryWithModelMenu
                coach={coach}
                onPick={(modelId) =>
                  onRegenerate(chat.id, modelId ? { modelId } : undefined)
                }
              />
            </>
          )}
          <ModelBadge model={chat?.model} />
        </div>
      )}
      {canEdit && !isEditing && (
        <div
          className={`message-actions-container user ${isHovered ? "visible" : ""}`}
        >
          {wasEdited && <span className="messageEditedTag">edited</span>}
          <button
            type="button"
            className="messageActionBtn"
            aria-label="Edit message"
            onClick={() => setIsEditing(true)}
            title="Edit message"
          >
            <Pencil size={14} />
          </button>
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
