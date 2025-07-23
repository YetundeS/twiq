import { MoveUp, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import SquareIcon from "../shapes/stop";
import "./cc.css";
import FileBadge from "./fileBadge";

const ChatInputArea = ({
  inputValue,
  setInputValue,
  sendMessage,
  closeStreaming,
  streamingData,
  sendBtnActive,
  aiSuggestions,
  uploadBtnActive,
  uploadedFiles,
  setUploadedFiles,
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


  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files); // New uploads
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    const allowedTypes = [
      // Document types
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/html",
      // Image types
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff"
    ];

    const updatedFiles = [...uploadedFiles]; // previously selected files
    const validNewFiles = [];

    for (const file of newFiles) {
      if (updatedFiles.length + validNewFiles.length >= maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} files per message.`, {
          style: { color: 'red', border: 'none' }
        });
        break;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB.`, {
          style: { color: 'red', border: 'none' }
        });
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is an unsupported file type.`, {
          style: { color: 'red', border: 'none' }
        });
        continue;
      }

      const isDuplicate = updatedFiles.some(
        existingFile => existingFile.name === file.name && existingFile.size === file.size
      );

      if (isDuplicate) {
        toast.error(`File "${file.name}" is already selected.`, {
          style: { color: 'red', border: 'none' }
        });
        continue;
      }

      validNewFiles.push(file);
    }

    setUploadedFiles([...updatedFiles, ...validNewFiles]);

    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="inputbox">
      <div className="uploadsContainer hide-scrollbar">
        <div className="uploadsInnerContainer">
          {uploadedFiles?.map((file, index) => (
            <FileBadge key={index} file={file} onRemove={() => removeFile(index)} />
          ))}
        </div>
      </div>
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
        <div className="selectFile_box">
          <div className={`sendBtn ${uploadBtnActive && "active"}`}>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.txt,.md,.docx,.html,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff"
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={`file-upload-button ${uploadBtnActive && "active"}`}>
              <Plus />
            </label>
          </div>
        </div>
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
