import {
    SITE_URL,
    BUSINESS,
    SOCIAL,
    SEO_KEYWORDS,
    DEFAULT_OG_IMAGE,
    buildBreadcrumbs,
    jsonLd,
} from "@/lib/seo/constants";
import type { PricingPlan } from "@/lib/types/database";

interface JsonLdProps {
    plans: PricingPlan[];
}

export default function JsonLd({ plans }: JsonLdProps) {
    const hayPlanesActivos = plans.some((p) => p.is_active);
    // 1. Organization schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BUSINESS.legalName,
        // Era `BUSINESS.name`, identico a `name`: no aportaba nada. Aca van las
        // formas en que la gente escribe la marca cuando la busca, sobre todo
        // "logica", que es lo que sale si te dijeron el nombre de boca.
        alternateName: [...BUSINESS.nameVariants],
        url: SITE_URL,
        // El logo es la marca tejida, no la tarjeta para redes: Google pide el
        // logo en si (minimo 112px) y antes recibia un banner de 1200x630.
        logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/apple-touch-icon.png`,
            width: 180,
            height: 180,
        },
        image: DEFAULT_OG_IMAGE,
        description: BUSINESS.description,
        foundingDate: `${BUSINESS.foundingYear}`,
        sameAs: [SOCIAL.instagram],
        contactPoint: [
            {
                "@type": "ContactPoint",
                email: BUSINESS.email,
                contactType: "customer service",
                availableLanguage: ["Spanish"],
                areaServed: {
                    "@type": "Country",
                    name: BUSINESS.areaServed,
                },
            },
        ],
        knowsAbout: SEO_KEYWORDS,
    };

    // 2. LocalBusiness / ProfessionalService schema (for local SEO in Argentina)
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: BUSINESS.name,
        alternateName: [...BUSINESS.nameVariants],
        url: SITE_URL,
        description: BUSINESS.description,
        priceRange: "$$",
        image: DEFAULT_OG_IMAGE,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        address: {
            "@type": "PostalAddress",
            addressLocality: BUSINESS.geo.city,
            addressRegion: BUSINESS.geo.region,
            postalCode: BUSINESS.geo.postalCode,
            addressCountry: BUSINESS.geo.country,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: BUSINESS.geo.latitude,
            longitude: BUSINESS.geo.longitude,
        },
        areaServed: {
            "@type": "Country",
            name: "Argentina",
        },
        serviceType: [
            "Diseño web",
            "Desarrollo web",
            "Landing page",
            "E-commerce",
            "Rediseño web",
        ],
        // El catálogo completo (con precio) ya lo emite PricingJsonLd bajo este
        // mismo @id — referenciarlo evita declarar dos OfferCatalog distintos
        // para los mismos planes en la misma página.
        ...(hayPlanesActivos && {
            hasOfferCatalog: { "@id": `${SITE_URL}/#offercatalog` },
        }),
    };

    // 3. WebSite schema (enables sitelinks in Google)
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BUSINESS.name,
        alternateName: [...BUSINESS.nameVariants],
        url: SITE_URL,
        description: BUSINESS.description,
        inLanguage: BUSINESS.language,
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
    };

    // 4. WebPage schema for homepage
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${BUSINESS.name} — ${BUSINESS.slogan}`,
        description: BUSINESS.description,
        isPartOf: {
            "@id": `${SITE_URL}/#website`,
        },
        about: {
            "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: BUSINESS.language,
        dateModified: new Date().toISOString(),
        breadcrumb: {
            "@id": `${SITE_URL}/#breadcrumb`,
        },
    };

    // 5. BreadcrumbList schema for homepage
    const breadcrumbSchema = {
        ...buildBreadcrumbs([{ name: "Inicio", url: SITE_URL }]),
        "@id": `${SITE_URL}/#breadcrumb`,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(organizationSchema)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(localBusinessSchema)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(webSiteSchema)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(webPageSchema)}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(breadcrumbSchema)}
            />
        </>
    );
}
