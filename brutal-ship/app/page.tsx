import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MarqueeBanner from "./components/MarqueeBanner";
import FeaturesGrid from "./components/FeaturesGrid";
import ContentSplit from "./components/ContentSplit";
import ProcessSection from "./components/ProcessSection";
import PortfolioShowcase from "./components/PortfolioShowcase";
import OldWebsiteSection from "./components/OldWebsiteSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import StickyMobileCTA from "./components/StickyMobileCTA";
import WhatsAppChatWidget from "./components/WhatsAppChatWidget";
import JsonLd from "./components/JsonLd";
import FAQJsonLd from "./components/FAQJsonLd";
import PricingJsonLd from "./components/PricingJsonLd";

import { getPricingPlans } from "@/lib/data/pricing";
import { getServices } from "@/lib/data/services";
import { getPortfolioProjects } from "@/lib/data/portfolio";
import { getTestimonials } from "@/lib/data/testimonials";
import { getFaqs } from "@/lib/data/faqs";
import { getSiteConfig } from "@/lib/data/config";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const [plans, services, projects, testimonials, faqs, config] =
    await Promise.all([
      getPricingPlans(),
      getServices(),
      getPortfolioProjects(),
      getTestimonials(),
      getFaqs(),
      getSiteConfig(),
    ]);

  return (
    <>
      <JsonLd services={services} testimonials={testimonials} />
      <FAQJsonLd faqs={faqs} />
      <PricingJsonLd plans={plans} />
      <Navbar config={config} />
      <HeroSection />
      <MarqueeBanner />
      <FeaturesGrid />
      <ContentSplit />
      <ProcessSection />
      <PortfolioShowcase projects={projects} />
      <OldWebsiteSection />
      <ServicesSection services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <PricingSection plans={plans} config={config} />
      <FAQSection faqs={faqs} config={config} />
      <ContactSection config={config} />
      <Footer config={config} />
      <StickyMobileCTA config={config} />
      <WhatsAppChatWidget config={config} />
      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 lg:hidden" aria-hidden="true"></div>
    </>
  );
}

