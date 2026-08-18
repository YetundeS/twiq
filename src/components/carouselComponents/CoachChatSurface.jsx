"use client";

// Single canonical chat surface for every coach. Rendered by both the
// dynamic new-chat page (/platform/[slug]/[coachSlug]/) and the dynamic
// session page (/platform/[slug]/[coachSlug]/[subSlug]/) — same JSX,
// hook figures out sessionId from pathname.
//
// Reads coachSlug from useParams. Display name derived from the sidebar
// constants map for hasAccess() lookup consistency; admin-added coaches
// fall back to the slug (any new coach whose slug isn't in the hardcoded
// plan-tier arrays will need admin to update those arrays before Starter/
// Pro gating kicks in — pre-existing behavior, not a regression from
// this refactor).

import ChatInputArea from "@/components/carouselComponents/chatInputArea";
import ChatMessageWindow from "@/components/carouselComponents/chatMessageWindow";
import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import PlatformTop from "@/components/dashboardComponent/platformTop";
import TwiqBg from "@/components/dashboardComponent/twiqBg";
import useAssistantChat from "@/hooks/useAssistantChat";
import { models } from "@/constants/sidebar";
import "@/styles/platformStyles.css";
import { PanelRightOpen } from "lucide-react";
import { useParams } from "next/navigation";

export default function CoachChatSurface() {
  const params = useParams();
  const coachSlug =
    typeof params?.coachSlug === "string" ? params.coachSlug : "";
  const displayName =
    models.find((m) => m.url === coachSlug)?.name || coachSlug || "Coach";

  const {
    toggleSidebar,
    isFetchingChats,
    inputValue,
    setInputValue,
    sendMessage,
    closeStreaming,
    streamingData,
    streaming,
    sendBtnActive,
    uploadBtnActive,
    setUploadedFiles,
    uploadedFiles,
    chats,
    messagesEndRef,
    aiSuggestions,
    showToggleChat,
    // §6.6 action rail — retry-last-error / regenerate / edit-user-message.
    // Missing these on the surface silently disables the whole action rail
    // for every coach after the routing refactor (regression caught in
    // qcheck H2). Some of the deleted per-coach pages plumbed these; some
    // didn't — the drift is why it wasn't obvious at review time.
    retryLastMessage,
    regenerateAssistantReply,
    editUserMessage,
    coach,
  } = useAssistantChat(displayName, coachSlug);

  return (
    <div className="page_content">
      <div className="pageTop">
        {showToggleChat && (
          <>
            <div onClick={toggleSidebar} className="pageTop_iconWrapper">
              <PanelRightOpen className="pageIcon" size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <PlatformTop />
      </div>
      <TwiqBg />
      <div className="pageBody">
        <div className="pageBody_innerBox">
          <ChatMessageWindow
            chats={chats}
            streamingData={streamingData}
            streaming={streaming}
            messagesEndRef={messagesEndRef}
            setInputValue={setInputValue}
            isFetchingChats={isFetchingChats}
            uploadedFiles={uploadedFiles}
            assistantSlug={coachSlug}
            onRetryLast={retryLastMessage}
            onRegenerate={regenerateAssistantReply}
            onEdit={editUserMessage}
            coach={coach}
          />
          <ChatInputArea
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMessage={sendMessage}
            closeStreaming={closeStreaming}
            streamingData={streamingData}
            sendBtnActive={sendBtnActive}
            aiSuggestions={aiSuggestions}
            uploadBtnActive={uploadBtnActive}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </div>
    </div>
  );
}
