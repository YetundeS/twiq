// Curated icon presets for the admin coach editor.
//
// Storage format on coach_profiles.icon_url:
//   - null              → default fallback (MessagesSquare in the consumer)
//   - "lucide:<Name>"   → a preset from ICON_PRESETS (this file)
//   - "http…" / "/…"    → external or bundled image URL (backwards compat
//                         with the icon_url text-input phase). Newly saved
//                         coaches always use the lucide: form.
//
// Consumers should not string-parse icon_url directly. Use
// `resolveCoachIcon(iconUrl)` — it returns a discriminated union so each
// consumer renders the appropriate variant without repeating the parse.
//
// Adding an icon here is a code+deploy step. The set is intentionally
// curated (not open-ended) so admins pick from a coherent visual language
// rather than mixing arbitrary lucide icons of different weights.

import {
  Award,
  BookOpen,
  Camera,
  FileText,
  Hash,
  Instagram,
  Layout,
  Linkedin,
  MessagesSquare,
  Mic,
  Music,
  Newspaper,
  Palette,
  PenTool,
  Podcast,
  Sparkles,
  Star,
  TrendingUp,
  Twitter,
  Type,
  Users,
  Video,
  Youtube,
  Zap,
} from "lucide-react";

// Ordered — the picker grid renders in this order (top-left → bottom-right).
// Content-creation flavor: writing, video, social, categorization.
export const ICON_PRESETS = [
  { key: "PenTool", label: "Writing", Icon: PenTool },
  { key: "FileText", label: "Documents", Icon: FileText },
  { key: "Type", label: "Type", Icon: Type },
  { key: "BookOpen", label: "Long-form", Icon: BookOpen },
  { key: "Newspaper", label: "News", Icon: Newspaper },
  { key: "Camera", label: "Photo", Icon: Camera },
  { key: "Video", label: "Video", Icon: Video },
  { key: "Youtube", label: "YouTube", Icon: Youtube },
  { key: "Mic", label: "Voice", Icon: Mic },
  { key: "Podcast", label: "Podcast", Icon: Podcast },
  { key: "Music", label: "Music", Icon: Music },
  { key: "Instagram", label: "Instagram", Icon: Instagram },
  { key: "Twitter", label: "Twitter/X", Icon: Twitter },
  { key: "Linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "Hash", label: "Hashtag", Icon: Hash },
  { key: "Layout", label: "Layout", Icon: Layout },
  { key: "Palette", label: "Palette", Icon: Palette },
  { key: "Sparkles", label: "Ideation", Icon: Sparkles },
  { key: "Zap", label: "Quick-fire", Icon: Zap },
  { key: "TrendingUp", label: "Growth", Icon: TrendingUp },
  { key: "Users", label: "Community", Icon: Users },
  { key: "MessagesSquare", label: "Messages", Icon: MessagesSquare },
  { key: "Star", label: "Highlight", Icon: Star },
  { key: "Award", label: "Award", Icon: Award },
];

const ICON_BY_KEY = new Map(ICON_PRESETS.map((p) => [p.key, p]));

// Discriminated-union return shape so each consumer branches cleanly.
// Callers should treat kind === "none" as "render the caller's fallback"
// (typically MessagesSquare for chat surfaces).
export function resolveCoachIcon(iconUrl) {
  if (!iconUrl || typeof iconUrl !== "string") return { kind: "none" };
  if (iconUrl.startsWith("lucide:")) {
    const key = iconUrl.slice("lucide:".length);
    const preset = ICON_BY_KEY.get(key);
    return preset
      ? { kind: "lucide", Icon: preset.Icon, key: preset.key, label: preset.label }
      : { kind: "none" };
  }
  // Backwards compat: previously admins pasted CDN or /images/… URLs
  // directly. Keep rendering them as images so old rows don't break.
  if (
    iconUrl.startsWith("http://") ||
    iconUrl.startsWith("https://") ||
    iconUrl.startsWith("/")
  ) {
    return { kind: "image", src: iconUrl };
  }
  return { kind: "none" };
}
