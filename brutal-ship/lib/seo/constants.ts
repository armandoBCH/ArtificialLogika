// ============================================================
// SEO Constants — Single source of truth for all SEO config
// Domain: logikaweb.com.ar
// ============================================================

export const SITE_URL = "https://logikaweb.com.ar";

export const BUSINESS = {
    name: "Logika",
    legalName: "Logika",
    description:
        "Agencia de diseño y desarrollo web en Argentina. Creamos páginas web profesionales, landing pages y tiendas online para todo tipo de negocio. Nos encargamos de todo: diseño, desarrollo, dominio, hosting y soporte.",
    shortDescription:
        "Diseño web, landing pages y tienda online para tu negocio. Nosotros nos encargamos de todo.",
    slogan: "Tu Web Profesional, Sin Complicaciones",
    foundingYear: 2025,
    locale: "es_AR",
    language: "es",
    country: "AR",
    currency: "ARS",
    email: "contactologika@gmail.com.ar",
    phone: "+542284638361",
    areaServed: "Argentina",
    geo: {
        latitude: -34.5987,
        longitude: -58.3789,
        city: "Buenos Aires",
        region: "Ciudad Autónoma de Buenos Aires",
        postalCode: "C1001",
        country: "AR",
    },
} as const;

export const SOCIAL = {
    instagram: "https://www.instagram.com/logika.web/",
} as const;

// Keywords validated with Google Trends Argentina (Mar 2026)
// Ordered by search volume: highest → lowest
export const SEO_KEYWORDS = [
    // ========== TIER 1: Highest volume (Google Trends 50-100) ==========
    "tienda online",                   // #1 en volumen, consistente 75-100
    "diseño web",                      // #2, core term ~68
    "crear pagina web",                // #3, fuerte intención ~33
    "desarrollo web",                  // ~26, estable

    // ========== TIER 2: Medium volume (Google Trends 15-25) ==========
    "landing page",                    // volumen moderado, constante ~20
    "agencia web",                     // ~17
    "diseño web Argentina",            // búsqueda geo-localizada
    "tienda online Argentina",         // alto volumen + local

    // ========== TIER 3: Long-tail con intención de compra ==========
    "cuanto cuesta una pagina web",    // búsqueda de pricing = lead caliente
    "presupuesto web",                 // intención de contratar
    "hacer pagina web para mi negocio",// intención directa
    "diseño web para negocios",
    "web para pymes",
    "web para emprendedores",
    "pagina web para empresas",

    // ========== TIER 4: Trending / En Ascenso ==========
    "crear pagina web con inteligencia artificial", // +3300% en ascenso
    "diseño web con IA",               // tendencia emergente
    "rediseño web",                    // cliente que ya tiene web vieja

    // ========== TIER 5: Servicios específicos ==========
    "landing page profesional",
    "ecommerce Argentina",
    "diseño web responsive",
    "diseño web moderno",
    "diseño y desarrollo web",

    // ========== TIER 6: Local SEO ==========
    "diseño web Buenos Aires",
    "agencia web Buenos Aires",
    "desarrollo web Argentina",
    "agencia digital Argentina",
];

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// BreadcrumbList helper — used across pages
export function buildBreadcrumbs(
    items: Array<{ name: string; url?: string }>
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            ...(item.url ? { item: item.url } : {}),
        })),
    };
}
