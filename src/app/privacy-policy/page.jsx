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
            Privacy Policy
          </h1>

          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            <strong>Last Updated:</strong> July 22, 2025
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <p className="mb-6 leading-relaxed">
                Thank you for your support and interest in TWIQ ai. We are so thankful to have you as a part of our SaaS product.
              </p>
              <p className="mb-6 leading-relaxed">
                This Privacy Notice for ICY COACHING & CONSULTING (doing business as ICY CONSULTING) ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 mb-6">
                <li>Visit our website at app.twiq.ai or any website of ours that links to this Privacy Notice</li>
                <li>Use TWIQ AI. TWIQ AI is a specialized storytelling and content intelligence platform built for bold, purpose-driven brands. While ChatGPT is general-purpose, TWIQ AI is trained on our proprietary TWIQ Method to help you create emotionally intelligent content that builds trust, positions your expertise, and turns ideas into influence. Think of it as your personal brand strategist in bot form.</li>
                <li>Engage with us in other related ways, including any sales, marketing, or events</li>
              </ul>
              <p className="mb-6 leading-relaxed">
                <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at team@twiq.ai.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Summary of Key Points
              </h2>
              <p className="mb-4">This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</li>
                <li><strong>Do we process any sensitive personal information?</strong> Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.</li>
                <li><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</li>
                <li><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.</li>
                <li><strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</li>
                <li><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</li>
                <li><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</li>
                <li><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Table of Contents
              </h2>
              <ol className="ml-4 list-decimal space-y-1">
                <li>WHAT INFORMATION DO WE COLLECT?</li>
                <li>HOW DO WE PROCESS YOUR INFORMATION?</li>
                <li>WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</li>
                <li>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</li>
                <li>DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</li>
                <li>DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</li>
                <li>HOW DO WE HANDLE YOUR SOCIAL LOGINS?</li>
                <li>HOW LONG DO WE KEEP YOUR INFORMATION?</li>
                <li>HOW DO WE KEEP YOUR INFORMATION SAFE?</li>
                <li>DO WE COLLECT INFORMATION FROM MINORS?</li>
                <li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
                <li>CONTROLS FOR DO-NOT-TRACK FEATURES</li>
                <li>DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</li>
                <li>DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</li>
                <li>DO WE MAKE UPDATES TO THIS NOTICE?</li>
                <li>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</li>
                <li>HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                1. What Information Do We Collect?
              </h2>
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Personal information you disclose to us</h3>
              <p className="mb-4 italic">In Short: We collect personal information that you provide to us.</p>
              <p className="mb-4">We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
              <p className="mb-4"><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
              <ul className="ml-4 list-inside list-disc space-y-1 mb-4">
                <li>names</li>
                <li>email addresses</li>
                <li>phone numbers</li>
                <li>mailing addresses</li>
                <li>usernames</li>
                <li>debit/credit card numbers</li>
                <li>billing addresses</li>
                <li>contact or authentication data</li>
              </ul>
              <p className="mb-4"><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
              <p className="mb-4"><strong>Payment Data.</strong> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Stripe. You may find their privacy notice link(s) here: <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline">https://stripe.com/privacy</a>.</p>
              <p className="mb-4"><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS?" below.</p>
              <p className="mb-4">All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Information automatically collected</h3>
              <p className="mb-4 italic">In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
              <p className="mb-4">We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
              <p className="mb-4">Like many businesses, we also collect information through cookies and similar technologies.</p>
              <p className="mb-4">The information we collect includes:</p>
              <ul className="ml-4 list-inside list-disc space-y-2 mb-4">
                <li><strong>Log and Usage Data.</strong> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).</li>
                <li><strong>Device Data.</strong> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.</li>
                <li><strong>Location Data.</strong> We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.</li>
              </ul>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Google API</h3>
              <p className="mb-4">Our use of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                2. How Do We Process Your Information?
              </h2>
              <p className="mb-4 italic">In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process the personal information for the following purposes listed below. We may also process your information for other purposes only with your prior explicit consent.</p>
              <p className="mb-4">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
                <li><strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
                <li><strong>To send administrative information to you.</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
                <li><strong>To fulfill and manage your orders.</strong> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
                <li><strong>To enable user-to-user communications.</strong> We may process your information if you choose to use any of our offerings that allow for communication with another user.</li>
                <li><strong>To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
                <li><strong>To deliver targeted advertising to you.</strong> We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more.</li>
                <li><strong>To protect our Services.</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
                <li><strong>To identify usage trends.</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
                <li><strong>To determine the effectiveness of our marketing and promotional campaigns.</strong> We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.</li>
                <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                3. What Legal Bases Do We Rely On To Process Your Information?
              </h2>
              <p className="mb-4 italic">In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>
              
              <p className="mb-4"><strong>If you are located in the EU or UK, this section applies to you.</strong></p>
              <p className="mb-4">The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</p>
              <ul className="ml-4 list-inside list-disc space-y-2 mb-4">
                <li><strong>Consent.</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Contact us at concierege@icyconsulting.com about withdrawing your consent.</li>
                <li><strong>Performance of a Contract.</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.</li>
                <li><strong>Legitimate Interests.</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:
                  <ul className="ml-4 list-inside list-disc space-y-1 mt-2">
                    <li>Develop and display personalized and relevant advertising content for our users</li>
                    <li>Analyze how our Services are used so we can improve them to engage and retain users</li>
                    <li>Support our marketing activities</li>
                    <li>Diagnose problems and/or prevent fraudulent activities</li>
                    <li>Understand how our users use our products and services so we can improve user experience</li>
                  </ul>
                </li>
                <li><strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
                <li><strong>Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
              </ul>

              <p className="mb-4"><strong>If you are located in Canada, this section applies to you.</strong></p>
              <p className="mb-4">We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.</p>
              <p className="mb-4">In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
              <ul className="ml-4 list-inside list-disc space-y-1">
                <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
                <li>For investigations and fraud detection and prevention</li>
                <li>For business transactions provided certain conditions are met</li>
                <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
                <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
                <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
                <li>If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
                <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
                <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
                <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
                <li>If the information is publicly available and is specified by the regulations</li>
                <li>We may disclose de-identified information for approved research or statistics projects, subject to ethics oversight and confidentiality commitments</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                4. When And With Whom Do We Share Your Personal Information?
              </h2>
              <p className="mb-4 italic">In Short: We may share information in specific situations described in this section and/or with the following third parties.</p>
              <p className="mb-4">We may need to share your personal information in the following situations:</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                <li><strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). Google Maps uses GPS, Wi-Fi, and cell towers to estimate your location. GPS is accurate to about 20 meters, while Wi-Fi and cell towers help improve accuracy when GPS signals are weak, like indoors. This data helps Google Maps provide directions, but it is not always perfectly precise. We obtain and store on your device ("cache") your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this document.</li>
                <li><strong>Business Partners.</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                5. Do We Use Cookies And Other Tracking Technologies?
              </h2>
              <p className="mb-4 italic">In Short: We may use cookies and other tracking technologies to collect and store your information.</p>
              <p className="mb-4">We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>
              <p className="mb-4">We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.</p>
              <p className="mb-4">To the extent these online tracking technologies are deemed to be a "sale"/"sharing" (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section "DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"</p>
              <p className="mb-4">Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Google Analytics</h3>
              <p className="mb-4">We may share your information with Google Analytics to track and analyze the use of the Services. The Google Analytics Advertising Features that we may use include: Google Analytics Demographics and Interests Reporting. To opt out of being tracked by Google Analytics across the Services, visit <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a>. You can opt out of Google Analytics Advertising Features through Ads Settings and Ad Settings for mobile apps. Other opt-out means include <a href="http://optout.networkadvertising.org/" className="text-blue-600 hover:underline">http://optout.networkadvertising.org/</a> and <a href="http://www.networkadvertising.org/mobile-choice" className="text-blue-600 hover:underline">http://www.networkadvertising.org/mobile-choice</a>. For more information on the privacy practices of Google, please visit the Google Privacy & Terms page.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                6. Do We Offer Artificial Intelligence-Based Products?
              </h2>
              <p className="mb-4 italic">In Short: We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</p>
              <p className="mb-4">As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Our AI Products</h3>
              <p className="mb-4">Our AI Products are designed for the following functions:</p>
              <ul className="ml-4 list-inside list-disc space-y-1 mb-4">
                <li>AI bots</li>
              </ul>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">How We Process Your Data Using AI</h3>
              <p className="mb-4">All personal information processed using our AI Products is handled in line with our Privacy Notice and our agreement with third parties. This ensures high security and safeguards your personal information throughout the process, giving you peace of mind about your data's safety.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                7. How Do We Handle Your Social Logins?
              </h2>
              <p className="mb-4 italic">In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</p>
              <p className="mb-4">Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</p>
              <p className="mb-4">We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                8. How Long Do We Keep Your Information?
              </h2>
              <p className="mb-4 italic">In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</p>
              <p className="mb-4">We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than twelve (12) months past the start of the idle period of the user's account.</p>
              <p className="mb-4">When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                9. How Do We Keep Your Information Safe?
              </h2>
              <p className="mb-4 italic">In Short: We aim to protect your personal information through a system of organizational and technical security measures.</p>
              <p className="mb-4">We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                10. Do We Collect Information From Minors?
              </h2>
              <p className="mb-4 italic">In Short: We do not knowingly collect data from or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction.</p>
              <p className="mb-4">We do not knowingly collect, solicit data from, or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or the equivalent age as specified by law in your jurisdiction or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age or the equivalent age as specified by law in your jurisdiction has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under 18 or the equivalent age as specified by law in your jurisdiction, please contact us at concierege@icyconsulting.com.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                11. What Are Your Privacy Rights?
              </h2>
              <p className="mb-4 italic">In Short: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</p>
              <p className="mb-4">In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. If a decision that produces legal or similarly significant effects is made solely by automated means, we will inform you, explain the main factors, and offer a simple way to request human review. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.</p>
              <p className="mb-4">We will consider and act upon any request in accordance with applicable data protection laws.</p>
              <p className="mb-4">If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority.</p>
              <p className="mb-4">If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner.</p>
              
              <p className="mb-4"><strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below or updating your preferences.</p>
              <p className="mb-4">However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</p>
              
              <p className="mb-4"><strong>Opting out of marketing and promotional communications:</strong> You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Account Information</h3>
              <p className="mb-4">If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
              <ul className="ml-4 list-inside list-disc space-y-1 mb-4">
                <li>Contact us using the contact information provided.</li>
                <li>Log in to your account settings and update your user account.</li>
              </ul>
              <p className="mb-4">Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>
              
              <p className="mb-4"><strong>Cookies and similar technologies:</strong> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.</p>
              <p className="mb-4">If you have questions or comments about your privacy rights, you may email us at concierege@icyconsulting.com.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                12. Controls For Do-Not-Track Features
              </h2>
              <p className="mb-4">Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</p>
              <p className="mb-4">California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                13. Do United States Residents Have Specific Privacy Rights?
              </h2>
              <p className="mb-4 italic">In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Categories of Personal Information We Collect</h3>
              <p className="mb-4">The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section "WHAT INFORMATION DO WE COLLECT?"</p>
              
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Examples</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">A. Identifiers</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">B. Personal information as defined in the California Customer Records statute</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Name, contact information, education, employment, employment history, and financial information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">C. Protected classification characteristics under state or federal law</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">D. Commercial information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Transaction information, purchase history, financial details, and payment information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">E. Biometric information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Fingerprints and voiceprints</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">F. Internet or other similar network activity</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">G. Geolocation data</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Device location</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">H. Audio, electronic, sensory, or similar information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Images and audio, video or call recordings created in connection with our business activities</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">I. Professional or employment-related information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">J. Education Information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Student records and directory information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">NO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="mb-4">We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
              <ul className="ml-4 list-inside list-disc space-y-1 mb-4">
                <li>Receiving help through our customer support channels;</li>
                <li>Participation in customer surveys or contests; and</li>
                <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
              </ul>
              <p className="mb-4">We will use and retain the collected personal information as needed to provide the Services or for:</p>
              <ul className="ml-4 list-inside list-disc space-y-1 mb-4">
                <li>Category H – 1 year</li>
              </ul>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Sources of Personal Information</h3>
              <p className="mb-4">Learn more about the sources of personal information we collect in "WHAT INFORMATION DO WE COLLECT?"</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">How We Use and Share Personal Information</h3>
              <p className="mb-4">Learn more about how we use your personal information in the section, "HOW DO WE PROCESS YOUR INFORMATION?"</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Will your information be shared with anyone else?</h3>
              <p className="mb-4">We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information in the section, "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"</p>
              <p className="mb-4">We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.</p>
              <p className="mb-4">We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Your Rights</h3>
              <p className="mb-4">You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:</p>
              <ul className="ml-4 list-inside list-disc space-y-1 mb-4">
                <li>Right to know whether or not we are processing your personal data</li>
                <li>Right to access your personal data</li>
                <li>Right to correct inaccuracies in your personal data</li>
                <li>Right to request the deletion of your personal data</li>
                <li>Right to obtain a copy of the personal data you previously shared with us</li>
                <li>Right to non-discrimination for exercising your rights</li>
                <li>Right to opt out of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California's privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
                <li>Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
                <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
                <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
                <li>Right to review, understand, question, and correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Minnesota)</li>
                <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
                <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
              </ul>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">How to Exercise Your Rights</h3>
              <p className="mb-4">To exercise these rights, you can contact us by submitting a data subject access request, by emailing us at team@twiq.ai, or by referring to the contact details at the bottom of this document.</p>
              <p className="mb-4">Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Request Verification</h3>
              <p className="mb-4">Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.</p>
              <p className="mb-4">If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Appeals</h3>
              <p className="mb-4">Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at team@twiq.ai. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">California "Shine The Light" Law</h3>
              <p className="mb-4">California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                14. Do Other Regions Have Specific Privacy Rights?
              </h2>
              <p className="mb-4 italic">In Short: You may have additional rights based on the country you reside in.</p>
              
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Republic of South Africa</h3>
              <p className="mb-4">At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"</p>
              <p className="mb-4">If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:</p>
              <div className="ml-4 mb-4">
                <p>The Information Regulator (South Africa)</p>
                <p>General enquiries: enquiries@inforegulator.org.za</p>
                <p>Complaints (complete POPIA/PAIA form 5): PAIAComplaints@inforegulator.org.za & POPIAComplaints@inforegulator.org.za</p>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                15. Do We Make Updates To This Notice?
              </h2>
              <p className="mb-4 italic">In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
              <p className="mb-4">We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                16. How Can You Contact Us About This Notice?
              </h2>
              <p className="mb-4">If you have questions or comments about this notice, you may email us at team@twiq.ai or contact us by post at:</p>
              <div className="ml-4 mb-4">
                <p>ICY COACHING & CONSULTING</p>
                <p>6825 Taft Street</p>
                <p>Hollywood, FL 33024</p>
                <p>United States</p>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                17. How Can You Review, Update, Or Delete The Data We Collect From You?
              </h2>
              <p className="mb-4">Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please submit this answers to concierege@icyconsulting.com</p>
              <div className="ml-4 space-y-2">
                <p><strong>Email subject:</strong> Data Subject Access Request Form</p>
                <p>Please fill in the information below. The website administrator or data protection officer will be notified of your request within 24 hours, and will need an appropriate amount of time to respond.</p>
                <ul className="mt-4 space-y-2">
                  <li><strong>Website:</strong></li>
                  <li><strong>Your Full Name:</strong></li>
                  <li><strong>What email address do you use to access the above website / app?:</strong></li>
                  <li><strong>You are submitting this request as:</strong><br />
                    (The person, or the parent / guardian of the person, whose name appears above.<br />
                    An agent authorized by the consumer to make this request on their behalf.)
                  </li>
                  <li><strong>Under the rights of which law are you making this request?</strong>
                    <ul className="ml-4 list-inside list-disc space-y-1 mt-2">
                      <li>GDPR</li>
                      <li>CCPA</li>
                      <li>CPA</li>
                      <li>CTDPA</li>
                      <li>UCPA</li>
                      <li>VCDPA</li>
                      <li>OTHER</li>
                    </ul>
                  </li>
                  <li><strong>Please leave details regarding your action request or question.</strong></li>
                </ul>
                <p className="mt-4">Under penalty of perjury, I declare all the above information to be true and accurate.</p>
                <p>I understand that the deletion or restriction of my personal data is irreversible and may result in the termination of services with My Great New Website / App.</p>
                <p>I understand that I will be required to validate my request by email, and I may be contacted in order to complete the request.</p>
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Last updated: July 22, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
