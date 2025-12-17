import { useCallback } from "react";
import { Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { markdownToPlainText } from "@/utils/markdownToText";
import "./messageActions.css";

/**
 * MessageCopyButton - Copy button shown on hover for AI messages
 *
 * @param {Object} props
 * @param {string} props.content - Message content to copy
 * @param {boolean} props.isHovered - Whether parent message is hovered
 */
const MessageCopyButton = ({ content, isHovered = false }) => {
  const { copyToClipboard, copied } = useCopyToClipboard();

  const handleCopy = useCallback(
    (e) => {
      e?.stopPropagation();
      const plainText = markdownToPlainText(content);
      copyToClipboard(plainText);
    },
    [content, copyToClipboard],
  );

  return (
    <div className={`message-actions-container ${isHovered ? "visible" : ""}`}>
      <button
        className="message-actions-quick-copy"
        onClick={handleCopy}
        aria-label="Copy message"
        type="button"
      >
        {copied ? (
          <span className="message-actions-icon copied">✓</span>
        ) : (
          <Copy className="message-actions-icon" size={14} />
        )}
      </button>
    </div>
  );
};

export default MessageCopyButton;
