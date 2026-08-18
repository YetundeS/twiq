import {
  BriefcaseBusiness,
  Captions,
  FileUser,
  GalleryVertical,
  MessagesSquare,
  Newspaper, NotepadText, Users
} from "lucide-react";

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
// Precedence: coach.icon_url (admin-supplied) → SLUG_ICONS[slug]
// (curated for seed coaches) → MessagesSquare (generic fallback).
//
// When coach.icon_url is present we render an <img> wrapper that
// mimics the sizing conventions of lucide icons (via className).
// Falls back silently to MessagesSquare if the URL 404s so a broken
// asset doesn't leave a blank slot in the sidebar.
export function getCoachIcon(slug, coach) {
  if (coach?.icon_url) {
    const iconUrl = coach.icon_url;
    const CustomIcon = function CustomCoachIcon({ className }) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconUrl}
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