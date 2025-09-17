/**
 * Test Mode Pricing Configuration
 * Used when NEXT_PUBLIC_STRIPE_TEST_MODE=true
 */

export const TEST_PRICING_PLANS = [
  {
    name: "Starter Plan",
    description: "Perfect for solopreneurs & creative rebels just getting started",
    price: "$399",
    priceId: "price_1S8HVsEttljLjongQ02DiRbX",
    productId: "prod_T4QMN9mLERYvpl",
    period: "/year",
    bots: "3+ TWIQ Bots",
    botBadges: ["L", "H", "S"],
    features: [
      "Access Through TWIQ AI",
      "Access to 3 TWIQ Bot",
      "Prompt + output screenshots to guide your flow",
      "LinkedIn, Headlines, Storyteller Bots",
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
    description: "For creators, marketers & educators ready to scale without burnout",
    price: "$799",
    priceId: "price_1S8HWXEttljLjong09mMUJv5",
    productId: "prod_T4QNvMxSVfGfzU",
    period: "/year",
    bots: "All 7 TWIQ Bots",
    botBadges: ["C", "L", "C", "V"],
    features: [
      "Everything in starter",
      "Access to 7 TWIQ Bots",
      "Prompt + output screenshots to guide your flow",
      "LinkedIn Business, Captions, Video Scripts, Carousel Bots",
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
    description: "For agencies, coaching programs, & growing brands ready to scale content ops",
    price: "$2,999",
    priceId: "price_1S8HX4EttljLjongy7t7506r",
    productId: "prod_T4QNLHlM3F0CCH",
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
    buttonText: "Get Enterprise Plan →",
    popular: false,
    theme: "enterprise",
    style: {
      bg: '#5A0001',
      color: 'white'
    }
  },
];

export const TEST_CREDIT_OPTIONS = [
  {
    label: "$25",
    price: 2500,
    input_tokens: 37500,
    output_tokens: 7500,
    cached_tokens: 15000
  },
  {
    label: "$50",
    price: 5000,
    input_tokens: 75500,
    output_tokens: 15000,
    cached_tokens: 30000,
    recommended: true
  },
  {
    label: "$75",
    price: 7500,
    input_tokens: 112500,
    output_tokens: 22500,
    cached_tokens: 45000
  },
  {
    label: "$100",
    price: 10000,
    input_tokens: 150000,
    output_tokens: 30500,
    cached_tokens: 60000
  }
];