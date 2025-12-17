import { useCallback } from "react";
import { Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { markdownToPlainText } from "@/utils/markdownToText";
import "./messageActions.css";

const MessageCopyButton = ({ content }) => {
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
    <button
      className="message-actions-button message-actions-copy"
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
  );
};

export default MessageCopyButton;
