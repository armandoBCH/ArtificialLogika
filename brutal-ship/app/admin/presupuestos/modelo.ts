import { cuotaMensual, formatearPesos } from "@/lib/precios";
import type { PricingPlan } from "@/lib/types/database";

/* ─────────────────────────────────────────────────────────────
   Tipos
   ───────────────────────────────────────────────────────────── */

export type EstadoPresupuesto = "borrador" | "enviado" | "aceptado" | "rechazado";

export const ESTADOS: { valor: EstadoPresupuesto; etiqueta: string; clase: string }[] = [
    { valor: "borrador", etiqueta: "Borrador", clase: "bg-white/10 text-gray-200 border-white/20" },
    { valor: "enviado", etiqueta: "Enviado", clase: "bg-primary/25 text-[#d4b5f7] border-primary/50" },
    { valor: "aceptado", etiqueta: "Aceptado", clase: "bg-secondary/15 text-secondary border-secondary/40" },
    { valor: "rechazado", etiqueta: "Rechazado", clase: "bg-hot-coral/15 text-hot-coral border-hot-coral/40" },
];

export interface Linea {
    id: string;
    tipo: "plan" | "extra" | "libre";
    /** id del plan o del ítem de catálogo del que salió, para poder sacarlo con el mismo botón. */
    refId: string | null;
    nombre: string;
    detalle: string;
    incluye: string[];
    cantidad: number;
    unidad: string;
    precio: number;
}

export interface LineaMensual {
    id: string;
    refId: string | null;
    nombre: string;
    detalle: string;
    precio: number;
}

export interface Presupuesto {
    fecha: string;
    validezDias: number;
    cliente: { nombre: string; negocio: string; whatsapp: string; email: string };
    titulo: string;
    mensaje: string;
    lineas: Linea[];
    mensuales: LineaMensual[];
    descuento: { modo: "porcentaje" | "monto"; valor: number; motivo: string };
    recargo: { etiqueta: string; porcentaje: number };
    senaPorcentaje: number;
    mediosDePago: string;
    plazo: string;
    garantia: string;
    aportaCliente: string[];
    condiciones: string[];
    notas: string;
}

export interface PresupuestoGuardado {
    id: string;
    number: number;
    client_name: string;
    title: string;
    status: EstadoPresupuesto;
    total: number;
    data: Presupuesto;
    created_at: string;
    updated_at: string;
}

export interface ItemCatalogo {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    category: string;
    is_recurring: boolean;
    display_order: number;
    is_active: boolean;
}

export interface Lead {
    id: string;
    name: string;
    contact: string;
    business_type: string;
    message: string;
    created_at: string;
}

export interface Empresa {
    whatsapp: string;
    email: string;
    web: string;
    ubicacion: string;
}

/* ─────────────────────────────────────────────────────────────
   Textos por defecto
   Salen de lo confirmado en PRODUCT.md y /terminos: seña del 50%, garantía
   sobre el primer diseño, qué aporta el cliente, uso en el portafolio.
   Todo se puede cambiar en cada presupuesto.
   ───────────────────────────────────────────────────────────── */

export const MENSAJE_POR_DEFECTO =
    "Gracias por contarnos tu idea. Acá tenés el detalle de lo que vamos a hacer, cuánto cuesta y qué necesitamos de vos. Del resto nos encargamos nosotros.";

export const GARANTIA_POR_DEFECTO = "Si el primer diseño no te convence, te devolvemos la seña";

export const APORTA_CLIENTE_POR_DEFECTO = [
    "Contarnos qué necesitás",
    "Las fotos y el logo de tu negocio",
    "Aprobar el diseño",
    "La seña para arrancar",
];

export const CONDICIONES_POR_DEFECTO = [
    "La seña se devuelve completa si el primer diseño no te convence. Una vez aprobado el diseño y empezado el desarrollo, deja de ser reintegrable.",
    "El plazo corre en días hábiles desde que recibimos la seña y el material.",
    "Nos encargamos de los textos, el dominio, el hosting, el correo, el candadito de seguridad y la publicación.",
    "Incluye 1 mes de soporte después de publicar.",
    "El mantenimiento mensual es opcional y se cancela cuando quieras.",
    "Podemos mostrar el trabajo terminado en nuestro portafolio, salvo que nos pidas lo contrario por escrito.",
];

