"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-4xl px-8 py-8 md:px-16">
        {/* Header with Back Button */}
        <div className="mb-12 flex items-center justify-start">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:text-black dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="mb-8 text-3xl font-semibold">
            Privacy Policy for TWIQ
          </h1>

          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            <strong>Effective Date:</strong> May 15, 2025
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                1. Introduction
              </h2>
              <p>
                TWIQ (Thought, What to do, Ideal Identity, Quick Help) values
                your privacy. This Privacy Policy outlines how we collect, use,
                and protect your information when you use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                2. What We Collect
              </h2>
              <p>
                We collect personal data you provide, such as your name, email,
                usage data, and preferences while using TWIQ.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                3. How We Use Your Data
              </h2>
              <p>
                We use your data to improve user experience, personalize
                coaching interactions, communicate with you, and provide
                customer support.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                4. Coaches and Their Use Cases
              </h2>
              <p>
                TWIQ includes various AI-driven coaches with unique personas and
                content creation purposes:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Carousel Coach:</strong> Create scroll-stopping
                  Instagram carousels that convert.
                </li>
                <li>
                  <strong>Storyteller Coach:</strong> Craft 60-second scripts
                  for Reels, TikToks, or Shorts.
                </li>
                <li>
                  <strong>Headlines Coach:</strong> Get irresistible hooks and
                  headlines.
                </li>
                <li>
                  <strong>LinkedIn Business Coach:</strong> Professional content
                  for your company page.
                </li>
                <li>
                  <strong>LinkedIn Personal Coach:</strong> Build your personal
                  brand with expert posts.
                </li>
                <li>
                  <strong>Captions Coach:</strong> Witty, engaging captions that
                  convert.
                </li>
                <li>
                  <strong>Video Script Coach:</strong> Create scroll-stopping
                  1–2 minute video scripts.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                5. Data Sharing
              </h2>
              <p>
                We do not sell your data. We may share it with trusted services
                needed to operate TWIQ, under strict confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                6. Data Retention
              </h2>
              <p>
                We retain your information as long as your account is active or
                as needed to provide services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                7. Security
              </h2>
              <p>
                We use industry-standard measures to protect your data from
                unauthorized access or disclosure.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                8. Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                9. Contact Information
              </h2>
              <p>
                If you have questions about this policy, please contact us at:
              </p>
              <div className="mt-4 ml-4">
                <p>Email: privacy@twiq.ai</p>
                <p>Address: 123 Innovation Drive, San Francisco, CA 94105</p>
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Last updated: May 15, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
