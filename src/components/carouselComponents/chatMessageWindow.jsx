import { memo, useMemo, useState } from "react";
import ModelTemplates from "../modelsComponent/modelTemplates";
import "./cc.css";
import ChatMessage, { ChatLoader } from "./chatMessage/chatMessage";
import MessageListSkeleton from "./MessageListSkeleton";
// ModelPicker moved to ChatInputArea so it stays visible while the message
// list scrolls (§6.9 UX fix — was living up here inside the scrolling
// container, so you had to scroll back to the top to switch models).
// Search-fragment scroll-into-view (§6.11 polish) also moved out — into
// useAssistantChat, where it has access to loadMoreMessages to page
// backwards when the target is older than the loaded window.

const ChatMessageWindow = memo(({
  chats,
  streamingData,
  streaming,
  messagesEndRef,
  setInputValue,
  assistantSlug,
  isFetchingChats,
  uploadedFiles,
  loadMoreMessages,
  messagesHasMore,
  isLoadingMessages,
  onRetryLast,
  onRegenerate,
  onEdit,
  coach
}) => {

  // parent_id → the sibling id the user is currently viewing. Empty by
  // default → the most-recent sibling wins (matches the backend model
  // filter and matches user expectation post-regenerate).
  const [activeByParent, setActiveByParent] = useState({});

  // Group messages that share a parent_id. Messages without parent_id are
  // never in a group (they're the parent user turns + all legacy rows).
  const siblingGroups = useMemo(() => {
    const groups = new Map();
    for (const m of chats || []) {
      const parentId = m?.parent_id;
      if (parentId == null) continue;
      if (!groups.has(parentId)) groups.set(parentId, []);
      groups.get(parentId).push(m);
    }
    for (const arr of groups.values()) {
      arr.sort(
        (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
      );
    }
    return groups;
  }, [chats]);

  // Memoize the chat messages to avoid re-rendering all messages when only streaming data changes.
  // The retry callback is only wired to the LAST message when it's an errored assistant
  // reply — retrying an older error doesn't make sense (the conversation moved on).
  const chatMessages = useMemo(() => {
    if (!chats?.length) return null;

    const lastIndex = chats.length - 1;
    return chats.map((chat, i) => {
      const isLast = i === lastIndex;
      const isErroredAssistant = chat?.sender === "assistant" && chat?.status === "error";

      // Skip losing siblings — for each parent_id group, only render the
      // active one (default: last i.e. most recent).
      const group = chat?.parent_id != null ? siblingGroups.get(chat.parent_id) : null;
      let siblingInfo = null;
      if (group && group.length > 1) {
        const activeId = activeByParent[chat.parent_id] ?? group[group.length - 1].id;
        if (chat.id !== activeId) return null;
        const index = group.findIndex((m) => m.id === activeId);
        siblingInfo = {
          index,
          total: group.length,
          onPrev: () => {
            if (index > 0) {
              setActiveByParent((prev) => ({
                ...prev,
                [chat.parent_id]: group[index - 1].id,
              }));
            }
          },
          onNext: () => {
            if (index < group.length - 1) {
              setActiveByParent((prev) => ({
                ...prev,
                [chat.parent_id]: group[index + 1].id,
              }));
            }
          },
        };
      }

      return (
        <ChatMessage
          uploadedFiles={uploadedFiles}
          chat={chat}
          assistantSlug={assistantSlug}
          coach={coach}
          siblingInfo={siblingInfo}
          onRetry={isLast && isErroredAssistant ? onRetryLast : undefined}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          setInputValue={setInputValue}
          key={chat.id || `${chat.sessionID}-${i}`} // Use unique key if available
        />
      );
    });
  }, [chats, uploadedFiles, assistantSlug, coach, siblingGroups, activeByParent, onRetryLast, onRegenerate, onEdit, setInputValue]);

  // Memoize the streaming message to avoid unnecessary re-renders
  const streamingMessage = useMemo(() => {
    if (!streaming) return null;

    if (streamingData) {
      return (
        <ChatMessage
          chat={{ content: streamingData, sender: "assistant" }}
          assistantSlug={assistantSlug}
        />
      );
    }

    return <ChatLoader />;
  }, [streaming, streamingData, assistantSlug]);

  // Load more messages button for infinite scroll
  const loadMoreButton = useMemo(() => {
    if (!messagesHasMore || isLoadingMessages) return null;
    
    return (
      <button 
        onClick={loadMoreMessages}
        className="load-more-messages-btn"
        disabled={isLoadingMessages}
      >
        {isLoadingMessages ? 'Loading...' : 'Load older messages'}
      </button>
    );
  }, [messagesHasMore, isLoadingMessages, loadMoreMessages]);
  
  if (isFetchingChats) {
    return (
      <div className="chats_area">
        <div className="chats_area_container">
          <MessageListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="chats_area">
      <div className="chats_area_container">
        {chats?.length > 0 ? (
          <>
            {loadMoreButton}
            {chatMessages}
            {streamingMessage}
            <div className="messagesEnd" ref={messagesEndRef}></div>
          </>
        ) : (
          <div className="newChatArea">
            <ModelTemplates assistantSlug={assistantSlug} setInputValue={setInputValue} coach={coach} />
            <div className="messagesEnd" ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessageWindow.displayName = 'ChatMessageWindow';

export default ChatMessageWindow;
