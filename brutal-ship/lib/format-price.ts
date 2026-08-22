/**
 * Formato de precios.
 *
 * El problema que resuelve: los planes se guardan en USD, pero el sitio se
 * lee en Argentina, donde "$" significa pesos. Un "$149" suelto se lee
 * primero como 149 pesos y recién después se registra el "USD" al lado —
 * una diferencia de ~1000x en la expectativa de precio del visitante.
 *
 * Además `BUSINESS.currency` declaraba "ARS" mientras el JSON-LD publicaba
 * "USD", así que el dato estructurado que lee Google contradecía al dato
 * de la interfaz.
 *
 * La solución es no usar nunca el "$" desnudo: el código de moneda va
 * siempre adelante y pegado al número.
 */

/** "USD 149" — inequívoco en cualquier país. Nunca "$149" a secas. */
export function formatPrice(amount: number, currency: string = "USD"): string {
    const n = new Intl.NumberFormat("es-AR", {
        maximumFractionDigits: 0,
    }).format(amount);
    return `${currency} ${n}`;
}

/** Sólo el número, con separador de miles argentino: "1.499". */
export function formatAmount(amount: number): string {
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(amount);
}

/**
 * Equivalencia orientativa en pesos.
 *
 * Devuelve null si no hay cotización cargada — y eso es a propósito: el
 * tipo de cambio se configura desde el panel (`usd_ars_rate`), no se
 * hardcodea ni se estima, porque una cotización inventada en el código
 * envejece mal y desinforma al cliente.
 */
export function formatArsReference(
    amountUsd: number,
    rate: string | number | undefined | null
): string | null {
    const parsed = typeof rate === "string" ? parseFloat(rate) : rate;
    if (!parsed || !Number.isFinite(parsed) || parsed <= 0) return null;

    const ars = Math.round((amountUsd * parsed) / 1000) * 1000; // redondeo al mil
    return `≈ ${formatAmount(ars)} ARS`;
}
