/**
 * Test Mode Pricing Configuration
 * Used when NEXT_PUBLIC_STRIPE_TEST_MODE=true
 */

export const TEST_PRICING_PLANS = [
  {
    name: "Starter Plan",
    price: "$399",
    period: "year",
    description: "Perfect for content creators getting started",
    features: [
      "Access to all 7 content creation AI assistants",
      "498K input tokens monthly",
      "99K output tokens monthly",
      "199K cached tokens monthly",
      "Download generated content",
      "Priority email support"
    ],
    priceId: "price_1S8HVsEttljLjongQ02DiRbX", // Replace with actual test price ID
    popular: false,
  },
  {
    name: "Pro Creator Plan",
    price: "$799",
    period: "year",
    description: "For serious content creators and small teams",
    features: [
      "Everything in Starter Plan",
      "998K input tokens monthly",
      "199K output tokens monthly",
      "399K cached tokens monthly",
      "Advanced content templates",
      "Team collaboration features",
      "Priority chat support"
    ],
    priceId: "price_1S8HWXEttljLjong09mMUJv5", // Replace with actual test price ID
    popular: true,
  },
  {
    name: "Enterprise & Teams",
    price: "$2,999",
    period: "year",
    description: "For large teams and enterprises",
    features: [
      "Everything in Pro Plan",
      "3.7M input tokens monthly",
      "749K output tokens monthly",
      "1.5M cached tokens monthly",
      "Custom content workflows",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee"
    ],
    priceId: "price_1S8HX4EttljLjongy7t7506r", // Replace with actual test price ID
    popular: false,
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