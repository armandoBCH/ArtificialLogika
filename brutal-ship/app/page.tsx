import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MarqueeBanner from "./components/MarqueeBanner";
import FeaturesGrid from "./components/FeaturesGrid";
import ContentSplit from "./components/ContentSplit";
import ProcessSection from "./components/ProcessSection";
import PortfolioShowcase from "./components/PortfolioShowcase";
import OldWebsiteSection from "./components/OldWebsiteSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import StickyMobileCTA from "./components/StickyMobileCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <FeaturesGrid />
      <ContentSplit />
      <ProcessSection />
      <PortfolioShowcase />
      <OldWebsiteSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <StickyMobileCTA />
      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 lg:hidden" aria-hidden="true"></div>
    </>
  );
}
