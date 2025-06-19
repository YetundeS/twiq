import post from "../../public/images/placeholder-image.webp";
import userAvatar from "../../public/images/user-avatar.png";

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
    question: "What even is TWIQ AI and how is it different from ChatGPT?",
    answer:
      "TWIQ AI is a specialized storytelling and content intelligence platform built for bold, purpose-driven brands. While ChatGPT is general-purpose, TWIQ AI is trained on our proprietary TWIQ Method to help you create emotionally intelligent content that builds trust, positions your expertise, and turns ideas into influence. Think of it as your personal brand strategist in bot form.",
  },
  {
    question: "Who is this platform actually built for?",
    answer:
      "Coaches, c-suite executives, consultants, founders, service providers, content creators, and thought leaders who are tired of sounding like everyone else. If you’ve got something meaningful to say but need help saying it in a way that converts without the cringe, TWIQ AI was made for you.",
  },
  {
    question: "What does the TWIQ Method stand for again?",
    answer:
      "TWIQ = T: Thought Leadership Content, W: What-To-Do Content (practical, tangible advice), I: Ideal Identity Connection Content, Q: Quick Help Content (actionable, immediate value). It’s the blueprint for content that connects, educates, and converts, without burning you out.",
  },
  {
    question: "How do I actually use the TWIQ bots?",
    answer:
      "Each bot comes with easy conversation starters or prompt templates. You plug in your goal, tone, topic, and target audience. The bots generate high-impact content like carousels, captions, video scripts, storytelling scripts, blog posts etc. It’s structured to feel intuitive, fast, and fun, even if you “don’t do content.”",
  },
  {
    question: "Can I still sound like me using AI?",
    answer:
      "Yes. That’s kind of the point. TWIQ AI is trained to pull out your lived experience, voice, values, and vibe, so your content still feels like you, but with more clarity and strategy behind it. No soulless templates here.",
  },
  {
    question: "What kind of content can I create with TWIQ AI?",
    answer:
      "You can create: Carousels for IG or LinkedIn, Captions and microblogs, Email copy, Thought leadership articles, Video scripts for Reels, TikToks, and keynote intros, Press-ready bios and pitches. Basically, if it has words, we got you.",
  },
  {
    question: "Do I need to be “techy” to use this?",
    answer:
      "Absolutely not. If you can send a voice note or type a DM, you can use this platform. It’s designed to feel like you’re chatting with a smart bestie who just happens to know marketing, brand psychology, and how to write copy that hits.",
  },
  {
    question: "Will this work if I have multiple offers or niches?",
    answer:
      "Yes. TWIQ is built for multi-passionate humans who don’t fit neatly in one box. The bots help you clarify your content pillars so you can speak to different aspects of your brand without confusing your audience.",
  },
  {
    question: "Is this just for social media content?",
    answer:
      "Nope. While it’s amazing for social, you can also use TWIQ for thought leadership, website copy, pitches, podcast planning, and even full brand messaging strategy. The platform grows with you.",
  },
  {
    question: "What’s one thing I should do before using TWIQ AI?",
    answer:
      "Come with a clear intention. Whether it’s building visibility, launching a new offer, or clarifying your voice—when you know what you’re trying to say or achieve, the bots will help you get there faster and more powerfully.",
  },
],


  pricingPlans: [
    {
      name: "Starter Plan",
      description:
        "Perfect for solopreneurs & creative rebels just getting started",
      price: "$399",
      priceId: 'price_1RQy76EttljLjong8JTYhW7u',
      productId: 'prod_SLfSE6oRt80Mu7',
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
      style: {
        bg: '#F2F2F2',
        color: 'black'
      }
    },
    {
      name: "Pro Creator Plan",
      description:
        "For creators, marketers & educators ready to scale without burnout",
      price: "$799",
      // priceId: "price_1RYlqzEttljLjongZXWPlrTF", // for test
      priceId: 'price_1RQy8iEttljLjong2DuStyZk',
      productId: 'prod_SLfTLYmEto0mP5',
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
      style: {
        bg: '#693D3D',
        color: 'white'
      }
    },
    {
      name: "Enterprise & Teams",
      description:
        "For agencies, coaching programs, & growing brands ready to scale content ops",
      price: "$2,999",
      // priceId: 'price_1RYlNbEttljLjongToyLbU5T', // for test
      priceId: 'price_1RQyC5EttljLjongT85sjVDc',
      productId: 'prod_SLfX1eCT161Yxe',
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
      style: {
        bg: '#5A0001',
        color: 'white'
      }
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
