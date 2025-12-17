import { useCallback } from "react";
import { Copy } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { markdownToPlainText } from "@/utils/markdownToText";

/**
 * MessageContextMenu - Right-click context menu for AI messages
 *
 * @param {Object} props
 * @param {string} props.content - Message content to copy
 * @param {React.ReactNode} props.children - Message content to wrap
 */
const MessageContextMenu = ({ content, children }) => {
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    const plainText = markdownToPlainText(content);
    copyToClipboard(plainText);
  }, [content, copyToClipboard]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-[120px]">
        <ContextMenuItem onClick={handleCopy}>
          <Copy size={14} className="mr-2" />
          Copy
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageContextMenu;
