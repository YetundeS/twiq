import { FAQSection } from "@/components/landingPageComponents/FAQSection";
import { FeatureCardsSequence } from "@/components/landingPageComponents/FeatureCardsSequence";
import { Header } from "@/components/landingPageComponents/Header";
import { HeroSection } from "@/components/landingPageComponents/HeroSection";
import { HowItWorksSection } from "@/components/landingPageComponents/HowItWorksSection";
import { PricingSection } from "@/components/landingPageComponents/PricingSection";
import { StickyPrompt } from "@/components/landingPageComponents/StickyPrompt";
import { TestimonialsSection } from "@/components/landingPageComponents/TestimonialsSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 transition-colors duration-300 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FeatureCardsSequence />
        <StickyPrompt />
      </main>
    </div>
  );
};

export default LandingPage 