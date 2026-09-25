import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhoDoesWhatSection from "./components/WhoDoesWhatSection";
import PortfolioShowcase from "./components/PortfolioShowcase";
import GuaranteeSection from "./components/GuaranteeSection";
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
      {/* Seis bloques, uno por pregunta de quien llega sin conocernos:
          ¿qué hacen? -> ¿qué tengo que hacer yo? -> ¿son reales? ->
          ¿cuánto sale y si no me gusta? -> mis otras dudas -> ¿con quién hablo?

          Hasta 2026-09 eran trece y medían 27,6 pantallas de celular. Se fue lo
          que decía otra vez algo ya dicho:
          - Banda de oferta y marquee: la oferta es una línea del hero.
          - "¿Tu web es vieja?": su gancho es media frase del hero.
          - Proceso: contaba la misma asimetría que Cómo funciona; quedan sus
            tiempos (al pie de esa sección) y sus promesas (en la garantía).
          - Nosotros: es la ficha del equipo en Contacto.
          - Testimonios: son los mismos clientes del portafolio; van ahí.
          La garantía no es una parada propia: es la franja que abre Precios. */}
      <WhoDoesWhatSection />
      <PortfolioShowcase projects={projects} testimonials={testimonials} />
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
