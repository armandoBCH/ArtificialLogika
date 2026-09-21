/**
 * Los precios de Logika se publican en pesos argentinos.
 *
 * Se pasaron de dólares el 2026-09-16 con el dólar oficial a ~$1.530 y
 * redondeando hacia arriba a un número que se lee de un vistazo:
 *   Landing Page         US$149 -> $229.000
 *   Sitio Institucional  US$249 -> $389.000
 *   E-commerce           US$399 -> $619.000
 *   Mantenimiento        US$15 / 25 / 35 -> $23.000 / $39.000 / $54.000
 *
 * Los planes viven en la base (`pricing_plans`) y se editan desde /admin/precios.
 * Las cuotas de mantenimiento no tienen tabla propia: viven acá, y las leen la
 * sección de precios del sitio y el presupuestador, para que no puedan diferir.
 */

const miles = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** 229000 -> "$229.000" */
export function formatearPesos(monto: number): string {
    const redondeado = Math.round(monto);
    const signo = redondeado < 0 ? "−" : "";
    return `${signo}$${miles.format(Math.abs(redondeado))}`;
}

/**
 * Respeta la moneda del registro. Si un plan quedara en dólares en la base, se
 * sigue leyendo "US$149" y no "$149", que en Argentina se lee como pesos.
 */
export function formatearPrecio(monto: number, moneda: string | null | undefined): string {
    if (moneda === "USD") return `US$${miles.format(monto)}`;
    if (moneda === "EUR") return `€${miles.format(monto)}`;
    return formatearPesos(monto);
}

/** Mantenimiento mensual opcional, por nombre de plan. */
export const CUOTA_MENSUAL: Record<string, number> = {
    "Landing Page": 23000,
    "Sitio Institucional": 39000,
    "E-commerce": 54000,
    "E-commerce / Plataforma": 54000,
};

/**
 * Cuantas caracteristicas de cada plan se ven sin abrir "Ver las N restantes".
 * Lo lee la tarjeta del sitio y el editor del admin, que marca el corte: por eso
 * el orden de las caracteristicas importa tanto como el de los planes.
 */
export const CARACTERISTICAS_A_LA_VISTA = 4;
