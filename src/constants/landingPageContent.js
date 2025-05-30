import userAvatar from "../../public/images/user-avatar.png";
import post from "../../public/images/placeholder-image.webp";

export const SITE_CONTENT = {
  brand: "TWIQ AI",

  hero: {
    greeting: "Hey there,",
    mainHeading: "let's create a script that feels like you",
    inputPlaceholder: "Say something real",
  },

  howItWorks: {
    headline: "Turn your story into a viral script that sounds like you.",
    subheading:
      "TWIQ AI  content coach—built for heartfelt creators who want to share, connect, and go viral without losing their voice.",
    description:
      "No more generic scripts. No more second-guessing what to say. TWIQ asks the right questions and helps you tell your story with clarity and heart.",
    videoTitle: "See how TWIQ brings your voice to life",
  },

  faqs: [
    {
      question: "How does TWIQ preserve my authentic voice?",
      answer:
        "TWIQ uses advanced AI that analyzes your writing style, tone, and personality to enhance your content while maintaining your unique voice. It doesn't replace your authenticity—it amplifies it.",
    },
    {
      question: "Can I use TWIQ for different types of content?",
      answer:
        "TWIQ works with various content types including social media posts, video scripts, blog articles, email campaigns, and more. Our AI adapts to different formats while keeping your voice consistent.",
    },
    {
      question: "How quickly can I create content with TWIQ?",
      answer:
        "Most users create polished, viral-ready content in under 5 minutes. Simply input your story or idea, and TWIQ will enhance it into engaging content that resonates with your audience.",
    },
    {
      question: "Is there a limit to how much content I can create?",
      answer:
        "It depends on your plan. Our Starter plan includes 10 scripts per month, while Pro and Enterprise plans offer unlimited content creation. You can upgrade anytime as your needs grow.",
    },
    {
      question: "Can I collaborate with my team on TWIQ?",
      answer:
        "Yes! Our Enterprise plan includes team collaboration features, allowing multiple users to work together, share templates, and maintain consistent brand voice across all content.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We offer a 30-day money-back guarantee. If TWIQ doesn't help you create better content, we'll refund your subscription—no questions asked.",
    },
  ],

  pricingPlans: [
    {
      name: "Starter Plan",
      description:
        "Perfect for solopreneurs & creative rebels just getting started",
      price: "$399",
      period: "/year",
      bots: "3+ TWIQ Bots",
      botBadges: ["V", "C", "H"],
      features: [
        "Access Through TWIQ AI",
        "Access to any 3 TWIQ Bots of your choice",
        "Prompt + output screenshots to guide your flow",
        "Smart captions, video scripts, carousels & posts",
      ],
      buttonText: "Choose Starter Plan →",
      popular: false,
      theme: "light",
    },
    {
      name: "Pro Creator Plan",
      description:
        "For creators, marketers & educators ready to scale without burnout",
      price: "$799",
      period: "/year",
      bots: "All 7 TWIQ Bots",
      botBadges: ["V", "C", "L", "B"],
      features: [
        "Access Through TWIQ AI",
        "Unlimited access to all 7 TWIQ Bots",
        "Full-Year Content Planner for your business",
        "Pre-built prompt packs for every bot",
        "Workflow cheat sheets for batching",
        "Priority support + template refreshes",
        "Access to TWIQ Masterclass",
      ],
      buttonText: "Get Pro Plan →",
      popular: true,
      theme: "dark",
    },
    {
      name: "Enterprise & Teams",
      description:
        "For agencies, coaching programs, & growing brands ready to scale content ops",
      price: "$2,999",
      period: "/year",
      bots: "10+ Team Seats",
      botBadges: ["T", "A", "B", "C"],
      features: [
        "Access Through TWIQ AI",
        "Up to 10 team seats with shared access",
        "Access to TWIQ Masterclass a $199 value",
        "Full content access across all 7 bots",
        "Full-Year Content Planner",
        "Custom Bot Integrations + API support",
      ],
      buttonText: "Book a Demo →",
      popular: false,
      theme: "enterprise",
    },
  ],

  testimonials: [
    {
      id: 1,
      type: "conversation",
      messages: [
        {
          user: "User",
          avatar: userAvatar,
          text: "I used one of the TWIQ prompts in my travel niche 😊 it's a bit different but feels so me. Just experimenting!",
          hasHeart: true,
        },
        {
          user: "Assistant",
          text: "This is amazing! You used TWIQ to create this??",
          isResponse: true,
        },
      ],
      postImage: post,
      postCaption: "I did!! 😊💛 And this one too!",
      finalMessage: "Wow, these results are incredible",
      size: "large",
    },
    {
      id: 2,
      type: "simple",
      user: "Sarah M.",
      avatar: userAvatar,
      text: "TWIQ is just perfect for writing scripts… I love it! I already have my first video idea ready.",
      timestamp: "MON 08:13",
      size: "small",
    },
    {
      id: 3,
      type: "detailed",
      user: "Mike R.",
      avatar: userAvatar,
      text: "Hey Tope! I might be one of the first to try TWIQ, but wow—it’s incredible. The UI is smooth, the questions are smart, and the script I got was exactly what I was hoping for. Feels like magic. Can’t wait to use it more!",
      responses: ["yessssss", "thank you!!"],
      hasHeart: true,
      size: "medium",
    },
    {
      id: 4,
      type: "simple",
      user: "Emma K.",
      avatar: userAvatar,
      text: "TWIQ is incredible. Truly. It brought tears to my eyes. It captured my voice and message so beautifully 💜",
      badge: "excited to hear what ya think!",
      size: "medium",
    },
    {
      id: 5,
      type: "simple",
      user: "Alex P.",
      avatar: userAvatar,
      text: "I've tried it and it was sooo good. After a few questions, TWIQ gave me a script that felt so true to myself. Thank you Sarah!! 💜💜",
      size: "small",
    },
    {
      id: 6,
      type: "detailed",
      user: "Jessica L.",
      avatar: userAvatar,
      text: "I loved the interaction with TWIQ—the questions it asked helped me uncover the real message I wanted to share. The script felt raw, personal, and super relatable. This is a game changer 💛",
      hasHeart: true,
      size: "medium",
    },
    {
      id: 7,
      type: "branded",
      postImage: "/placeholder.svg?height=400&width=300",
      brandText: "TWIQ AI",
      subtitle: "Viral scripts that sound like you.",
      tagline: "be one of the first",
      responses: ["Dammmmmm!!!!", "This is Insane!!"],
      user: "Community",
      avatar: userAvatar,
      size: "large",
    },
  ],
};
