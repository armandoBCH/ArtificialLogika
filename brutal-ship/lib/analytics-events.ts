/**
 * Eventos de conversión para GA4.
 *
 * Antes de esto el sitio no emitía un solo `gtag('event', …)`: los únicos
 * llamados eran `js` y `config` en layout.tsx. Eso significaba que
 *
 *   - el formulario, que envía por fetch() sin navegar ni tener página de
 *     gracias, era estructuralmente invisible para GA4 — las conversiones
 *     de formulario siempre iban a dar cero, no por falta de tráfico;
 *   - los clics a wa.me, que son la conversión primaria de mobile, no se
 *     podían atribuir a ningún punto de contacto concreto.
 *
 * Por eso los números del panel no eran confiables.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
    interface Window {
        gtag?: (command: string, eventName: string, params?: GtagParams) => void;
    }
}

function emit(event: string, params: GtagParams = {}) {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    try {
        window.gtag("event", event, params);
    } catch {
        // La medición nunca debe romper una interacción del usuario.
    }
}

/** De dónde salió el clic. Permite comparar los puntos de contacto entre sí. */
export type ContactSource =
    | "navbar_mobile"
    | "hero"
    | "sticky_mobile"
    | "widget_desktop"
    | "pricing"
    | "faq"
    | "footer"
    | "contact_section";

/**
 * Clic a WhatsApp. Se marca como conversión en GA4.
 * `source` es lo que permite responder "¿convierte más el sticky o el widget?".
 */
export function trackWhatsAppClick(source: ContactSource) {
    emit("whatsapp_click", {
        source,
        device: typeof window !== "undefined" && window.innerWidth < 1024 ? "mobile" : "desktop",
    });
}

/**
 * Lead enviado por formulario. Se dispara sólo cuando la API responde 200,
 * nunca al hacer submit: un envío fallido no es una conversión.
 */
export function trackLeadSubmit(businessType?: string) {
    emit("generate_lead", {
        method: "form",
        business_type: businessType || "no_especificado",
    });
}

/** Envío fallido. Sirve para detectar si la API o el rate-limit están comiendo leads. */
export function trackLeadError(reason: string) {
    emit("lead_error", { reason: reason.slice(0, 100) });
}
