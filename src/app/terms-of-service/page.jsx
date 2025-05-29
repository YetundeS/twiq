"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const TermsOfService = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-4xl px-8 py-12">
        {/* Header with Back Button */}
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:text-black dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h1 className="mb-8 text-3xl font-semibold text-black dark:text-white">
            Terms and Conditions for TWIQ
          </h1>

          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            <strong>Effective Date:</strong> May 15, 2025
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <p className="mb-6 leading-relaxed">
                Welcome to{" "}
                <strong className="text-black dark:text-white">TWIQ</strong>{" "}
                (Thought, What to do, Ideal Identity, Quick Help). By accessing
                or using our platform, you agree to the following terms and
                conditions.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                1. Overview
              </h2>
              <p className="leading-relaxed">
                TWIQ provides a suite of AI-powered coaches designed to help you
                create high-impact content quickly and effectively. Each coach
                has a fun persona and a clear use case:
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Carousel Coach</strong>: "Create scroll-stopping
                  Instagram carousels that convert."
                </li>
                <li>
                  <strong>Storyteller Coach</strong>: "Craft 60-second scripts
                  for Reels, TikToks, or Shorts."
                </li>
                <li>
                  <strong>Headlines Coach</strong>: "Get irresistible hooks and
                  headlines."
                </li>
                <li>
                  <strong>LinkedIn Business Coach</strong>: "Professional
                  content for your company page."
                </li>
                <li>
                  <strong>LinkedIn Personal Coach</strong>: "Build your personal
                  brand with expert posts."
                </li>
                <li>
                  <strong>Captions Coach</strong>: "Witty, engaging captions
                  that convert."
                </li>
                <li>
                  <strong>Video Script Coach</strong>: "Create scroll-stopping
                  1-2 minute video scripts."
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                2. Accounts
              </h2>
              <p className="leading-relaxed">
                To use TWIQ, you must register an account with accurate and
                up-to-date information. You are responsible for keeping your
                login credentials secure and for all activities that occur under
                your account.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                3. Subscriptions
              </h2>
              <p className="leading-relaxed">
                TWIQ offers paid subscription plans. All subscriptions are
                billed based on your selected plan (monthly or annually). You
                may cancel at any time, and access will continue until the end
                of your billing period.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                4. Acceptable Use
              </h2>
              <p className="mb-4 leading-relaxed">
                By using TWIQ, you agree not to:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>Use the platform for illegal or unauthorized purposes</li>
                <li>Generate harmful or offensive content</li>
                <li>Violate intellectual property rights</li>
                <li>Attempt to hack or compromise the service</li>
                <li>Share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                5. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                You retain ownership of the content you create using TWIQ.
                However, we reserve the right to use anonymized data to improve
                our services. All platform technology and branding remains the
                intellectual property of TWIQ.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                6. Privacy
              </h2>
              <p className="leading-relaxed">
                We take privacy seriously. Please refer to our Privacy Policy
                for detailed information on how we collect and handle your data.
                We never sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                7. Availability
              </h2>
              <p className="leading-relaxed">
                We aim for high availability but do not guarantee uninterrupted
                service. Planned maintenance or unexpected downtime may occur.
                We are not liable for any loss during such periods.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                8. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                TWIQ’s liability is limited to the amount paid by the user in
                the 12 months before a claim. We are not responsible for
                indirect or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                9. Termination
              </h2>
              <p className="leading-relaxed">
                You may terminate your account at any time. TWIQ may also
                suspend or terminate accounts that violate these terms. Relevant
                clauses survive termination.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                10. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We may update these terms periodically. Continued use of TWIQ
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                11. Contact Information
              </h2>
              <p className="leading-relaxed">
                For questions or concerns, contact us at:
              </p>
              <div className="mt-4 ml-4">
                <p>Email: support@twiq.ai</p>
                <p>Address: 456 Creator Lane, Los Angeles, CA 90001</p>
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

export default TermsOfService;
