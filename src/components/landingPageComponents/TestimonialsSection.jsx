"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { TextEffect } from "../ui/text-effect";
import { motion } from "framer-motion";
import { SITE_CONTENT } from "@/constants/landingPageContent";

const testimonials = SITE_CONTENT.testimonials;

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
