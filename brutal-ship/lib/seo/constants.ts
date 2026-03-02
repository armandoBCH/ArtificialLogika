// ============================================================
// SEO Constants — Single source of truth for all SEO config
// When you get your .com.ar domain, change SITE_URL here only.
// ============================================================

export const SITE_URL = "https://logika.com.ar";

export const BUSINESS = {
    name: "Logika",
    legalName: "Logika",
    description:
        "Agencia de diseño y desarrollo web en Argentina. Creamos páginas web profesionales para todo tipo de negocio. Nos encargamos de todo: diseño, desarrollo, dominio, hosting y soporte.",
    shortDescription:
        "Diseñamos y creamos la página web que tu negocio necesita. Nosotros nos encargamos de todo.",
    slogan: "Tu Web Profesional, Sin Complicaciones",
    foundingYear: 2025,
    locale: "es_AR",
    language: "es",
    country: "AR",
    currency: "ARS",
    email: "contacto@logika.com.ar",
    phone: "+5491100000000", // Update with real number
    areaServed: "Argentina",
} as const;

export const SOCIAL = {
    instagram: "https://www.instagram.com/logika.web/", // Update with real URL
} as const;

export const SEO_KEYWORDS = [
    "diseño web",
    "diseño web Argentina",
    "página web profesional",
    "crear página web",
    "agencia web",
    "desarrollo web",
    "diseño web para negocios",
    "página web para pymes",
    "landing page Argentina",
    "web profesional Argentina",
    "diseño web económico",
    "hacer página web",
    "sitio web profesional",
    "diseño web moderno",
    "web para emprendedores",
    "página web para empresas",
    "presupuesto web",
    "diseño web neobrutalista",
    "diseño y desarrollo web",
    "agencia digital Argentina",
];

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
