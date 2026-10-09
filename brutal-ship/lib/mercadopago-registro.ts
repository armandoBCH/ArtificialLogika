import type { SupabaseClient } from "@supabase/supabase-js";
import { mesDeHoy, mesParaCobroMp, pagosDe } from "@/app/admin/clientes/cuentas";
import {
    datosDeFactura,
    datosDePago,
    filaDeSuscripcion,
    leerReferenciaDeCobro,
    quoteDeFactura,
    vencerLinkDePago,
    type Factura,
    type FilaSuscripcion,
    type PagoMp,
    type Suscripcion,
} from "./mercadopago";

/**
 * Guardar lo que avisa Mercado Pago. Lo usan el webhook (con la clave de
 * servicio) y "Revisar en Mercado Pago" en Clientes (con la sesión del admin):
 * un aviso perdido se recupera por el mismo camino.
 */

// 23503: el presupuesto ya no existe. 23505: el mismo aviso llegó dos veces a la vez.
const SIN_PRESUPUESTO = "23503";
const REPETIDO = "23505";

/** Null si no es de este panel o el presupuesto se borró: no hay nada que guardar, y no es un error. */
export async function registrarSuscripcion(db: SupabaseClient, s: Suscripcion): Promise<FilaSuscripcion | null> {
    const fila = filaDeSuscripcion(s);
    if (!fila) return null;
    // Lo que una respuesta no trae (a veces Mercado Pago no devuelve el link o el mail) no pisa lo guardado.
    const { link, payer_email, amount, ...resto } = fila;
    const cambios = { ...resto, ...(link ? { link } : {}), ...(payer_email ? { payer_email } : {}), ...(amount ? { amount } : {}) };
    const { data, error } = await db.from("mp_subscriptions").upsert(cambios).select().single();
    if (error?.code === SIN_PRESUPUESTO) return null;
    if (error) throw error;
    return data;
}

/** El estado se actualiza en cada aviso; el mes que paga se elige una sola vez, al verlo por primera vez. */
export async function registrarFactura(db: SupabaseClient, f: Factura): Promise<void> {
    const id = String(f.id);
    const datos = datosDeFactura(f);
    if (!datos) return;

    const previo = await db.from("mp_payments").select("id").eq("id", id).maybeSingle();
    if (previo.error) throw previo.error;
    if (!previo.data) {
        const quoteId = quoteDeFactura(f) ?? (await quoteDeSuscripcion(db, datos.subscription_id));
        const month = quoteId ? await mesQueCubre(db, quoteId) : null;
        if (!quoteId || !month) return;
        const { error } = await db.from("mp_payments").insert({ id, quote_id: quoteId, month, ...datos });
        if (!error || error.code === SIN_PRESUPUESTO) return;
        if (error.code !== REPETIDO) throw error;
    }
    const { error } = await db.from("mp_payments").update(datos).eq("id", id);
    if (error) throw error;
}

/**
 * Un pago de un link del panel. Los que no traen "cobro:<presupuesto>:<link>" se
 * ignoran: por ejemplo, el cobro de una suscripción, que tiene su propio aviso.
 * Cuando queda aprobado, el link se cierra y se vence en Mercado Pago, así no se
 * puede pagar dos veces.
 */
export async function registrarPago(db: SupabaseClient, p: PagoMp): Promise<void> {
    const ref = leerReferenciaDeCobro(p.external_reference);
    const datos = datosDePago(p);
    if (!ref || !datos) return;

    const link = await db.from("mp_links").select("concept, preference_id, status").eq("id", ref.linkId).maybeSingle();
    if (link.error) throw link.error;
    const { error } = await db
        .from("mp_charges")
        .upsert({ id: String(p.id), quote_id: ref.quoteId, link_id: link.data ? ref.linkId : null, concept: link.data?.concept ?? "", ...datos });
    if (error?.code === SIN_PRESUPUESTO) return;
    if (error) throw error;

    if (datos.status !== "approved" || link.data?.status !== "open") return;
    const cerrado = await db.from("mp_links").update({ status: "paid" }).eq("id", ref.linkId);
    if (cerrado.error) throw cerrado.error;
    // Si no se puede vencer, igual quedó cerrado en el panel: no vale la pena que Mercado Pago reintente el aviso por esto.
    if (link.data.preference_id) await vencerLinkDePago(link.data.preference_id, Date.now()).catch((e) => console.error("No se pudo vencer el link pagado:", e));
}

async function quoteDeSuscripcion(db: SupabaseClient, id: string): Promise<string | null> {
    if (!id) return null;
    const { data, error } = await db.from("mp_subscriptions").select("quote_id").eq("id", id).maybeSingle();
    if (error) throw error;
    return data?.quote_id ?? null;
}

/** Ver `mesParaCobroMp`. Null si el presupuesto ya no existe. */
async function mesQueCubre(db: SupabaseClient, quoteId: string): Promise<string | null> {
    const [q, previos] = await Promise.all([
        db.from("quotes").select("payments, monthly_active").eq("id", quoteId).maybeSingle(),
        db.from("mp_payments").select("month").eq("quote_id", quoteId),
    ]);
    if (q.error) throw q.error;
    if (previos.error) throw previos.error;
    if (!q.data) return null;
    return mesParaCobroMp(pagosDe(q.data.payments), (previos.data ?? []).map((p) => p.month), q.data.monthly_active !== false, mesDeHoy());
}
