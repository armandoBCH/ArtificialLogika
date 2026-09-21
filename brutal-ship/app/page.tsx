import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import OfferBand from "./components/OfferBand";
import MarqueeBanner from "./components/MarqueeBanner";
import WhoDoesWhatSection from "./components/WhoDoesWhatSection";
import ProcessSection from "./components/ProcessSection";
import AboutSection from "./components/AboutSection";
import PortfolioShowcase from "./components/PortfolioShowcase";
import OldWebsiteSection from "./components/OldWebsiteSection";
import GuaranteeSection from "./components/GuaranteeSection";
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
import { getPortfolioProjects } from "@/lib/data/portfolio";
import { getTestimonials } from "@/lib/data/testimonials";
import { getFaqs } from "@/lib/data/faqs";
import { getSiteConfig } from "@/lib/data/config";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const [plans, projects, testimonials, faqs, config] =
    await Promise.all([
      getPricingPlans(),
      getPortfolioProjects(),
      getTestimonials(),
      getFaqs(),
      getSiteConfig(),
    ]);

  return (
    <>
      <JsonLd plans={plans} testimonials={testimonials} />
      <FAQJsonLd faqs={faqs} />
      <PricingJsonLd plans={plans} />
      <Navbar config={config} />
      <main id="contenido">
      <HeroSection />
      <OfferBand />
      <MarqueeBanner />
      {/* Orden pensado para conversión: tesis -> problema -> prueba visual -> cómo ->
          prueba real -> qué recibís -> cuánto cuesta -> objeciones -> acción.
          Qué recibís y cuánto cuesta viven juntos en Precios: cada plan lista sus
          características. Hubo una sección de Servicios aparte, pero obligaba a
          cruzar 1.364px de testimonios para comparar, y se sacó junto con su
          tabla. Dos secciones de features se removieron por redundancia con
          WhoDoesWhatSection. */}
      <WhoDoesWhatSection />
      <OldWebsiteSection />
      <ProcessSection />
      <AboutSection />
      <PortfolioShowcase projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <GuaranteeSection />
      <PricingSection plans={plans} config={config} />
      <FAQSection faqs={faqs} config={config} />
      <ContactSection config={config} />
      </main>
      <Footer config={config} />
      <StickyMobileCTA config={config} />
      <WhatsAppChatWidget config={config} />
      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 lg:hidden" aria-hidden="true"></div>
    </>
  );
}

