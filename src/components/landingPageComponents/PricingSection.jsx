"use client";

import { handleSubscribe } from "@/apiCalls/subscribe";
import { Button } from "@/components/ui/button";
import { SITE_CONTENT } from "@/constants/landingPageContent";
import useAuthStore from "@/store/authStore";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TextEffect } from "../ui/text-effect";
import './header.css';

const pricingPlans = SITE_CONTENT.pricingPlans;

export function PricingSection({ platform }) {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const router = useRouter();
  const { user } = useAuthStore()
  const { subscribingPlanId, setSubscribingPlanId } = useSusbcriptionDialogStore()


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
    <section ref={sectionRef} className={`${!platform ? 'py-24' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className={`mb-4 text-xl leading-tight font-medium ${!platform ? "text-gray-900" : 'text-gray-100'} sm:text-2xl lg:text-3xl dark:text-gray-100`}>
            <TextEffect per="char" preset="fade">
              Choose Your Plan
            </TextEffect>
          </div>
          <p className={`mx-auto max-w-2xl text-xl ${!platform ? "text-gray-600" : 'text-gray-300'} dark:text-gray-300`}>
            Start creating viral content that’s true to you
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
              style={{ backgroundColor: plan.style.bg, color: plan.style.color }}
              className="relative flex flex-col rounded-3xl border shadow-2xl"
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6">
                  <span className="bgRed rounded-full px-4 py-2 text-sm font-medium text-white">
                    Best Value
                  </span>
                </div>
              )}

              <div className="flex h-full flex-col p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="mb-3 text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm">{plan.description}</p>
                </div>

                {/* Bots */}
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-semibold mr-[10px]">{plan.bots}</span>
                    <div className="flex gap-1">
                      {plan.botBadges.map((badge, badgeIndex) => (
                        <div
                          key={badgeIndex}
                          className="flex h-8 w-8 items-center ml-[-10px] justify-center rounded-full border-2 border-white text-sm font-bold bgRed text-white"
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
                      <div className="mt-0.5 mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bgRed">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mt-auto mb-6 flex items-baseline justify-between">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-lg">{plan.period}</span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={() => {
                    if (platform) {
                      setSubscribingPlanId(plan?.priceId);
                      handleSubscribe(plan?.priceId, user, () => setSubscribingPlanId(null));
                    } else {
                      router.push(`/`);
                    }
                  }}
                  className="w-full cursor-pointer rounded-xl py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 bg-white text-black"
                >
                  {subscribingPlanId !== plan.priceId ? (
                    <p>{plan.buttonText}</p>
                  ) : (
                    <CircularProgress color="inherit" size="17px" />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
