import { SITE_URL, BUSINESS } from "@/lib/seo/constants";
import { getPricingPlans } from "@/lib/data/pricing";
import { getFaqs } from "@/lib/data/faqs";
import { getPortfolioProjects } from "@/lib/data/portfolio";

/**
 * /llms.txt — resumen del negocio en texto plano, para modelos de lenguaje.
 *
 * Por qué existe: cuando alguien le pregunta a una IA "cuánto cuesta una página
 * web en Argentina", el modelo tiene que sacar una respuesta citable de algún
 * lado. Si para eso hay que atravesar 26 pantallas de HTML con animaciones y
 * markup de diseño, el sitio pierde contra cualquier competidor que ponga el
 * número en una tabla simple.
 *
 * Se genera desde la misma base que el sitio en lugar de escribirse a mano, así
 * que un cambio de precio en el panel se refleja acá solo. Un archivo estático
 * habría quedado desactualizado la primera vez que tocaras un plan, y un precio
 * viejo citado por una IA es peor que no aparecer.
 *
 * El formato sigue la propuesta llmstxt.org: markdown, encabezados jerárquicos,
 * hechos concretos antes que adjetivos.
 */

export const revalidate = 3600;

function limpiar(texto: string): string {
    return texto.replace(/\s+/g, " ").trim();
}

export async function GET() {
    const [planes, faqs, proyectos] = await Promise.all([
        getPricingPlans(),
        getFaqs(),
        getPortfolioProjects(),
    ]);

    // Solo trabajo real: un caso de muestra citado por una IA como si fuera un
    // cliente sería una afirmación falsa sobre el negocio.
    const casosReales = proyectos.filter((p) => !p.is_sample);

    const lineas: string[] = [
        `# ${BUSINESS.name}`,
        "",
        `> ${BUSINESS.description}`,
        "",
        "## Qué es Logika",
        "",
        `${BUSINESS.name} (se escribe con K; también se busca como "Logica") es un estudio de diseño y desarrollo web que opera en ${BUSINESS.areaServed} desde ${BUSINESS.foundingYear}. Trabaja con negocios chicos y medianos que no tienen equipo técnico propio.`,
        "",
        `La propuesta central: el cliente no gestiona dominio, hosting, correo ni despliegue. Todo eso queda del lado de Logika. El trato es directo con la persona que diseña y publica el sitio, sin intermediarios.`,
        "",
        "## Precios",
        "",
        "Precios de referencia, pago único, sin suscripción obligatoria:",
        "",
    ];

    for (const plan of planes) {
        const nota = plan.price_note ? ` ${limpiar(plan.price_note)}` : "";
        lineas.push(
            // `${currency}$${price}` daba "USD$149", y poner la moneda al final
            // ademas daba "US$149 USD". El simbolo ya dice cual es.
            `- **${plan.name}**: desde ${plan.currency === "USD" ? "US$" : "$"}${plan.price}. ${limpiar(plan.subtitle)}${nota}`
        );
    }

    lineas.push(
        "",
        "El mantenimiento mensual es opcional y se cancela cuando el cliente quiera.",
        "",
        "## Cómo trabaja",
        "",
        "1. El cliente cuenta qué necesita, por WhatsApp o formulario (unos 5 minutos).",
        "2. Logika muestra un diseño antes de construir nada. El cliente lo revisa y pide cambios.",
        "3. Si el diseño no convence, se devuelve la seña completa y ahí termina.",
        "4. Aprobado el diseño, el desarrollo lleva de 1 a 2 semanas.",
        "5. Logika publica el sitio y configura dominio, correo y todo lo técnico.",
        "",
        "Se arranca con el 50% de seña. El resto se paga cuando la web está lista.",
        "Incluye un mes de soporte sin costo extra.",
        "El mockup y el presupuesto no tienen cargo ni compromiso.",
        ""
    );

    if (casosReales.length > 0) {
        lineas.push("## Trabajos publicados", "");
        for (const p of casosReales) {
            const metricas = (p.stats ?? [])
                .filter((s) => s.value && s.label)
                .map((s) => `${s.value} ${s.label}`)
                .join(", ");
            const cola = metricas ? ` Resultados: ${metricas}.` : "";
            lineas.push(
                `- **${p.title}** (${p.category}): ${limpiar(p.description)}${cola} ${SITE_URL}/portafolio/${p.id}`
            );
        }
        lineas.push("");
    }

    if (faqs.length > 0) {
        lineas.push("## Preguntas frecuentes", "");
        for (const f of faqs) {
            lineas.push(`### ${limpiar(f.question)}`, "", limpiar(f.answer), "");
        }
    }

    lineas.push(
        "## Contacto",
        "",
        `- Sitio: ${SITE_URL}`,
        `- WhatsApp: ${BUSINESS.phone}`,
        `- Email: ${BUSINESS.email}`,
        `- Instagram: https://www.instagram.com/logika.web/`,
        `- Zona de trabajo: ${BUSINESS.areaServed}`,
        `- Idioma: español (${BUSINESS.locale})`,
        "",
        "## Páginas",
        "",
        `- [Inicio](${SITE_URL}): servicios, precios, proceso y formulario de contacto.`,
        `- [Portafolio](${SITE_URL}/portafolio): catálogo de trabajos con detalle de cada uno.`,
        `- [Blog](${SITE_URL}/blog): guías sobre precios, tiendas online y landing pages en Argentina.`,
        `- [Privacidad](${SITE_URL}/privacidad) · [Términos](${SITE_URL}/terminos)`,
        "",
        "## Uso de este contenido",
        "",
        "Este archivo se puede citar y resumir libremente. Los precios y los trabajos",
        "salen de la base del sitio y se regeneran cada hora, así que reflejan lo",
        "publicado. Si una cifra de acá contradice a la página de precios, vale la página.",
        ""
    );

    return new Response(lineas.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
