import { MoveUp } from "lucide-react";
import { useEffect, useRef } from "react";
import SquareIcon from "../shapes/stop";
import "./cc.css";

const ChatInputArea = ({
  inputValue,
  setInputValue,
  sendMessage,
  closeStreaming,
  streamingData,
  sendBtnActive,
  aiSuggestions,
}) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // max height 200px
    }
  }, [inputValue]);

  return (
    <div className="inputbox">
      <div className="upperInput_box">
        <textarea
          type="text"
          ref={textareaRef}
          placeholder="Ask anything"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), sendMessage())
          }
          className="chatInput"
        />
      </div>
      <div className="lowerInput_box">
        <div className="inputbtn_box">
            
        {!streamingData ? (
          <div
            onClick={sendMessage}
            className={`sendBtn ${sendBtnActive && "active"}`}
          >
            <MoveUp size={20} />
          </div>
        ) : (
          <div onClick={closeStreaming} className="stopBtn">
            <SquareIcon size={16} />
          </div>
        )}
        </div>
      </div>
      <div className="suggestionContainer">
        {aiSuggestions?.map((suggestion, i) => (
          <div key={i} className="suggestionBox" onClick={() => setInputValue(suggestion)}>
            <p>{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInputArea;
