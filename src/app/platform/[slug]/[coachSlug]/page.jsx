// Dynamic new-chat page for every coach. Replaces the 7 hardcoded
// coach directories (carousel/, storyteller/, headlines/, …). Any coach
// created via the admin panel is routable via /platform/[org]/[coachSlug]/
// as long as its slug isn't in RESERVED_SLUGS (see backend
// controllers/coachProfilesController.js — those would be shadowed by
// the static sibling routes admin/ and settings/).

import CoachChatSurface from "@/components/carouselComponents/CoachChatSurface";

export default function CoachNewChatPage() {
  return <CoachChatSurface />;
}
