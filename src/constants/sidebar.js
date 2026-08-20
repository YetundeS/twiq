import {
  BriefcaseBusiness,
  Captions,
  FileUser,
  GalleryVertical,
  MessagesSquare,
  Newspaper, NotepadText, Users
} from "lucide-react";
import { resolveCoachIcon } from "./coachIconPresets";

// Per-slug icon map. Icons are React components — can't come from
// the backend — so they stay local. Admin-created coaches whose slug
// isn't in this map get the generic MessagesSquare fallback until
// someone adds a mapping here.
//
// Consumers should use getCoachIcon(slug) rather than importing the
// map directly, so the fallback logic lives in one place.
export const SLUG_ICONS = {
  carousel: GalleryVertical,
  storyteller: Users,
  headlines: Newspaper,
  linkedin_business: BriefcaseBusiness,
  linkedin_personal: FileUser,
  captions: Captions,
  video_scripts: NotepadText,
};

// Returns a React component for the coach's sidebar/picker icon.
// Precedence: coach.icon_url (admin-picked preset or legacy URL) →
// SLUG_ICONS[slug] (curated for seed coaches) → MessagesSquare.
//
// icon_url now stores a preset key ("lucide:<Name>") from the admin
// editor's preset picker. Legacy URL rows still render as <img> via
// the resolver's backwards-compat branch.
export function getCoachIcon(slug, coach) {
  const resolved = resolveCoachIcon(coach?.icon_url);
  if (resolved.kind === "lucide") return resolved.Icon;
  if (resolved.kind === "image") {
    const CustomIcon = function CustomCoachIcon({ className }) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved.src}
          alt=""
          className={className}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      );
    };
    return CustomIcon;
  }
  return SLUG_ICONS[slug] || MessagesSquare;
}

// Legacy static coach list — kept ONLY for backwards compatibility
// with the 6 consumers not yet migrated to useCoaches (search-result
// grouping, usage panel, metrics panel, help page, coach identity
// chip, model templates). Those do slug→name lookup against this
// array; migration is a scoped follow-up.
//
// New code should use useCoaches() from @/hooks/useCoaches — it
// reads GET /api/coaches so admin-added / admin-archived changes take
// effect on the user side immediately.
export const models = [
  {
    name: "Carousel",
    url: "carousel",
    icon: () => <GalleryVertical className="home-icon" />,
  },
  {
    name: "Storyteller",
    url: "storyteller",
    icon: () => <Users className="home-icon" />,
  },
  {
    name: "Headlines",
    url: "headlines",
    icon: () => <Newspaper className="home-icon" />,
  },
  {
    name: "LinkedIn Your Business",
    url: "linkedin_business",
    icon: () => <BriefcaseBusiness className="home-icon" />,
  },
  {
    name: "LinkedIn Personal",
    url: "linkedin_personal",
    icon: () => <FileUser className="home-icon" />,
  },
  {
    name: "Captions",
    url: "captions",
    icon: () => <Captions className="home-icon" />,
  },
  {
    name: "Video Scripts",
    url: "video_scripts",
    icon: () => <NotepadText className="home-icon" />,
  },
];

export const ORGANIZATIONAL_ROLES = ["admin", "developer"];