import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Mercado Pago: el cobro automático del mantenimiento mensual.
 *
 * Cada trabajo con mensual puede tener una suscripción "sin plan asociado y con
 * pago pendiente": se crea acá con el mail de la cuenta de Mercado Pago del
 * cliente, y él entra al link (`init_point`) y elige la tarjeta. Desde ahí
 * Mercado Pago cobra solo y avisa cada cobro por webhook.
 *
 * Sin SDK: la API es fetch con el Access Token, y la firma de los avisos es el
 * mismo HMAC que usa el SDK oficial (mercadopago/sdk-nodejs, src/utils/webhook).
 * Sin imports del proyecto a propósito: `mercadopago.check.mjs` lo prueba con Node pelado.
 */

const API = "https://api.mercadopago.com";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Una suscripción (preapproval), con lo que se usa de ella. */
export interface Suscripcion {
    id: string;
    /** pending: esperando que cargue la tarjeta · authorized: cobra solo · paused · cancelled */
    status: string;
    payer_email?: string;
    external_reference?: string | number;
    init_point?: string;
    next_payment_date?: string | null;
    auto_recurring?: { transaction_amount?: number | string };
}

/** Un cobro mensual de una suscripción (authorized payment, "factura" en la documentación). */
export interface Factura {
    id: number | string;
    preapproval_id?: string;
    external_reference?: string | number;
    transaction_amount?: number | string;
    date_created?: string;
    debit_date?: string;
    /** De la factura: scheduled, processed, recycling (reintentando), cancelled. */
    status?: string;
    /** El intento de cobro, si ya hubo uno: approved, rejected, in_process… */
    payment?: { id?: number; status?: string } | null;
}

/** Un link de pago único (preferencia de Checkout Pro). */
export interface Preferencia {
    id: string;
    init_point?: string;
}

/** Un pago (de un link de pago único o de cualquier otro origen). */
export interface PagoMp {
    id: number | string;
    /** approved, pending, in_process, rejected, cancelled, refunded, charged_back… */
    status?: string;
    external_reference?: string | null;
    transaction_amount?: number | string;
    date_created?: string;
    date_approved?: string | null;
}

/** Como se guarda en mp_subscriptions. */
export interface FilaSuscripcion {
    id: string;
    quote_id: string;
    status: string;
    payer_email: string;
    amount: number;
    link: string;
    next_payment_date: string | null;
}

export class ErrorMP extends Error {
    estado: number;
    constructor(mensaje: string, estado: number) {
        super(mensaje);
        this.estado = estado;
    }
}

/* ─────────────────────────────────────────────────────────────
   API
   ───────────────────────────────────────────────────────────── */

function mensajeDeError(json: { message?: string; cause?: { description?: string }[] }, estado: number): string {
    if (estado === 401) return "Mercado Pago no aceptó el Access Token. Revisá MP_ACCESS_TOKEN en Vercel.";
    const detalle = [json.message, ...(json.cause ?? []).map((c) => c.description)].filter(Boolean).join(" · ");
    if (/payer|e-?mail|users? involved|real or test/i.test(detalle)) {
        return `Mercado Pago no aceptó el mail del cliente (${detalle}). Tiene que ser el de su cuenta de Mercado Pago, y no puede ser el tuyo.`;
    }
    return `Mercado Pago respondió ${estado}${detalle ? `: ${detalle}` : ""}`;
}

async function api<T>(ruta: string, metodo: "GET" | "POST" | "PUT" = "GET", cuerpo?: unknown): Promise<T> {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) throw new ErrorMP("Falta conectar Mercado Pago: cargá MP_ACCESS_TOKEN en Vercel.", 503);
    const res = await fetch(`${API}${ruta}`, {
        method: metodo,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new ErrorMP(mensajeDeError(json, res.status), res.status);
    return json as T;
}

/** El link para que el cliente cargue la tarjeta. `inicio` sale de `inicioDeCobro`. */
export function crearSuscripcion(d: { quoteId: string; email: string; monto: number; motivo: string; inicio?: string; volverA: string }) {
    return api<Suscripcion>("/preapproval", "POST", {
        reason: d.motivo,
        external_reference: d.quoteId,
        payer_email: d.email,
        back_url: d.volverA,
        status: "pending",
        auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: d.monto,
            currency_id: "ARS",
            ...(d.inicio ? { start_date: d.inicio } : {}),
        },
    });
}

