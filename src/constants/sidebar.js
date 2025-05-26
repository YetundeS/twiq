import {
  BriefcaseBusiness,
  Captions,
  FileUser,
  GalleryVertical, Newspaper, NotepadText, Users
} from "lucide-react";

// models
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