import { Gauge, LogOut, Sparkles } from "lucide-react";


export const modelDetailsMap = {
  carousel: {
    name: "Carousel",
    description: [
      "Turn ideas into scroll-stopping carousels in seconds, not hours.",
      "Perfect for creators, coaches, and experts who want content that stands out.",
    ],
  },
  storyteller: {
    name: "Storyteller",
    description: [
      "Craft 60-second video scripts that hook, engage, and convert.",
      "Perfect for Reels, TikToks, and Shorts that truly connect with your audience.",
    ],
  },
  headlines: {
    name: "Headlines",
    description: [
      "Hook your audience in seconds with headlines they can’t ignore.",
      "Use the TWIQ Method to grab attention, drive clicks, and spotlight your message.",
    ],
  },
  "linkedin_business": {
    name: "LinkedIn Your Business",
    description: [
      "Create posts that show what your brand is good at and what it cares about.",
      "Help your company stand out and make real connections.",
    ],
  },
  "linkedin_personal": {
    name: "LinkedIn Personal",
    description: [
      "Make strong LinkedIn posts fast to build your personal brand.",
      "Great for showing your expertise and growing your network in the industry.",
    ],
  },
  captions: {
    name: "Captions",
    description: [
      "Create scroll-stopping captions full of personality in seconds.",
      "Craft witty, relatable, and engaging captions that connect with your audience.",
    ],
  },
  "video_scripts": {
    name: "Video Scripts",
    description: [
      "Craft viral 1-2 minute video scripts that captivate and convert.",
      "For storytellers and creators ready to grow their audience and go viral.",
    ],
  },
};



export const modelsOverview = [
  {
    title: "Carousel",
    description: [
      "Turn ideas into scroll-stopping carousels in seconds, not hours.",
      "Perfect for creators, coaches, and experts who want content that stands out.",
    ],
    icon: "carousel_light.png",
    link: "carousel",
  },
  {
    title: "Storyteller",
    description: [
      "Craft 60-second video scripts that hook, engage, and convert.",
      "Perfect for Reels, TikToks, and Shorts that truly connect with your audience.",
    ],
    icon: "storyteller_light.png",
    link: "storyteller",
  },
  {
    title: "Headlines",
    description: [
      "Hook your audience in seconds with headlines they can’t ignore.",
      "Use the TWIQ Method to grab attention, drive clicks, and spotlight your message.",
    ],
    icon: "headlines_light.png",
    link: "headlines",
  },
  {
    title: "LinkedIn Your Business",
    description: [
      "Create posts that show what your brand is good at and what it cares about.",
      "Help your company stand out and make real connections."
    ],
    icon: "lyb_light.png",
    link: "linkedin_business",
  },
  {
    title: "LinkedIn Personal",
    description: [
      "Make strong LinkedIn posts fast to build your personal brand.",
      "Great for showing your expertise and growing your network in the industry."
    ],
    icon: "lp_light.png",
    link: "linkedin_personal",
  },
  {
    title: "Caption",
    description: [
      "Create scroll-stopping captions full of personality in seconds.",
      "Craft witty, relatable, and engaging captions that connect with your audience.",
    ],
    icon: "caption_light.png",
    link: "captions",
  },
  {
    title: "Video Scripts",
    description: [
      "Craft viral 1-2 minute video scripts that captivate and convert.",
      "For storytellers and creators ready to grow their audience and go viral.",
    ],
    icon: "video-script_light.png",
    link: "video_scripts",
  },
];


export const accountPopMenu = [
  {
    name: "Account",
    url: "settings",
    icon: () => <Gauge className="home-icon" />,
  },
  {
    name: "Billing",
    url: "settings",
    icon: () => <Sparkles className="home-icon" />,
  },
  {
    name: "Log Out",
    url: "auth",
    icon: () => <LogOut className="home-icon" />,
  },
];


export const TWIQ_FURTHER_DESC = [
  {
    letter: 'T',
    header: 'THOUGHT LEADERSHIP CONTENT',
    desc: 'The TWIQ Method™ is a content strategy framework developed by Yetunde Shorters to help coaches, creators, and C-suite executives create content that connects, converts, and actually sounds like you. 10X your know, like and trust factor, so you can focus on being the visionary you are made to be and leave the content creation to TOPE your TWIQ BOT.'
  },
  {
    letter: 'W',
    header: 'WHAT-TO-DO',
    desc: 'This type of content showcases your expertise and builds trust in the fact that you can help. It’s your expertise on display. It is what you’re probably already doing. Teach something useful your audience can apply right now. Think step-by-step insights, tools, or strategies that make their lives easier (and make you unforgettable).'
  },
  {
    letter: 'I',
    header: 'IDEAL IDENTITY CONTENT',
    desc: 'What is the identity you have in common with those you support. Ideal Identity content is about building and maintaining a connection/relationship with those you serve. You have to connect with them personally. This content reflects their lived experience. It taps into shared values, joys, or struggles so your people feel deeply seen and ready to lean in.'
  },
  {
    letter: 'Q',
    header: 'QUICK WIN',
    desc: 'Quick help content is about proving as quickly as possible that you can get them from Point A to B. A simple way to convert them to paying customers is by helping them have quick wins with your content.⠀These include hot takes, or hacks they didn’t know they needed. This is the “save-worthy” stuff that builds instant trust and keeps your content top-of-mind.'
  },
]