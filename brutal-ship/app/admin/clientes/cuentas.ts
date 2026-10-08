/**
 * Cuentas de los clientes: cuánto se cobró de cada trabajo, cuánto falta y cuánto
 * queda de ganancia. Sin imports a propósito: así `cuentas.check.mjs` lo prueba
 * con Node pelado.
 */

export interface Cliente {
    id: string;
    name: string;
    business: string;
    whatsapp: string;
    email: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export type Contacto = Pick<Cliente, "name" | "business" | "whatsapp" | "email">;

export const nombreDe = (c: Contacto) => [c.name.trim(), c.business.trim()].filter(Boolean).join(" · ") || "Sin nombre";

export interface Pago {
    id: string;
    /** YYYY-MM-DD */
    fecha: string;
    monto: number;
    nota: string;
}

export interface Costo {
    id: string;
    concepto: string;
    monto: number;
}

export type EstadoCobro = "debe-sena" | "falta-saldo" | "pagado";

export const ESTADOS_COBRO: Record<EstadoCobro, { etiqueta: string; clase: string }> = {
    "debe-sena": { etiqueta: "Debe la seña", clase: "bg-hot-coral/15 text-hot-coral border-hot-coral/40" },
    "falta-saldo": { etiqueta: "Falta el saldo", clase: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/50" },
    pagado: { etiqueta: "Pagado", clase: "bg-secondary/15 text-secondary border-secondary/40" },
};

export interface Cobro {
    total: number;
    sena: number;
    cobrado: number;
    falta: number;
    /** Lo que falta para completar la seña. */
    faltaSena: number;
    costos: number;
    /** Total menos costos: lo que deja el trabajo cuando se cobre todo. */
    ganancia: number;
    /** Cobrado menos costos: lo que ya quedó en mano. */
    gananciaCobrada: number;
    estado: EstadoCobro;
}

const monto = (x: unknown) => Math.max(Math.round(Number(x) || 0), 0);
const suma = (lista: { monto: number }[]) => lista.reduce((s, x) => s + monto(x.monto), 0);

export function cobroDe(total: number, sena: number, pagos: Pago[], costos: Costo[]): Cobro {
    const cobrado = suma(pagos);
    const gastos = suma(costos);
    const falta = Math.max(total - cobrado, 0);
    return {
        total,
        sena,
        cobrado,
        falta,
        faltaSena: Math.max(sena - cobrado, 0),
        costos: gastos,
        ganancia: total - gastos,
        gananciaCobrada: cobrado - gastos,
        estado: falta === 0 ? "pagado" : cobrado < sena ? "debe-sena" : "falta-saldo",
    };
}

/** El peor estado de varios trabajos: el que hay que mirar primero. */
export function peorEstado(estados: EstadoCobro[]): EstadoCobro | null {
    for (const e of ["debe-sena", "falta-saldo", "pagado"] as const) if (estados.includes(e)) return e;
    return null;
}

/* ─────────────────────────────────────────────────────────────
   Lo que llega de la base. Las columnas son JSON: un renglón roto no tiene que
   romper la página entera.
   ───────────────────────────────────────────────────────────── */

const texto = (x: unknown) => (typeof x === "string" ? x : "");
const objetos = (x: unknown) =>
    (Array.isArray(x) ? x : []).filter((o): o is Record<string, unknown> => !!o && typeof o === "object");

export function pagosDe(x: unknown): Pago[] {
    return objetos(x).map((o, i) => ({ id: texto(o.id) || `pago-${i}`, fecha: texto(o.fecha), monto: monto(o.monto), nota: texto(o.nota) }));
}

export function costosDe(x: unknown): Costo[] {
    return objetos(x).map((o, i) => ({ id: texto(o.id) || `costo-${i}`, concepto: texto(o.concepto), monto: monto(o.monto) }));
}

/* ─────────────────────────────────────────────────────────────
   Reconocer a un cliente que ya existe
   La misma regla que usa supabase/clientes-2026-10-07.sql para los presupuestos
   viejos: WhatsApp (últimos 10 dígitos, así "11 2345-6789" y "+54 9 11 2345 6789"
   son el mismo), email, o nombre y negocio.
   ───────────────────────────────────────────────────────────── */

const digitos = (s: string) => {
    const d = s.replace(/\D/g, "");
    return d.length >= 8 ? d.slice(-10) : "";
};
const limpio = (s: string) => s.trim().toLowerCase();

export function mismoCliente(a: Contacto, b: Contacto): boolean {
    const wa = digitos(a.whatsapp);
    if (wa && wa === digitos(b.whatsapp)) return true;
    const email = limpio(a.email);
    if (email && email === limpio(b.email)) return true;
    const nombre = `${limpio(a.name)}|${limpio(a.business)}`;
    return nombre !== "|" && nombre === `${limpio(b.name)}|${limpio(b.business)}`;
}