export const leerSuscripcion = (id: string) => api<Suscripcion>(`/preapproval/${encodeURIComponent(id)}`);

export function cambiarSuscripcion(id: string, cambio: { status: "cancelled" } | { monto: number }) {
    return api<Suscripcion>(
        `/preapproval/${encodeURIComponent(id)}`,
        "PUT",
        "status" in cambio ? { status: cambio.status } : { auto_recurring: { transaction_amount: cambio.monto, currency_id: "ARS" } }
    );
}

export const leerFactura = (id: string) => api<Factura>(`/authorized_payments/${encodeURIComponent(id)}`);

/** Todos los cobros de una suscripción, de a 20 como devuelve la búsqueda. */
export async function buscarFacturas(preapprovalId: string): Promise<Factura[]> {
    const todas: Factura[] = [];
    // ponytail: tope de 10 páginas (200 meses); más que eso no va a llegar una suscripción mensual.
    for (let offset = 0, pagina = 0; pagina < 10; pagina++) {
        const r = await api<{ results?: Factura[]; paging?: { total?: number } }>(
            `/authorized_payments/search?preapproval_id=${encodeURIComponent(preapprovalId)}&offset=${offset}`
        );
        todas.push(...(r.results ?? []));
        offset += r.results?.length ?? 0;
        if (!r.results?.length || offset >= (r.paging?.total ?? 0)) break;
    }
    return todas;
}

export const VIGENCIA_LINK_MS = 30 * 24 * 3600_000;

/**
 * Un link para pagar una vez (la seña, el saldo, lo que haga falta). Vence solo a
 * los 30 días para que no quede un link viejo dando vueltas; antes, se anula con
 * `vencerLinkDePago`. `referencia` sale de `referenciaDeCobro`.
 */
export function crearLinkDePago(d: { referencia: string; titulo: string; monto: number; volverA: string; ahora: number }) {
    return api<Preferencia>("/checkout/preferences", "POST", {
        items: [{ title: d.titulo, quantity: 1, unit_price: d.monto, currency_id: "ARS" }],
        external_reference: d.referencia,
        back_urls: { success: d.volverA, pending: d.volverA, failure: d.volverA },
        statement_descriptor: "LOGIKA",
        expires: true,
        // Unos minutos para atrás: que no lo rechace por una diferencia de reloj.
        expiration_date_from: isoArgentina(d.ahora - 5 * 60_000),
        expiration_date_to: isoArgentina(d.ahora + VIGENCIA_LINK_MS),
    });
}

/** Lo da por vencido: ya no se puede pagar. */
export const vencerLinkDePago = (id: string, ahora: number) =>
    api<Preferencia>(`/checkout/preferences/${encodeURIComponent(id)}`, "PUT", { expires: true, expiration_date_to: isoArgentina(ahora - 60_000) });

export const leerPago = (id: string) => api<PagoMp>(`/v1/payments/${encodeURIComponent(id)}`);

/** Los pagos de un link, por su referencia (20 alcanzan: es para pagar una vez). */
export async function buscarPagos(referencia: string): Promise<PagoMp[]> {
    const r = await api<{ results?: PagoMp[] }>(`/v1/payments/search?sort=date_created&criteria=asc&external_reference=${encodeURIComponent(referencia)}`);
    return r.results ?? [];
}

/* ─────────────────────────────────────────────────────────────
   Sin red: firma de los avisos y lo que se guarda
   ───────────────────────────────────────────────────────────── */

/** Hora argentina con el formato de los ejemplos de Mercado Pago. Argentina no cambia la hora: siempre -03:00. */
export const isoArgentina = (ms: number) => new Date(ms - 3 * 3600_000).toISOString().replace("Z", "-03:00");

/**
 * external_reference de un link de pago: "cobro:<presupuesto>:<link>". Los cobros
 * de las suscripciones también llegan como pagos, pero con el id del presupuesto
 * pelado: así se distinguen y cada uno se registra por su lado.
 */
export const referenciaDeCobro = (quoteId: string, linkId: string) => `cobro:${quoteId}:${linkId}`;

