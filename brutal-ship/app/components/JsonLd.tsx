import {
    SITE_URL,
    BUSINESS,
    SOCIAL,
    SEO_KEYWORDS,
    DEFAULT_OG_IMAGE,
    buildBreadcrumbs,
} from "@/lib/seo/constants";
import type { Service, Testimonial } from "@/lib/types/database";

interface JsonLdProps {
    services: Service[];
    testimonials?: Testimonial[];
}

export default function JsonLd({ services, testimonials }: JsonLdProps) {
    // 1. Organization schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BUSINESS.legalName,
        alternateName: BUSINESS.name,
        url: SITE_URL,
        logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
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
        alternateName: BUSINESS.legalName,
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
                        provider: {
                            "@type": "Organization",
                            name: BUSINESS.legalName,
                        },
                    },
                    position: index + 1,
                })),
        },
        // AggregateRating from testimonials
        ...(testimonials &&
            testimonials.length > 0 && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
                ratingCount: testimonials.length.toString(),
                reviewCount: testimonials.length.toString(),
            },
            review: testimonials.slice(0, 3).map((t) => ({
                "@type": "Review",
                author: {
                    "@type": "Person",
                    name: t.name,
                },
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                },
                reviewBody: t.quote,
            })),
        }),
    };

    // 3. WebSite schema (enables sitelinks in Google)
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BUSINESS.name,
        alternateName: BUSINESS.legalName,
        url: SITE_URL,
        description: BUSINESS.description,
        inLanguage: BUSINESS.language,
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/portafolio?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(webPageSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
        </>
    );
}