export const MEDIOS_DE_PAGO_POR_DEFECTO = "Transferencia bancaria. Si lo necesitás, armamos un plan de pago.";

/** Lo que cubre la cuota, tal como lo lista la sección de precios del sitio. */
export const DETALLE_MANTENIMIENTO =
    "Hosting, dominio, certificado de seguridad, copias de respaldo, actualizaciones y soporte por WhatsApp.";

export const PLAZOS_SUGERIDOS = ["1 a 2 semanas", "2 a 4 semanas", "4 a 6 semanas"];

/**
 * Se usa solo hasta que corra el SQL de pesos: si un plan sigue en dólares en la
 * base, el presupuestador lo muestra convertido en vez de cotizar "$149".
 */
const DOLAR_REFERENCIA = 1530;

/** El catálogo de supabase/presupuestos-y-pesos-2026-09-16.sql, para cuando la tabla todavía no existe. */
export const CATALOGO_BASE: ItemCatalogo[] = [
    ["Página adicional", "Una sección nueva con su propio diseño y contenido.", 45000, "por página", "Contenido"],
    ["Blog con artículos", "Sección de notas para publicar novedades y aparecer más en Google.", 90000, "", "Contenido"],
    ["Sitio en otro idioma", "Versión completa del sitio en un segundo idioma.", 120000, "por idioma", "Contenido"],
    ["Carga de productos", "Cargamos fotos, precios y descripciones al catálogo.", 45000, "cada 50 productos", "Contenido"],
    ["Turnos y reservas online", "Tus clientes eligen día y horario desde la web.", 150000, "", "Funciones"],
    ["Conexión con otro sistema", "Integración con una planilla, un sistema de gestión o un servicio externo.", 120000, "", "Funciones"],
    ["Diseño de logo", "Logo a medida con sus variantes para web y redes.", 90000, "", "Diseño"],
    ["Entrega prioritaria", "Tu proyecto pasa adelante en la agenda.", 80000, "", "Plazos"],
].map(([name, description, price, unit, category], i) => ({
    id: `base-${i + 1}`,
    name: name as string,
    description: description as string,
    price: price as number,
    unit: unit as string,
    category: category as string,
    is_recurring: false,
    display_order: i + 1,
    is_active: true,
}));

/* ─────────────────────────────────────────────────────────────
   Fechas (siempre YYYY-MM-DD local, sin pasar por UTC)
   ───────────────────────────────────────────────────────────── */

