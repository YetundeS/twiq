"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "../ui/text-effect";

const pricingPlans = [
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
];

export function PricingSection() {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pricingPlans.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getCardTheme = (theme) => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 border-gray-800 text-white";
      case "enterprise":
        return "bg-purple-700 border-purple-600 text-white";
      default:
        return "bg-gray-100 border-gray-200 text-gray-900";
    }
  };

  const getTextColor = (theme, type) => {
    if (theme === "enterprise")
      return type === "primary" ? "text-white" : "text-purple-100";
    if (theme === "dark")
      return type === "primary" ? "text-white" : "text-gray-300";
    return type === "primary" ? "text-gray-900" : "text-gray-600";
  };

  const getButtonStyle = (theme) =>
    theme === "enterprise"
      ? "bg-gray-900 hover:bg-gray-800 text-white"
      : "bg-purple-600 hover:bg-purple-700 text-white";

  return (
    <section ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 text-xl leading-tight font-medium text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
            <TextEffect per="char" preset="fade">
              Choose Your Plan
            </TextEffect>
          </div>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Start creating viral content that feels authentically you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
              animate={
                visibleCards.includes(index)
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : {}
              }
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative rounded-3xl border shadow-2xl ${getCardTheme(plan.theme)}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6">
                  <span className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">
                    Best Value
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3
                    className={`mb-3 text-2xl font-bold ${getTextColor(plan.theme, "primary")}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm ${getTextColor(plan.theme, "secondary")}`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Bots */}
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        plan.theme === "enterprise"
                          ? "text-purple-100"
                          : plan.theme === "dark"
                            ? "text-purple-400"
                            : "text-purple-600"
                      }`}
                    >
                      {plan.bots}
                    </span>
                    <div className="flex gap-1">
                      {plan.botBadges.map((badge, badgeIndex) => (
                        <div
                          key={badgeIndex}
                          className={`-m-[5px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold ${
                            plan.theme === "enterprise"
                              ? "bg-gray-900 text-white"
                              : "bg-purple-600 text-white"
                          }`}
                        >
                          {badge}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div
                        className={`mt-0.5 mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                          plan.theme === "enterprise"
                            ? "bg-green-500"
                            : "bg-purple-600"
                        }`}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span
                        className={`text-sm ${getTextColor(plan.theme, "secondary")}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-6 flex items-baseline justify-between">
                  <div className="flex items-baseline">
                    <span
                      className={`text-4xl font-bold ${getTextColor(plan.theme, "primary")}`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`ml-1 text-lg ${getTextColor(plan.theme, "secondary")}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  className={`w-full rounded-xl py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 ${getButtonStyle(plan.theme)}`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
