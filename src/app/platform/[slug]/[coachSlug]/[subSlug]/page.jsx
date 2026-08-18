// Dynamic session page — /platform/[org]/[coachSlug]/[sessionId]/.
// Same surface as the new-chat page; useAssistantChat derives the
// sessionId from pathname.

import CoachChatSurface from "@/components/carouselComponents/CoachChatSurface";

export default function CoachSessionPage() {
  return <CoachChatSurface />;
}
