import { useCallback } from "react";
import { Volume2, Square, Loader2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { markdownToPlainText } from "@/utils/markdownToText";
import "./messageActions.css";

const MessageSpeakerButton = ({ content }) => {
  const { speak, stop, isLoading, isPlaying } = useTextToSpeech();

  const handleClick = useCallback(
    (e) => {
      e?.stopPropagation();
      if (isPlaying) {
        stop();
      } else {
        const plainText = markdownToPlainText(content);
        speak(plainText);
      }
    },
    [content, speak, stop, isPlaying],
  );

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="message-actions-icon spinning" size={14} />;
    }
    if (isPlaying) {
      return <Square className="message-actions-icon playing" size={14} />;
    }
    return <Volume2 className="message-actions-icon" size={14} />;
  };

  const getAriaLabel = () => {
    if (isLoading) return "Loading speech...";
    if (isPlaying) return "Stop speaking";
    return "Speak message";
  };

  return (
    <button
      className={`message-actions-button message-actions-speaker ${isPlaying ? "active" : ""}`}
      onClick={handleClick}
      aria-label={getAriaLabel()}
      type="button"
      disabled={isLoading}
    >
      {getIcon()}
    </button>
  );
};

export default MessageSpeakerButton;
