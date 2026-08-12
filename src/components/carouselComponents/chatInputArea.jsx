import { MoveUp, Plus, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import SquareIcon from "../shapes/stop";
import "./cc.css";
import FileBadge from "./fileBadge";
import { validateFilesForUpload } from "@/lib/fileUploadValidation";
import { getCharCountState } from "@/lib/charCount";

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
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // max height 200px
    }
  }, [inputValue]);

  // Char count (§6.7). Informational only — hitting 'danger' doesn't
  // block send; backend quota/tiktoken remains the authoritative gate.
  const charCount = useMemo(() => getCharCountState(inputValue), [inputValue]);

  // Shared add-files pipeline: click-to-upload, drag-drop, paste-image all
  // funnel through here so validation + toast wording stay consistent.
  const addFiles = useCallback((incoming) => {
    if (!incoming?.length) return;
    setUploadedFiles((prev) => {
      const existing = prev || [];
      const { accepted, rejections } = validateFilesForUpload(incoming, existing);
      for (const r of rejections) {
        toast.error(r.message, { style: { color: "red", border: "none" } });
      }
      return accepted.length ? [...existing, ...accepted] : existing;
    });
  }, [setUploadedFiles]);

  const handleFileChange = (event) => {
    addFiles(Array.from(event.target.files || []));
    // Clear so re-selecting the same file re-fires onChange.
    event.target.value = "";
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // -- Paste handler (§6.7): if the user pastes an image (screenshot,
  // clipboard image), extract it as a File and add to the attachment
  // list. Text-only paste falls through to the default behavior.
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      addFiles(files);
    }
  }, [addFiles]);

  // -- Drag-drop handler (§6.7): full-viewport drop target. When the user
  // drags files anywhere over the browser window, show an overlay; on
  // drop, add the files. Uses document-level listeners rather than a
  // sub-tree handler so the drop target is unmistakable (Claude/ChatGPT
  // convention).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFiles = (e) => {
      const t = e.dataTransfer?.types;
      if (!t) return false;
      // DataTransferItemList vs plain array — both have `contains` on modern browsers.
      return Array.from(t).includes("Files");
    };

    const onDragEnter = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      setIsDraggingOver(true);
    };
    const onDragOver = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      // Must set dropEffect for Firefox to accept the drop.
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };
    const onDragLeave = (e) => {
      // relatedTarget is null when the cursor leaves the window.
      if (e.relatedTarget) return;
      setIsDraggingOver(false);
    };
    const onDrop = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      setIsDraggingOver(false);
      const files = Array.from(e.dataTransfer?.files || []);
      addFiles(files);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [addFiles]);

  return (
    <>
      {isDraggingOver && (
        <div className="chatDropOverlay" role="presentation">
          <div className="chatDropOverlay_card">
            <Upload className="chatDropOverlay_icon" size={32} />
            <p className="chatDropOverlay_title">Drop files to attach</p>
            <p className="chatDropOverlay_sub">
              Up to 5 files, 10 MB each. Documents and images supported.
            </p>
          </div>
        </div>
      )}
      <div className="inputbox">
        {uploadedFiles?.length > 0 && (
          <div className="uploadsContainer hide-scrollbar">
            <div className="uploadsInnerContainer">
              {uploadedFiles?.map((file, index) => (
                <FileBadge key={index} file={file} onRemove={() => removeFile(index)} />
              ))}
            </div>
          </div>
        )}
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
            onPaste={handlePaste}
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
          {charCount.visibility === "visible" && (
            <span
              className={`charCount charCount--${charCount.level}`}
              aria-live="polite"
              title="Character count — long messages may hit context limits"
            >
              {charCount.display}
            </span>
          )}
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
    </>
  );
};

export default ChatInputArea;
