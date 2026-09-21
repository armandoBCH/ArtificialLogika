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
 * Los planes viven en la base (`pricing_plans`) y se editan desde /admin/precios,
 * cuota mensual incluida (`monthly_price`). Antes las cuotas estaban escritas acá
 * atadas al nombre del plan; renombrar un plan le borraba la cuota sin aviso.
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

/**
 * Cuota mensual de un plan, o null si no tiene. Normaliza lo que llega de la
 * base: la columna puede faltar (antes de correr el SQL) o venir como texto.
 */
export function cuotaMensual(plan: { monthly_price?: number | string | null }): number | null {
    const valor = Number(plan.monthly_price);
    return Number.isFinite(valor) && valor > 0 ? valor : null;
}

/**
 * Cuantas caracteristicas quedan a la vista cuando ninguna dice lo contrario.
 * Desde que cada caracteristica elige si va a la vista o en "Ver mas"
 * (`collapsed`), esto solo aplica a las que todavia no tienen el dato: las
 * cargadas antes de que existiera la opcion.
 */
export const CARACTERISTICAS_A_LA_VISTA = 4;

type ConColapso = { collapsed?: boolean | null };

/** Si la caracteristica va dentro de "Ver las N restantes". */
export function estaEnVerMas(f: ConColapso, indice: number): boolean {
    return typeof f.collapsed === "boolean" ? f.collapsed : indice >= CARACTERISTICAS_A_LA_VISTA;
}

/**
 * Parte las caracteristicas en las que se ven y las de "Ver mas", respetando el
 * orden de cada grupo. La usan la tarjeta del sitio y el admin, asi los dos
 * muestran exactamente lo mismo.
 */
export function separarCaracteristicas<T extends ConColapso>(features: T[]): { aLaVista: T[]; enVerMas: T[] } {
    const aLaVista: T[] = [];
    const enVerMas: T[] = [];
    features.forEach((f, i) => (estaEnVerMas(f, i) ? enVerMas : aLaVista).push(f));
    return { aLaVista, enVerMas };
}
