import { useState, useCallback } from 'react';
import { Copy, FileText, Type } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useLongPress } from '@/hooks/useLongPress';
import { markdownToPlainText } from '@/utils/markdownToText';
import './messageActions.css';

const LONG_PRESS_THRESHOLD = 500; // Duration in ms to trigger long press

/**
 * MessageActions - Provides copy functionality for chat messages
 *
 * Features:
 * - Hover to show copy button
 * - Click to copy as plain text
 * - Right-click for context menu
 * - Long-press for context menu (mobile)
 * - Copy as text or markdown (AI messages only)
 *
 * @param {Object} props
 * @param {string} props.content - Message content to copy
 * @param {boolean} props.isAIMessage - Whether this is an AI message (enables markdown copy)
 */
const MessageActions = ({ content, isAIMessage = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { copyToClipboard, copied } = useCopyToClipboard();

  // Convert content to plain text (strips markdown for AI messages)
  const copyAsPlainText = useCallback(() => {
    const plainText = isAIMessage ? markdownToPlainText(content) : content;
    return copyToClipboard(plainText);
  }, [content, isAIMessage, copyToClipboard]);

  // Quick copy - converts to plain text
  const handleQuickCopy = useCallback(
    (e) => {
      e?.stopPropagation();
      copyAsPlainText();
    },
    [copyAsPlainText]
  );

  // Copy as plain text from dropdown
  const handleCopyAsText = useCallback(
    (e) => {
      e?.stopPropagation();
      copyAsPlainText();
      setDropdownOpen(false);
    },
    [copyAsPlainText]
  );

  // Copy as markdown from dropdown
  const handleCopyAsMarkdown = useCallback(
    (e) => {
      e?.stopPropagation();
      copyToClipboard(content);
      setDropdownOpen(false);
    },
    [content, copyToClipboard]
  );

  // Handle right-click
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(true);
  }, []);

  // Handle long-press (mobile)
  const longPressHandlers = useLongPress(
    () => {
      setDropdownOpen(true);
    },
    { threshold: LONG_PRESS_THRESHOLD }
  );

  return (
    <div
      className="message-actions-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
      {...longPressHandlers}
    >
      {/* Quick copy button - shown on hover */}
      {isHovered && !dropdownOpen && (
        <button
          className="message-actions-quick-copy"
          onClick={handleQuickCopy}
          aria-label="Copy message"
          type="button"
        >
          {copied ? (
            <span className="message-actions-icon copied">✓</span>
          ) : (
            <Copy className="message-actions-icon" size={14} />
          )}
        </button>
      )}

      {/* Dropdown menu - shown on right-click/long-press */}
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="message-actions-dropdown-trigger" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="message-actions-dropdown">
          <DropdownMenuItem onClick={handleCopyAsText}>
            <Type size={14} className="mr-2" />
            Copy as text
          </DropdownMenuItem>
          {isAIMessage && (
            <DropdownMenuItem onClick={handleCopyAsMarkdown}>
              <FileText size={14} className="mr-2" />
              Copy as markdown
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MessageActions;
