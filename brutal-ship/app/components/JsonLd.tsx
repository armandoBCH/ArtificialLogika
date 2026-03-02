import { SITE_URL, BUSINESS, SOCIAL, SEO_KEYWORDS } from "@/lib/seo/constants";
import type { Service } from "@/lib/types/database";

interface JsonLdProps {
    services: Service[];
}

export default function JsonLd({ services }: JsonLdProps) {
    // Organization schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: BUSINESS.legalName,
        alternateName: BUSINESS.name,
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.png`,
        description: BUSINESS.description,
        foundingDate: `${BUSINESS.foundingYear}`,
        sameAs: [SOCIAL.instagram],
        contactPoint: {
            "@type": "ContactPoint",
            email: BUSINESS.email,
            contactType: "customer service",
            availableLanguage: ["Spanish"],
            areaServed: BUSINESS.areaServed,
        },
        knowsAbout: SEO_KEYWORDS,
    };

    // LocalBusiness schema (for local SEO in Argentina)
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: BUSINESS.name,
        alternateName: BUSINESS.legalName,
        url: SITE_URL,
        description: BUSINESS.shortDescription,
        priceRange: "$$",
        image: `${SITE_URL}/og-image.png`,
        areaServed: {
            "@type": "Country",
            name: "Argentina",
        },
        serviceType: "Diseño y desarrollo web",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios de Diseño Web",
            itemListElement: services
                .filter((s) => s.is_active)
                .map((service, index) => ({
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: service.name,
                        description: service.description,
                    },
                    position: index + 1,
                })),
        },
    };

    // WebSite schema (enables sitelinks search box in Google)
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: BUSINESS.name,
        alternateName: BUSINESS.legalName,
        url: SITE_URL,
        description: BUSINESS.description,
        inLanguage: BUSINESS.language,
        publisher: {
            "@type": "Organization",
            name: BUSINESS.legalName,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localBusinessSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(webSiteSchema),
                }}
            />
        </>
    );
}
