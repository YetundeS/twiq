import React, { useState, useEffect, useRef } from "react";
import post1 from "../../../public/images/reviews/t1.png";
import post2 from "../../../public/images/reviews/t2.png";
import post3 from "../../../public/images/reviews/t3.png";
import post4 from "../../../public/images/reviews/t4.png";
import post5 from "../../../public/images/reviews/t5.png";
import post6 from "../../../public/images/reviews/t6.png";
import post7 from "../../../public/images/reviews/t7.png";
import post8 from "../../../public/images/reviews/t8.png";
import post9 from "../../../public/images/reviews/t9.png";

const Testimonials = () => {
  const [visibleImages, setVisibleImages] = useState(new Set());
  const containerRef = useRef(null);
  const imageRefs = useRef([]);

  // Array of post images - using placeholder images for demonstration
  const testimonialImages = [
    post1,
    post2,
    post3,
    post4,
    post5,
    post6,
    post7,
    post8,
    post9,
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setVisibleImages((prev) => new Set([...prev, index]));
        }
      });
    }, observerOptions);

    // Observe each image with a slight delay for staggered animation
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          observer.observe(ref);
        }, index * 100);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen px-8 py-20"
      style={{ background: "transparent" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-5xl font-bold text-gray-900">
            What Creators Are Saying
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            See how our tool is transforming the way content creators approach
            their scriptwriting workflow
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid gap-8"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gridAutoRows: "minmax(280px, auto)",
          }}
        >
          {testimonialImages.map((image, index) => (
            <div
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              data-index={index}
              className="group relative cursor-pointer"
            >
              <div className="relative transform overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <img
                  src={image}
                  alt={`Testimonial ${index + 1}`}
                  className={`h-72 w-full object-cover transition-all duration-1000 ease-out ${
                    visibleImages.has(index)
                      ? "opacity-100 filter-none"
                      : "opacity-30 brightness-200 contrast-50 filter"
                  }`}
                  style={{
                    transform: visibleImages.has(index)
                      ? "scale(1)"
                      : "scale(1.1)",
                    filter: visibleImages.has(index)
                      ? "none"
                      : "brightness(2) contrast(0.5) blur(1px)",
                  }}
                />

                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Animated border */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 transition-all duration-1000 ${
                    visibleImages.has(index)
                      ? "border-blue-500/50 shadow-lg shadow-blue-500/20"
                      : "border-transparent"
                  }`}
                />

                {/* Loading indicator */}
                {!visibleImages.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                  </div>
                )}
              </div>

              {/* Index number */}
              <div
                className={`absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white transition-all duration-700 ${
                  visibleImages.has(index)
                    ? "scale-100 transform opacity-100"
                    : "scale-0 transform opacity-0"
                }`}
                style={{
                  transitionDelay: visibleImages.has(index) ? "500ms" : "0ms",
                }}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom call-to-action */}
        <div className="mt-16 text-center">
          <div
            className={`transition-all duration-1000 ${
              visibleImages.size > 0
                ? "translate-y-0 transform opacity-100"
                : "translate-y-8 transform opacity-0"
            }`}
          >
            <p className="mb-6 text-lg text-gray-700">
              Join thousands of creators who've transformed their workflow
            </p>
            <button className="transform rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
