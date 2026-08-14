// Public shared-view (Phase 3 track 2). Server Component — server-side
// fetch to the backend's unauthenticated /shared/:slug endpoint so the
// SSR HTML ships fully populated and the page works with JS off.
//
// Backend contract (§6.16 in twiq-backend):
//   200 → { session: { assistant_slug, title, created_at },
//            messages: [{ id, sender, content, created_at, has_files, model, linkedFiles: [{name}] }] }
//   404 → { error: 'Not found' }             — bad slug OR revoked
//   410 → { error: 'This shared link has expired' }
//
// We surface 404 via Next's notFound() (drops into not-found.jsx below)
// and 410 via a distinct expired panel so viewers know the link WAS real.

import { notFound } from "next/navigation";
import { fetchSharedPublicSession } from "@/apiCalls/shareSession";
import SharedChatView from "./SharedChatView";
import SharedExpired from "./SharedExpired";

export const metadata = {
  title: "Shared chat — TWIQ",
  robots: { index: false, follow: false },
};

// Always render fresh; a shared link's expiration state can flip between
// requests and we never want to hand back a stale cached HTML.
export const dynamic = "force-dynamic";

export default async function SharedSessionPage({ params }) {
  const { slug } = await params;
  const { status, body } = await fetchSharedPublicSession(slug);

  if (status === 404) notFound();
  if (status === 410) return <SharedExpired />;
  if (status !== 200 || !body?.session) {
    // Unknown error — same UX as expired minus the "expired" copy.
    return <SharedExpired unknown />;
  }

  return <SharedChatView session={body.session} messages={body.messages || []} />;
}
