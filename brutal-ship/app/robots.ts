import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";

/**
 * Los crawlers de modelos de lenguaje ya estaban permitidos por el `*`, pero
 * conviene nombrarlos.
 *
 * Muchos sitios los bloquean, así que varios de estos agentes revisan si hay una
 * regla propia antes de decidir con qué frecuencia visitan. Nombrarlos declara la
 * intención sin ambigüedad: acá queremos que nos lean y nos citen. Ese es
 * justamente el motivo por el que existe el blog.
 *
 * La lista cubre los buscadores con respuesta generada (OpenAI, Anthropic,
 * Perplexity, Google, Apple, Meta, Common Crawl) separando, donde el proveedor
 * hace la distinción, el bot que responde en vivo del que junta datos de
 * entrenamiento.
 */

const CRAWLERS_DE_IA = [
    "GPTBot",           // OpenAI, entrenamiento
    "OAI-SearchBot",    // OpenAI, búsqueda en ChatGPT
    "ChatGPT-User",     // OpenAI, navegación a pedido del usuario
    "ClaudeBot",        // Anthropic
    "Claude-Web",       // Anthropic, navegación
    "anthropic-ai",     // Anthropic
    "PerplexityBot",    // Perplexity
    "Google-Extended",  // Google, Gemini y AI Overviews
    "Applebot-Extended",// Apple Intelligence
    "meta-externalagent", // Meta AI
    "CCBot",            // Common Crawl, alimenta muchos modelos abiertos
];

export default function robots(): MetadataRoute.Robots {
    const privadas = ["/admin/", "/api/", "/auth/"];

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: privadas,
            },
            ...CRAWLERS_DE_IA.map((userAgent) => ({
                userAgent,
                allow: "/",
                disallow: privadas,
            })),
        ],
        // Sin `host`: esa directiva espera un hostname pelado, no una URL con
        // esquema, es una extension de Yandex que Google nunca soporto, y la
        // canonica entre www y sin www ya la resuelve el 301 del dominio.
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
