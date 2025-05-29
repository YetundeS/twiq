"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { TextEffect } from "../ui/text-effect";
import { motion } from "framer-motion";

const faqs = [
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
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            faqs.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index]);
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 text-xl leading-tight font-medium text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
            <TextEffect per="char" preset="fade">
              Frequently Asked Questions
            </TextEffect>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about TWIQ
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={
                visibleItems.includes(index)
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : {}
              }
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-sm dark:border-gray-500/50 dark:bg-gray-700/90"
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between px-6 py-6 text-left transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-600/50"
              >
                <span className="pr-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItems.includes(index)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
