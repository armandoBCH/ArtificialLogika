/**
 * Formato de precios.
 *
 * Regla dura de este módulo: NUNCA devolver "NaN" a la pantalla.
 *
 * Los planes vienen de Supabase, no del código, y un precio puede llegar
 * en varias formas según cómo se haya cargado o cómo serialice el driver:
 * número (149), string numérico ("149.00"), string con formato argentino
 * ("1.499,00"), con símbolo ("$149"), o directamente ausente. Pasar
 * cualquiera de esos últimos a Intl.NumberFormat produce el texto "NaN"
 * en la tarjeta de precio — el peor lugar posible del sitio.
 */

/**
 * Convierte a número lo que venga de la base, o null si es imposible.
 *
 * Maneja el formato argentino: en "1.499,00" el punto es separador de
 * miles y la coma es decimal, al revés que en inglés. Sin esto,
 * parseFloat("1.499,00") devuelve 1.499 — un precio mil veces menor.
 */
export function toNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "string") {
        const cleaned = value.trim();
        if (cleaned === "") return null;

        // Saca símbolos de moneda, espacios y cualquier cosa que no sea
        // dígito, separador o signo.
        let s = cleaned.replace(/[^\d.,-]/g, "");
        if (s === "") return null;

        const lastComma = s.lastIndexOf(",");
        const lastDot = s.lastIndexOf(".");

        if (lastComma > -1 && lastDot > -1) {
            // Ambos presentes: el que va último es el decimal.
            s = lastComma > lastDot
                ? s.replace(/\./g, "").replace(",", ".")   // 1.499,00
                : s.replace(/,/g, "");                      // 1,499.00
        } else if (lastComma > -1) {
            // Sólo coma. Con exactamente 2 dígitos detrás es decimal
            // ("149,00"); si no, es separador de miles ("1,499").
            s = /,\d{1,2}$/.test(s) ? s.replace(",", ".") : s.replace(/,/g, "");
        }

        const n = parseFloat(s);
        return Number.isFinite(n) ? n : null;
    }

    return null;
}

/** Sólo el número, con separador de miles argentino: "1.499". */
export function formatAmount(value: unknown): string {
    const n = toNumber(value);
    if (n === null) {
        // Antes de mostrar "NaN", preferimos mostrar lo que haya tal cual.
        return typeof value === "string" && value.trim() !== "" ? value.trim() : "";
    }
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);
}

/**
 * "USD 149" — inequívoco en cualquier país.
 *
 * En Argentina el "$" significa pesos, así que "$149" para un plan en
 * dólares se lee primero como 149 pesos: una diferencia de ~1000x en la
 * expectativa de precio. Por eso el código de moneda va adelante.
 */
export function formatPrice(value: unknown, currency: string = "USD"): string {
    const amount = formatAmount(value);
    if (amount === "") return "";
    return `${currency} ${amount}`;
}

/**
 * Equivalencia orientativa en pesos.
 *
 * Devuelve null si no hay cotización cargada, y eso es a propósito: el
 * tipo de cambio se configura desde el panel (`usd_ars_rate`), no se
 * hardcodea, porque una cotización inventada en el código envejece mal.
 */
export function formatArsReference(
    priceUsd: unknown,
    rate: string | number | undefined | null
): string | null {
    const amount = toNumber(priceUsd);
    const parsed = toNumber(rate);
    if (amount === null || parsed === null || parsed <= 0) return null;

    const ars = Math.round((amount * parsed) / 1000) * 1000; // redondeo al mil
    return `≈ ${formatAmount(ars)} ARS`;
}