export function hoyISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function sumarDias(iso: string, dias: number): string {
    const [a, m, d] = iso.split("-").map(Number);
    if (!a || !m || !d) return iso;
    const fecha = new Date(a, m - 1, d + dias);
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

export function formatearFecha(iso: string): string {
    const [a, m, d] = iso.split("-");
    return a && m && d ? `${d}/${m}/${a}` : iso;
}

export function formatearNumero(numero: number | null | undefined): string {
    return numero ? String(numero).padStart(4, "0") : "";
}

/* ─────────────────────────────────────────────────────────────
   Construcción
   ───────────────────────────────────────────────────────────── */

export function nuevoId(): string {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function presupuestoNuevo(): Presupuesto {
    return {
        fecha: hoyISO(),
        validezDias: 15,
        cliente: { nombre: "", negocio: "", whatsapp: "", email: "" },
        titulo: "",
        mensaje: MENSAJE_POR_DEFECTO,
        lineas: [],
        mensuales: [],
        descuento: { modo: "porcentaje", valor: 0, motivo: "" },
        recargo: { etiqueta: "IVA", porcentaje: 0 },
        senaPorcentaje: 50,
        mediosDePago: MEDIOS_DE_PAGO_POR_DEFECTO,
        plazo: "",
        garantia: GARANTIA_POR_DEFECTO,
        aportaCliente: [...APORTA_CLIENTE_POR_DEFECTO],
        condiciones: [...CONDICIONES_POR_DEFECTO],
        notas: "",
    };
}

/** Completa un presupuesto guardado con los campos que le falten, por si el formato cambia. */
export function normalizar(datos: unknown): Presupuesto {
    const base = presupuestoNuevo();
    if (!datos || typeof datos !== "object") return base;
    const d = datos as Partial<Presupuesto>;
    return {
        ...base,
        ...d,
        cliente: { ...base.cliente, ...(d.cliente ?? {}) },
        descuento: { ...base.descuento, ...(d.descuento ?? {}) },
        recargo: { ...base.recargo, ...(d.recargo ?? {}) },
        lineas: Array.isArray(d.lineas)
            ? d.lineas.map((l) => ({ ...lineaLibre(), ...l, incluye: Array.isArray(l.incluye) ? l.incluye : [] }))
            : [],
        mensuales: Array.isArray(d.mensuales) ? d.mensuales : [],
        aportaCliente: Array.isArray(d.aportaCliente) ? d.aportaCliente : base.aportaCliente,
        condiciones: Array.isArray(d.condiciones) ? d.condiciones : base.condiciones,
    };
}

export function lineaLibre(): Linea {
    return { id: nuevoId(), tipo: "libre", refId: null, nombre: "", detalle: "", incluye: [], cantidad: 1, unidad: "", precio: 0 };
}

export function precioDePlan(plan: PricingPlan): number {
    if (plan.currency === "USD") return Math.ceil((plan.price * DOLAR_REFERENCIA) / 1000) * 1000;
    return Number(plan.price) || 0;
}

/** "Presupuesto sin cargo" es marketing de la home: dentro de un presupuesto no dice nada. */
export function incluyeDePlan(plan: PricingPlan): string[] {
    return (plan.features ?? [])
        .map((f) => (typeof f === "string" ? f : f.text).trim())
        .filter((t) => t && !/presupuesto sin cargo/i.test(t))
        .map((t) => t.replace(/\s*\+$/, ""));
}

export function lineaDePlan(plan: PricingPlan): Linea {
    return {
        id: nuevoId(),
        tipo: "plan",
        refId: plan.id,
        nombre: plan.name,
        detalle: plan.subtitle,
        incluye: incluyeDePlan(plan),
        cantidad: 1,
        unidad: "",
        precio: precioDePlan(plan),
    };
}

/** Plazos publicados en las FAQ: landing 1–2 semanas, el resto 2–4. */
export function plazoDePlan(nombre: string): string {
    return /landing/i.test(nombre) ? "1 a 2 semanas" : "2 a 4 semanas";
}

/** La cuota viene del plan (`monthly_price`), no de una tabla aparte por nombre. */
export function lineaDeMantenimiento(plan: PricingPlan): LineaMensual | null {
    const precio = cuotaMensual(plan);
    if (!precio) return null;
    return {
        id: nuevoId(),
        // El refId sigue siendo por nombre: asi lo tienen los presupuestos ya guardados.
        refId: refMantenimiento(plan),
        nombre: `Mantenimiento ${plan.name}`,
        detalle: DETALLE_MANTENIMIENTO,
        precio,
    };
}

export function refMantenimiento(plan: PricingPlan): string {
    return `mantenimiento:${plan.name}`;
}

/**
 * Las características del plan, para sugerir como detalle de la línea.
 *
 * Salen del mismo plan que se muestra en el sitio, así el presupuesto promete lo
 * mismo que la tarjeta de precios. Antes salían de la tabla `services`, que tenía
 * otra lista (y ya no se veía en ningún lado).
 */
export function sugerenciasDePlan(nombrePlan: string, planes: PricingPlan[]): string[] {
    const plan = planes.find((p) => p.name === nombrePlan);
    if (!plan || !Array.isArray(plan.features)) return [];
    return plan.features
        .map((f) => (typeof f === "string" ? f : f?.text ?? ""))
        .map((t) => t.trim())
        .filter(Boolean);
}

/** WhatsApp argentino: 11 2345-6789 -> 5491123456789. */
export function normalizarWhatsApp(valor: string): string {
    let digitos = valor.replace(/\D/g, "");
    if (!digitos) return "";
    if (digitos.startsWith("00")) digitos = digitos.slice(2);
    if (digitos.startsWith("0")) digitos = digitos.slice(1);
    if (digitos.length === 10) digitos = `549${digitos}`;
    return digitos;
}

/* ─────────────────────────────────────────────────────────────
   Cuentas
   ───────────────────────────────────────────────────────────── */

export interface Totales {
    subtotal: number;
    descuento: number;
    recargo: number;
    total: number;
    sena: number;
    saldo: number;
    mensual: number;
}

const acotar = (n: number, min: number, max: number) => Math.min(Math.max(Number(n) || 0, min), max);

export function calcularTotales(p: Presupuesto): Totales {
    const subtotal = p.lineas.reduce((suma, l) => suma + Math.max(l.cantidad, 0) * Math.max(l.precio, 0), 0);
    const descuento =
        p.descuento.modo === "porcentaje"
            ? Math.round((subtotal * acotar(p.descuento.valor, 0, 100)) / 100)
            : acotar(p.descuento.valor, 0, subtotal);
    const base = subtotal - descuento;
    const recargo = Math.round((base * acotar(p.recargo.porcentaje, 0, 100)) / 100);
    const total = base + recargo;
    const sena = Math.round((total * acotar(p.senaPorcentaje, 0, 100)) / 100);
    const mensual = p.mensuales.reduce((suma, m) => suma + Math.max(m.precio, 0), 0);
    return { subtotal, descuento, recargo, total, sena, saldo: total - sena, mensual };
}

export function tituloDe(p: Presupuesto): string {
    if (p.titulo.trim()) return p.titulo.trim();
    const negocio = p.cliente.negocio.trim();
    return negocio ? `Tu web para ${negocio}` : "Tu web profesional";
}

/* ─────────────────────────────────────────────────────────────
   Texto para WhatsApp
   ───────────────────────────────────────────────────────────── */

export function textoWhatsApp(p: Presupuesto, t: Totales, numero: number | null, empresa: Empresa): string {
    const r: string[] = [];
    const n = formatearNumero(numero);
    r.push(`*Presupuesto${n ? ` N° ${n}` : ""} · Logika*`);
    r.push(tituloDe(p));
    if (p.cliente.nombre.trim()) r.push(`Para: ${p.cliente.nombre.trim()}${p.cliente.negocio.trim() ? ` (${p.cliente.negocio.trim()})` : ""}`);
    r.push(`Válido hasta el ${formatearFecha(sumarDias(p.fecha, p.validezDias))}`);
    r.push("");

    for (const l of p.lineas) {
        if (!l.nombre.trim() && !l.precio) continue;
        const cantidad = l.cantidad !== 1 ? ` x${l.cantidad}${l.unidad ? ` ${l.unidad}` : ""}` : "";
        r.push(`• ${l.nombre.trim() || "Ítem"}${cantidad}: ${formatearPesos(l.cantidad * l.precio)}`);
    }
    r.push("");

    if (t.descuento > 0 || t.recargo > 0) r.push(`Subtotal: ${formatearPesos(t.subtotal)}`);
    if (t.descuento > 0) {
        const pct = p.descuento.modo === "porcentaje" ? ` ${p.descuento.valor}%` : "";
        r.push(`Descuento${pct}${p.descuento.motivo.trim() ? ` (${p.descuento.motivo.trim()})` : ""}: -${formatearPesos(t.descuento)}`);
    }
    if (t.recargo > 0) r.push(`${p.recargo.etiqueta.trim() || "Recargo"} ${p.recargo.porcentaje}%: ${formatearPesos(t.recargo)}`);
    r.push(`*Total: ${formatearPesos(t.total)}* (pago único)`);

    if (t.sena > 0 && t.saldo > 0) {
        r.push(`Seña para arrancar (${p.senaPorcentaje}%): ${formatearPesos(t.sena)}`);
        r.push(`Al entregar: ${formatearPesos(t.saldo)}`);
    }

    if (p.mensuales.length > 0) {
        r.push("");
        for (const m of p.mensuales) r.push(`${m.nombre.trim() || "Mensual"} (opcional): ${formatearPesos(m.precio)}/mes`);
    }

    if (p.plazo.trim()) {
        r.push("");
        r.push(`Plazo de entrega: ${p.plazo.trim()}`);
    }
    if (p.garantia.trim()) r.push(`${p.garantia.trim()}.`);

    r.push("");
    r.push(`Cualquier duda, respondé este mensaje${empresa.email ? ` o escribinos a ${empresa.email}` : ""}.`);
    return r.join("\n");
}
