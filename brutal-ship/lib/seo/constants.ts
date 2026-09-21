// ============================================================
// SEO Constants — Single source of truth for all SEO config
// Domain: logikaweb.com.ar
// ============================================================

import type { Metadata } from "next";

export const SITE_URL = "https://www.logikaweb.com.ar";

export const BUSINESS = {
    name: "Logika",
    legalName: "Logika",
    description:
        "Agencia de diseño y desarrollo web en Argentina. Páginas web profesionales, landing pages y tiendas online. Nos encargamos de todo.",
    shortDescription:
        "Diseño web, landing pages y tienda online para tu negocio. Nosotros nos encargamos de todo.",
    slogan: "Tu Web Profesional, Sin Complicaciones",
    foundingYear: 2025,
    locale: "es_AR",
    language: "es",
    country: "AR",
    currency: "ARS",
    // Tenia ".com.ar" pegado a una direccion de gmail. El sitio mostraba la
    // correcta a las personas, pero el structured data le declaraba a Google una
    // que no existe.
    email: "contactologika@gmail.com",
    phone: "+542284638361",
    areaServed: "Argentina",

    /**
     * Como escribe la gente el nombre cuando busca la marca.
     *
     * "Logika" con K es dificil de adivinar si te lo dijeron de boca: la mayoria
     * escribe "logica". Estas variantes van al campo alternateName de schema.org,
     * que existe para exactamente esto, y ayudan a que Google entienda que todas
     * apuntan a la misma entidad.
     *
     * Son variantes REALES: formas en que un cliente escribiria el nombre. No es
     * lista de palabras clave, y meter aca terminos que no son el nombre de la
     * marca vuelve el campo ruido y deja de servir.
     */
    nameVariants: [
        "Logika Web",
        "Logica",
        "Logica Web",
        "Artificial Logika",
        "Artificial Logica",
        "Logika Argentina",
        "Logica Argentina",
        "logikaweb",
    ],
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

// La sirve app/opengraph-image.tsx. Las paginas no la referencian: cada ruta
// tiene su propio opengraph-image.tsx y Next arma la etiqueta solo. Esta
// constante queda para el structured data, que necesita una URL fija.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

interface VistaPrevia {
    titulo: string;
    descripcion: string;
    /** Ruta desde la raiz: "/blog", "/portafolio/abc". "/" es la home. */
    ruta: string;
    /** Notas del blog y casos del portafolio: se publican como `article`. */
    articulo?: { publicado?: string; modificado?: string; seccion?: string };
}

/**
 * El bloque Open Graph completo de una pagina: lo que leen LinkedIn, WhatsApp,
 * Facebook y Slack para armar la tarjeta.
 *
 * Existe porque Next no mezcla `openGraph` entre niveles: lo reemplaza entero.
 * El blog declaraba titulo y url y perdia `siteName` y `locale`; las paginas
 * legales no declaraban nada y heredaban el `og:url` de la home, asi que
 * compartir /privacidad en LinkedIn terminaba mostrando la home (LinkedIn sigue
 * el `og:url`).
 *
 * La imagen no va aca: la pone el opengraph-image.tsx de cada ruta. Twitter no
 * se declara por pagina porque Next lo completa con el titulo, la descripcion y
 * la imagen de Open Graph.
 */
export function vistaPrevia({
    titulo,
    descripcion,
    ruta,
    articulo,
}: VistaPrevia): Pick<Metadata, "openGraph"> {
    const base = {
        locale: BUSINESS.locale,
        siteName: BUSINESS.name,
        url: ruta === "/" ? SITE_URL : `${SITE_URL}${ruta}`,
        title: titulo,
        description: descripcion,
    };

    return {
        openGraph: articulo
            ? {
                  ...base,
                  type: "article",
                  publishedTime: articulo.publicado,
                  modifiedTime: articulo.modificado,
                  section: articulo.seccion,
              }
            : { ...base, type: "website" },
    };
}

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
