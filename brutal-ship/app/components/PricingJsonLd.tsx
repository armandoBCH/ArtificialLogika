import { SITE_URL, BUSINESS } from "@/lib/seo/constants";
import type { PricingPlan } from "@/lib/types/database";

// `priceValidUntil` solo necesita ser estable, no exacto al milisegundo. A nivel de
// módulo se evalúa una vez al importar, en vez de en cada render (que React marca
// como impuro porque puede dar valores distintos entre servidor y cliente).
const VALIDO_HASTA = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

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
            priceValidUntil: VALIDO_HASTA,
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
