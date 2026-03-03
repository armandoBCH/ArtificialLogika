import type { Metadata } from "next";
import { SITE_URL, BUSINESS, DEFAULT_OG_IMAGE } from "@/lib/seo/constants";
import { getPortfolioProjects } from "@/lib/data/portfolio";
import { getSiteConfig } from "@/lib/data/config";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyMobileCTA from "@/app/components/StickyMobileCTA";
import WhatsAppChatWidget from "@/app/components/WhatsAppChatWidget";
import CatalogGrid from "./CatalogGrid";

export const metadata: Metadata = {
    title: "Catálogo de Proyectos",
    description:
        "Explorá nuestro historial de trabajos reales y proyectos de demostración. Diseños web de alto impacto para negocios que buscan crecer.",
    openGraph: {
        title: `Catálogo de Proyectos | ${BUSINESS.name}`,
        description:
            "Explorá nuestro historial de trabajos reales y proyectos de demostración. Diseños web de alto impacto para negocios que buscan crecer.",
        url: `${SITE_URL}/portafolio`,
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: `Catálogo de Proyectos | ${BUSINESS.name}`,
        description:
            "Explorá nuestro historial de trabajos reales y proyectos de demostración.",
        images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
        canonical: `${SITE_URL}/portafolio`,
    },
};

export const revalidate = 60;

export default async function PortafolioPage() {
    const [projects, config] = await Promise.all([
        getPortfolioProjects(),
        getSiteConfig(),
    ]);

    return (
        <main className="min-h-screen bg-white dark:bg-background-dark text-ink-black dark:text-white font-sans selection:bg-primary selection:text-white pt-24 bg-dot-pattern">
            <Navbar config={config} />

            <CatalogGrid initialProjects={projects} />

            <Footer config={config} />
            <StickyMobileCTA config={config} />
            <WhatsAppChatWidget config={config} />
        </main>
    );
}