export function leerReferenciaDeCobro(ref: unknown): { quoteId: string; linkId: string } | null {
    const [prefijo, quoteId, linkId] = String(ref ?? "").split(":");
    return prefijo === "cobro" && UUID.test(quoteId ?? "") && UUID.test(linkId ?? "") ? { quoteId, linkId } : null;
}

/** Lo que se guarda de un pago cada vez que avisa. El día es el de la aprobación, o el del intento. */
export function datosDePago(p: PagoMp): { amount: number; paid_on: string; status: string } | null {
    const fecha = p.date_approved ?? p.date_created;
    if (!fecha || Number.isNaN(Date.parse(fecha))) return null;
    return { amount: Math.max(Math.round(Number(p.transaction_amount) || 0), 0), paid_on: diaArgentina(fecha), status: p.status ?? "" };
}

/**
 * El aviso viene de Mercado Pago: HMAC-SHA256 con la clave secreta de Webhooks
 * sobre "id:[data.id];request-id:[x-request-id];ts:[ts];". Lo que no viene en el
 * aviso no va en el texto, igual que en el SDK.
 */
export function firmaValida(o: { xSignature: string | null; xRequestId: string | null; dataId: string | null; secreto: string }): boolean {
    const partes = new Map<string, string>();
    for (const parte of (o.xSignature ?? "").split(",")) {
        const igual = parte.indexOf("=");
        if (igual > 0) partes.set(parte.slice(0, igual).trim().toLowerCase(), parte.slice(igual + 1).trim());
    }
    const ts = partes.get("ts");
    const recibido = partes.get("v1");
    if (!ts || !/^\d+$/.test(ts) || !recibido) return false;
    const texto = [o.dataId && `id:${o.dataId}`, o.xRequestId && `request-id:${o.xRequestId}`, `ts:${ts}`].filter(Boolean).join(";") + ";";
    const esperado = createHmac("sha256", o.secreto).update(texto).digest("hex");
    return esperado.length === recibido.length && timingSafeEqual(Buffer.from(esperado), Buffer.from(recibido));
}

/** YYYY-MM-DD en Argentina: el servidor está en UTC y un cobro de las 22 hs ya sería del día siguiente. */
export const diaArgentina = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

/** Null si la suscripción no salió de este panel (no trae el id de un presupuesto). */
export function filaDeSuscripcion(s: Suscripcion): FilaSuscripcion | null {
    const quote = String(s.external_reference ?? "");
    if (!UUID.test(quote)) return null;
    return {
        id: s.id,
        quote_id: quote,
        status: s.status,
        payer_email: s.payer_email ?? "",
        amount: Math.max(Math.round(Number(s.auto_recurring?.transaction_amount) || 0), 0),
        link: s.init_point ?? "",
        next_payment_date: s.next_payment_date ?? null,
    };
}

/** Lo que se actualiza de un cobro cada vez que avisa. El mes que paga se elige una sola vez, al registrarlo. */
export function datosDeFactura(f: Factura): { subscription_id: string; amount: number; paid_on: string; status: string } | null {
    const fecha = f.debit_date ?? f.date_created;
    if (!fecha || Number.isNaN(Date.parse(fecha))) return null;
    return {
        subscription_id: f.preapproval_id ?? "",
        amount: Math.max(Math.round(Number(f.transaction_amount) || 0), 0),
        paid_on: diaArgentina(fecha),
        status: f.payment?.status ?? f.status ?? "",
    };
}

/** El presupuesto del cobro: va en external_reference; si no, por la suscripción. */
export const quoteDeFactura = (f: Factura) => (UUID.test(String(f.external_reference ?? "")) ? String(f.external_reference) : null);

/**
 * El start_date de la suscripción. Hoy o antes: ninguno, y el primer cobro sale
 * cuando el cliente carga la tarjeta. Más adelante: ese día al mediodía.
 */
export function inicioDeCobro(dia: string, hoy: string): string | undefined {
    return /^\d{4}-\d{2}-\d{2}$/.test(dia) && dia > hoy ? `${dia}T12:00:00.000-03:00` : undefined;
}

export const esUuid = (x: unknown) => typeof x === "string" && UUID.test(x);
