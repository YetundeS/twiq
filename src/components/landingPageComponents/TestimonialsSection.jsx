"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { TextEffect } from "../ui/text-effect";
import userAvatar from "../../../public/images/user-avatar.png";
import post from "../../../public/images/switching-image2.webp";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    type: "conversation",
    messages: [
      {
        user: "User",
        avatar: userAvatar,
        text: "I wanted to share what I came up with using your prompts 😊 a little different... but still experimenting on how I can use it in my travel niche 😊",
        hasHeart: true,
      },
      {
        user: "Assistant",
        text: "Ahh this is amazing! You used the tool to create this??",
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
    text: "It's just perfect to write scripts... I love it! I already have first idea for video and will film with this script",
    timestamp: "MON 08:13",
    size: "small",
  },
  {
    id: 3,
    type: "detailed",
    user: "Mike R.",
    avatar: userAvatar,
    text: "Hey Sarah! I'm not sure if I'm the first one to try it, but wow—this tool is incredible! The user interface is so smooth, the model's logic is spot on, and the output is exactly what I was hoping for. Plus the speed of the site is just perfect. You've truly created something amazing! Thank you for putting this together and for all the fantastic content you share. I'll send over the input and output now!",
    responses: ["yessssss", "thank you!!"],
    hasHeart: true,
    size: "medium",
  },
  {
    id: 4,
    type: "simple",
    user: "Emma K.",
    avatar: userAvatar,
    text: "This is incredible! Truly amazing. It brought tears to my eyes. Thank you, Sarah! Your impact is immeasurable. I am all the more brave for it 💜",
    badge: "excited to hear what ya think!",
    size: "medium",
  },
  {
    id: 5,
    type: "simple",
    user: "Alex P.",
    avatar: userAvatar,
    text: "I've tried it and it was soooo good. After a few questions it developed a beautiful script really true to myself. Thank you Sarah!! 💜💜",
    size: "small",
  },
  {
    id: 6,
    type: "detailed",
    user: "Jessica L.",
    avatar: userAvatar,
    text: "I loved the interaction with the tool and the fact that it asked really good questions before creating the script. The script felt personal, relatable and conveyed the emotion I was going for. Loved it! Thanks for sharing this tool 💛",
    hasHeart: true,
    size: "medium",
  },
  {
    id: 7,
    type: "branded",
    postImage: "/placeholder.svg?height=400&width=300",
    brandText: "Viral You AI",
    subtitle: "Viral scripts that feel like you.",
    tagline: "be one of the first",
    responses: ["Dammmmmm!!!!", "This is Insane!!"],
    user: "Community",
    avatar: userAvatar,
    size: "large",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            testimonials.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
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

  const getColumnItems = (columnIndex) => {
    const columns = [
      [testimonials[0]], // Left column - large conversation
      [testimonials[1], testimonials[2]], // Middle column - small + medium
      [testimonials[3], testimonials[4], testimonials[5]], // Right column - medium + small + medium
    ];
    return columns[columnIndex] || [];
  };

  return (
    <section ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="text-xl leading-tight font-medium text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
            <TextEffect per="char" preset="fade">
              It just works.
            </TextEffect>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            {getColumnItems(0).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isVisible={visibleCards.includes(
                  testimonials.indexOf(testimonial),
                )}
                delay={testimonials.indexOf(testimonial) * 300}
              />
            ))}
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {getColumnItems(1).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isVisible={visibleCards.includes(
                  testimonials.indexOf(testimonial),
                )}
                delay={testimonials.indexOf(testimonial) * 300}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {getColumnItems(2).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isVisible={visibleCards.includes(
                  testimonials.indexOf(testimonial),
                )}
                delay={testimonials.indexOf(testimonial) * 300}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, isVisible, delay }) {
  if (testimonial.type === "conversation") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
        animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.6, delay: delay / 1000 }}
        className="rounded-3xl bg-gray-900 p-6 dark:bg-gray-800"
      >
        {/* Initial message */}
        <div className="mb-4 flex items-start gap-3">
          <Image
            src={testimonial.messages[0].avatar || "/placeholder.svg"}
            alt="User avatar"
            width={40}
            height={40}
            className="flex-shrink-0 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-white">
              {testimonial.messages[0].text}
            </p>
            {testimonial.messages[0].hasHeart && (
              <div className="mt-2 text-red-500">❤️</div>
            )}
          </div>
        </div>

        {/* Response */}
        <div className="mb-4 ml-12 rounded-2xl bg-purple-600 p-4">
          <p className="text-sm text-white">{testimonial.messages[1].text}</p>
        </div>

        {/* Post image */}
        <div className="mb-4">
          <Image
            src={testimonial.postImage || "/placeholder.svg"}
            alt="Social media post"
            width={250}
            height={300}
            className="w-full rounded-2xl object-cover"
          />
        </div>

        {/* Caption */}
        <div className="mb-4 flex items-start gap-3">
          <Image
            src={testimonial.messages[0].avatar || "/placeholder.svg"}
            alt="User avatar"
            width={40}
            height={40}
            className="flex-shrink-0 rounded-full"
          />
          <p className="text-sm text-white">{testimonial.postCaption}</p>
        </div>

        {/* Final response */}
        <div className="ml-12 rounded-2xl bg-purple-600 p-4">
          <p className="text-sm text-white">{testimonial.finalMessage}</p>
        </div>
      </motion.div>
    );
  }

  if (testimonial.type === "simple") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
        animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.6, delay: delay / 1000 }}
        className="rounded-3xl bg-gray-900 p-6 dark:bg-gray-800"
      >
        {testimonial.timestamp && (
          <div className="mb-3 text-center text-xs text-gray-400">
            {testimonial.timestamp}
          </div>
        )}
        {testimonial.badge && (
          <div className="mb-3 inline-block rounded-full bg-purple-600 px-3 py-1 text-xs text-white">
            {testimonial.badge}
          </div>
        )}
        <div className="flex items-start gap-3">
          <Image
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.user}
            width={40}
            height={40}
            className="flex-shrink-0 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-white">
              {testimonial.text}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (testimonial.type === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
        animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.6, delay: delay / 1000 }}
        className="rounded-3xl bg-gray-900 p-6 dark:bg-gray-800"
      >
        <div className="mb-4 flex items-start gap-3">
          <Image
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.user}
            width={40}
            height={40}
            className="flex-shrink-0 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-white">
              {testimonial.text}
            </p>
            {testimonial.hasHeart && (
              <div className="mt-2 text-red-500">❤️</div>
            )}
          </div>
        </div>

        {testimonial.responses && (
          <div className="ml-12 space-y-2">
            {testimonial.responses.map((response, index) => (
              <div key={index} className="rounded-2xl bg-purple-600 p-3">
                <p className="text-sm text-white">{response}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  if (testimonial.type === "branded") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
        animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.6, delay: delay / 1000 }}
        className="rounded-3xl bg-gray-900 p-6 dark:bg-gray-800"
      >
        {/* Branded post image */}
        <div className="mb-4">
          <Image
            src={testimonial.postImage || "/placeholder.svg"}
            alt="Viral You AI branded post"
            width={300}
            height={400}
            className="w-full rounded-2xl object-cover"
          />
        </div>

        {/* Responses */}
        <div className="space-y-3">
          {testimonial.responses.map((response, index) => (
            <div key={index} className="flex items-start gap-3">
              <Image
                src={testimonial.avatar || "/placeholder.svg"}
                alt="User avatar"
                width={32}
                height={32}
                className="flex-shrink-0 rounded-full"
              />
              <p className="text-sm text-white">{response}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}
