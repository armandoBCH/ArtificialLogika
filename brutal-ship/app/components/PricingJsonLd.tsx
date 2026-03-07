import {
    SITE_URL,
    BUSINESS,
    DEFAULT_OG_IMAGE,
    buildBreadcrumbs,
} from "@/lib/seo/constants";
import type { PricingPlan } from "@/lib/types/database";

interface PricingJsonLdProps {
    plans: PricingPlan[];
}

export default function PricingJsonLd({ plans }: PricingJsonLdProps) {
    const activePlans = plans.filter((p) => p.is_active);

    if (activePlans.length === 0) return null;

    // Offer schema — each plan becomes a Google-visible offer
    const offerCatalogSchema = {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        name: `Planes de Diseño Web — ${BUSINESS.name}`,
        description:
            "Planes de diseño web profesional con precios claros. Landing pages, sitios institucionales y tiendas online.",
        url: `${SITE_URL}/#precios`,
        provider: {
            "@type": "Organization",
            name: BUSINESS.legalName,
            url: SITE_URL,
        },
        numberOfItems: activePlans.length,
        itemListElement: activePlans.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            description: plan.subtitle,
            url: `${SITE_URL}/#precios`,
            price: plan.price.toString(),
            priceCurrency: plan.currency || "USD",
            priceValidUntil: new Date(
                Date.now() + 90 * 24 * 60 * 60 * 1000
            ).toISOString().split("T")[0], // 90 days from now
            availability: "https://schema.org/InStock",
            itemOffered: {
                "@type": "Service",
                name: plan.name,
                description: plan.subtitle,
                provider: {
                    "@type": "Organization",
                    name: BUSINESS.legalName,
                },
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(offerCatalogSchema),
            }}
        />
    );
}
