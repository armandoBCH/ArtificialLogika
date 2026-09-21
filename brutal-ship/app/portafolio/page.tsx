import type { Metadata } from "next";
import {
    SITE_URL,
    BUSINESS,
    buildBreadcrumbs,
    vistaPrevia,
} from "@/lib/seo/constants";
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
    ...vistaPrevia({
        titulo: `Catálogo de Proyectos | ${BUSINESS.name}`,
        descripcion:
            "Explorá nuestro historial de trabajos reales y proyectos de demostración. Diseños web de alto impacto para negocios que buscan crecer.",
        ruta: "/portafolio",
    }),
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

    const breadcrumbSchema = buildBreadcrumbs([
        { name: "Inicio", url: SITE_URL },
        { name: "Portafolio" },
    ]);

    // ItemList schema for portfolio — helps Google understand the catalog
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Catálogo de Proyectos | ${BUSINESS.name}`,
        description:
            "Explorá nuestro historial de trabajos reales y proyectos de demostración.",
        url: `${SITE_URL}/portafolio`,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: projects
                .filter((p) => p.is_active)
                .map((project, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/portafolio/${project.id}`,
                    name: project.title,
                    image: project.image_url,
                })),
        },
    };

    return (
        <main className="min-h-screen bg-white text-ink-black pt-24 bg-dot-pattern">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <Navbar config={config} />

            <CatalogGrid initialProjects={projects} />

            <Footer config={config} />
            <StickyMobileCTA config={config} />
            <WhatsAppChatWidget config={config} />
        </main>
    );
}
