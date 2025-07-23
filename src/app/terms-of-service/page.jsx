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
            TERMS OF PURCHASE & SERVICE
          </h1>

          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            <strong>Last Updated:</strong> July 22nd, 2025
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <p className="mb-6 leading-relaxed">
                Thank you for your support and interest in{" "}
                <strong className="text-black dark:text-white">TWIQ ai</strong>. We are so thankful to have you as a part of our SaaS product.
              </p>
              <p className="mb-6 leading-relaxed">
                Please review these Terms of Purchase very carefully. By purchasing our products and/or services, you are agreeing to these and are expressing that you have been given reasonable access to review these terms prior to your purchase. These Terms are binding as of the date you purchase or access our products and/or services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                1. General Purpose
              </h2>
              <p className="leading-relaxed">
                These Terms are between you ("Purchaser," "you," "your") and ICY COACHING & CONSULTING owner of TWIQ AI ("Company," "we," "us," "our") for the purpose of purchasing or otherwise obtaining digital products and/or services (our "Products") whether through the Company's website at https://www.icyconsulting.com/about/ or any related domains or subdomains (the "Website"), or in person. The Company and the Purchaser will collectively be referred to as "Parties," and each individually as a "Party."
              </p>
              <p className="mt-4 leading-relaxed">
                By clicking "Add to Cart," "Buy Now," or any other phrase on the purchase button, submitting a payment electronically or in-person, or otherwise subscribing through the Website, you are agreeing to adhere to and be bound by following terms and conditions, together with the Terms of Use and our Privacy Policy, all of which are hereby incorporated by reference.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                2. Scope of Products
              </h2>
              <p className="leading-relaxed">
                Our Products include but are not limited to: TWIQ.AI, digital downloads, templates, online courses, freelance services, masterclasses, intensives, retreats, masterminds, workshops, etc.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                3. Product Delivery
              </h2>
              <p className="leading-relaxed">
                When you make a purchase and submit your payment, you will be provided with the Products as detailed on the Website. Please note that product delivery will differ based on when you make your purchase and if it is a digital or physical product. For more information, please refer to the product description, your receipt of purchase delivered by email, etc.
              </p>
              <p className="mt-4 leading-relaxed">
                If the Product is listed as presale or pre-order, the order will be delivered as detailed on the Website. The Company will make all reasonable efforts to meet any estimated delivery dates. Should the Company be unable to meet estimated timelines for delivery of presale digital Products, the Company will have the sole discretion as to whether to issue a refund. If we verify with our automated system that your download was never emailed to you, you can get a refund.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                4. Product Disclaimer
              </h2>
              <p className="leading-relaxed">
                You understand and agree that the content included in any of the Products is merely meant to be informational in nature and does not represent any level of legal, medical, financial, or other professional industry-specific advice. As such, our Company will not be responsible for any damages that result from the use of the Products.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                5. No Warranties + No Guarantees
              </h2>
              <p className="leading-relaxed">
                We are providing the Products on this Website on an "As-Is" basis for individual use by you at your own risk and without any warranties, whether express or implied, including, but not limited to warranties of title; merchantability; fitness for a particular use; or any rights or licenses in these Terms. The Company makes no warranty as to the accuracy and reliability of information set forth in the Products, the Website, and Company-related documentation.
              </p>
              <p className="mt-4 leading-relaxed">
                You understand and agree that purchasing the Products does not guarantee specific results, including financial or other business gains for you personally and/or for the business. The information included in the Products is provided for informational purposes only and you are responsible for implementing any business practices or suggested actions found within these Products.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                6. Payment + Billing
              </h2>
              <p className="leading-relaxed">
                By providing the Company with your preferred payment method, you represent that you: (i) are authorized to use, and (ii) authorize the Company to charge that payment method (the "Authorized Payment Method") for any fees related to your purchase of the Products, including without limitation fees relating to any paid feature of the Website and/or subscription service of the Company in which you have chosen to enroll (collectively, the "Fees").
              </p>
              <p className="mt-4 leading-relaxed">
                If you are taking advantage of any limited time trial-period offer and you do not cancel the service on or before the last day of the trial period, you are authorizing us to charge your payment method for the service. Unless otherwise indicated, all Fees are in USD.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                7. Return Policy
              </h2>
              <p className="leading-relaxed">
                Due to the nature of digital products being immediately accessible upon purchase, we do not allow for returns or refunds under any circumstances. In addition, no modifications to your purchase will be granted once your purchase is made. Thank you for understanding.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                8. Subscriptions + Subscription Cancellations
              </h2>
              <p className="leading-relaxed">
                When you purchase any Products on an ongoing subscription basis (for example: weekly, monthly, quarterly, or annually), you are authorizing the Company to process incurred and recurring Fees until the subscription is terminated and all outstanding fees have been paid in full. You must keep a valid Authorized Payment Method on file with the Company. Recurring payments are billed in advance at 365 days intervals (each, a "Billing Date") on the initial date of purchase on a prorated basis, then on the last day of the year that follow.
              </p>
              <p className="mt-4 leading-relaxed">
                If we are unable to successfully process a payment of the Fees using your Authorized Payment Method, we will make a second attempt to process payment 1 day later, then we will make a final attempt 2 days following the second attempt if it is unsuccessful. If the final attempt is unsuccessful, we reserve the right to suspend or revoke your subscription immediately, until all current and outstanding Fees are paid.
              </p>
              <p className="mt-4 leading-relaxed">
                You are required to complete all payments for the subscription period you committed to at purchase. At the end of the subscription period, the subscription service will auto-renew on a yearly basis and may be cancelled at any time in writing.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                9. Chargebacks
              </h2>
              <p className="leading-relaxed">
                By attempting a chargeback with your financial institution, you are expressly agreeing to pay the full cost of your original purchase, plus any fees or associated costs incurred by the Company. We have the right to present these Terms to your financial institution, any payment processing company and/or investigating agency concerning the attempted chargeback or financial dispute.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                10. Promotions + Discounts
              </h2>
              <p className="leading-relaxed">
                We may occasionally market and/or advertise promotions, discounts, limited time offers, and/or bonuses ("Promotions") to potential customers. You are entitled to take advantage of any active Promotions when you purchase our Products. Promotions are offered manually and/or through automated campaigns at any given time and are not guaranteed to be available when you make a purchase through the Website. We reserve the right to change or alter any Promotions at any time and at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                11. License for Use
              </h2>
              <p className="leading-relaxed">
                By purchasing Products through our Website, you are agreeing to the Terms of Purchase, and in return, we are providing you with a limited, non-transferable, non-exclusive, revocable, personal-use license ("License") to use the Products by yourself only.
              </p>
              <p className="mt-4 leading-relaxed">
                Sharing, copying, reproducing, modifying, publishing, selling, or otherwise distributing the Products, whether publicly or privately, is expressly prohibited. You may, however, copy or print instructional materials, information, and guides within the Products for personal use, provided that all original formatting, copyright and trademark notices, and branding remains intact.
              </p>
              <p className="mt-4 leading-relaxed">
                Your limited license allows you to use the Products and any associated materials for yourself only. If you have multiple team members who would need access to the Products, you must purchase an additional License for each member of your team and ensure they are aware of these Terms of Purchase.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                12. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                The Company owns and retains all rights, titles, and interests in and to the Products. Nothing in these Terms transfers any intellectual property ownership beyond the limited license described in the above section, and we reserve all rights not expressly granted to you.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                13. Consent to Use
              </h2>
              <p className="leading-relaxed">
                By submitting reviews, images, comments, testimonials, or tags ("Submissions") to us on any platform including, but not limited to social media and online reviews, you are by default granting us a commercial license and voluntarily releasing us to use your Submissions for any reasonable future business use.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                14. Age Limitations
              </h2>
              <p className="leading-relaxed">
                You acknowledge you are able to perform any and all of the obligations required under these Terms of Purchase. By submitting payment or otherwise enrolling through the Website, you warrant that you meet all legal age limits in your jurisdiction that are required to use this Website and/or purchase Products.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                15. Changing Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to update and revise these Terms at any time without notice to you. Your continued use of the Products and Website after we have updated the Terms of Purchase indicates your acceptance and agreement to the changes.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                16. Privacy + Protection of Personal Information
              </h2>
              <p className="leading-relaxed">
                We respect your privacy and are committed to protecting it. We may use certain information that we collect from you to operate TWIQ ai and provide our ICY COACHING & CONSULTING Products. Please review our Privacy Policy to understand the types of data we collect from you and your devices ("Data") in connection with your purchase of Products through the Website and how we use your Data.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                17. Error in Store Presentation
              </h2>
              <p className="leading-relaxed">
                We strive to present information that is published correctly and update the Website regularly in a way that allows us to correct any resulting errors. However, any of the content on the Website may, at any given time, be incorrect or out-of-date. We reserve the right to make changes to Product prices, specifications, processes, Promotions, availability, and to the Website as a whole at any time under any circumstance.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                18. Termination of Use
              </h2>
              <p className="leading-relaxed">
                We may terminate your account or restrict your use of the Website at any time for any reason. Under these Terms, you understand that you are responsible for any orders and purchases you make or charges you incur prior to such termination. The company may change, discontinue, or otherwise suspend the Website for any reason, at any time, and without prior notice to the Purchaser.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                19. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                The Company is in no way liable to the Purchaser or any other third party for any and all damages including, but not limited to, punitive or exemplary damages or those resulting from negligence relating to these Terms, regardless of whether the Purchaser was advised of such damages, the foreseeable nature of the damages, and the legal or equitable theory upon which the claim for damages is based.
              </p>
              <p className="mt-4 leading-relaxed">
                This Limitation of Liability provision does not purport to affect any liability that cannot be excluded or limited under the law.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                20. Maximum Damages
              </h2>
              <p className="leading-relaxed">
                Our entire maximum liability and your sole remedy for any actions or claims shall be limited to the actual amount paid by you for the Products you have purchased through the Website.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                21. Binding Arbitration
              </h2>
              <p className="leading-relaxed">
                In the event there is a dispute between the Parties that cannot be brought to an amicable mutual understanding, the Parties understand and agree that such dispute will be handled through binding arbitration in alignment with the rules of the American Arbitration Association. The Parties understand that they will be bound by any decision rendered by the arbitrator and/or arbitration proceedings. The arbitration itself will be held in Hollywood, Florida. If the arbitration is unable to move forward in the designated jurisdiction, the Company will unilaterally elect another venue for the arbitration. The Parties will equally share in the costs and expenses of arbitration and any related proceedings.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                22. Choice of Law
              </h2>
              <p className="leading-relaxed">
                These Terms and the Parties' relationship are governed by the laws of Florida. In the event of conflicting laws, the laws of Florida will control.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                23. Notices
              </h2>
              <p className="leading-relaxed">
                We may provide notice to you by: (i) sending a message to the email address provided by you, or (ii) by posting to the Website. Notices sent by email will be effective at the time of sending and notices posted to the Website will be effective upon posting.
              </p>
              <p className="mt-4 leading-relaxed">
                You may provide notice to the Company by certified mail to:
              </p>
              <div className="mt-4 ml-4">
                <p>ICY CONSULTING</p>
                <p>6825 Taft Street Suite #3</p>
                <p>Hollywood, FL 33024, USA</p>
                <p>Email: concierge@icyconsulting.com</p>
              </div>
              <p className="mt-4 leading-relaxed">
                Notices provided by certified mail will be effective upon actual receipt of the notice.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                24. Additional Terms
              </h2>
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                Severability + No Waiver
              </h3>
              <p className="mb-4 leading-relaxed">
                If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court with jurisdiction, all other provisions set forth in these Terms will remain valid and enforceable. By failing to enforce any right or provision of these Terms, we are not waiving the right or ability to enforce the same rights or provisions in the future.
              </p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                Transfer + Assignment
              </h3>
              <p className="mb-4 leading-relaxed">
                You may not transfer or assign any of your rights under these Terms to any third party without the express written consent of the Company.
              </p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                Force Majeure
              </h3>
              <p className="mb-4 leading-relaxed">
                To the extent that any failure or delay in our delivery of the Products under these Terms is caused by or results from acts or circumstances beyond our reasonable control, we will not be liable or responsible to you and the same will not be considered a breach of these Terms. Such acts or circumstances beyond our reasonable control could include, without limitation, acts of God, fire, flood, earthquake, natural disasters, cyber-attacks, terrorism, revolution, insurrection, civil unrest, national emergency, epidemic, pandemic, labor disputes, supply chain restraints or delays in obtaining suitable materials, materials breakdown, telecommunications breakdown, or power outage.
              </p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                Headings for Convenience Only
              </h3>
              <p className="mb-4 leading-relaxed">
                The headings in these Terms are included for convenience and reference, and are not meant to describe, define, or limit the scope or intent of any provision.
              </p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                Entire Agreement + All Rights Reserved
              </h3>
              <p className="leading-relaxed">
                In concluding these Terms, you understand and acknowledge that these Terms constitute the final agreement and supersede all others regarding the purchase, sale, and use of any Products and the use of the Website. The Company reserves any and all rights not expressly granted in these Terms.
              </p>
            </section>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Last updated: July 22nd, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;