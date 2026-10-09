import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { guardarRutaAdmin } from "@/lib/admin-auth";
import {
    buscarFacturas,
    buscarPagos,
    cambiarSuscripcion,
    crearLinkDePago,
    crearSuscripcion,
    diaArgentina,
    ErrorMP,
    esUuid,
    inicioDeCobro,
    leerSuscripcion,
    referenciaDeCobro,
    vencerLinkDePago,
    VIGENCIA_LINK_MS,
} from "@/lib/mercadopago";
import { registrarFactura, registrarPago, registrarSuscripcion } from "@/lib/mercadopago-registro";
import { SITE_URL } from "@/lib/seo/constants";
import { createClient } from "@/lib/supabase/server";

/**
 * Mercado Pago desde Clientes.
 * - Cobro automático del mensual: generar el link, cancelarlo, cambiar el monto y
 *   revisar lo que no haya llegado por aviso. Devuelve la suscripción y, al
 *   revisar, los cobros del presupuesto.
 * - Links para pagar una vez (seña, saldo, total): generarlo por el monto que se
 *   elija, anularlo y revisarlo. Devuelve el link y, al revisar, sus pagos.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const montoValido = (x: unknown) => Number.isInteger(x) && (x as number) > 0 && (x as number) <= 50_000_000;

export async function POST(request: NextRequest) {
    const { rechazo } = await guardarRutaAdmin(request);
    if (rechazo) return rechazo;

    const b = ((await request.json().catch(() => null)) ?? {}) as Record<string, unknown>;
    const malo = (error: string) => NextResponse.json({ error }, { status: 400 });
    const db = await createClient();

    try {
        if (b.accion === "crear") {
            const email = String(b.email ?? "").trim().toLowerCase();
            if (!esUuid(b.quoteId)) return malo("Presupuesto inválido");
            if (!EMAIL.test(email)) return malo("Poné el mail de la cuenta de Mercado Pago del cliente");
            if (!montoValido(b.monto)) return malo("El monto tiene que ser una cantidad entera de pesos");
            const quoteId = b.quoteId as string;

            const q = await db.from("quotes").select("data").eq("id", quoteId).maybeSingle();
            if (q.error) throw q.error;
            if (!q.data) return malo("No encontré el presupuesto");

            // Un cobro automático por trabajo: el anterior (por ejemplo, con el mail equivocado) se cancela.
            const previas = await db.from("mp_subscriptions").select("id").eq("quote_id", quoteId).neq("status", "cancelled");
            if (previas.error) throw previas.error;
            for (const p of previas.data ?? []) {
                // Si ya estaba cancelada allá, Mercado Pago rechaza cancelarla de nuevo: vale lo que diga al leerla.
                const vieja = await cambiarSuscripcion(p.id, { status: "cancelled" }).catch(() => leerSuscripcion(p.id));
                await registrarSuscripcion(db, vieja);
                if (vieja.status !== "cancelled") throw new ErrorMP("No se pudo cancelar el cobro automático anterior en Mercado Pago. Probá de nuevo.", 502);
            }

            const cliente = (q.data.data as { cliente?: { negocio?: string; nombre?: string } } | null)?.cliente;
            const quien = (cliente?.negocio || cliente?.nombre || "").trim();
            const creada = await crearSuscripcion({
                quoteId,
                email,
                monto: b.monto as number,
                motivo: `Mantenimiento de la web${quien ? ` de ${quien}` : ""} · Logika`,
                inicio: inicioDeCobro(String(b.inicio ?? ""), diaArgentina(new Date().toISOString())),
                volverA: SITE_URL,
            });
            return NextResponse.json({ suscripcion: await registrarSuscripcion(db, creada) });
        }

        if (b.accion === "cobrar") {
            const concepto = String(b.concepto ?? "").trim().slice(0, 80) || "Pago";
            if (!esUuid(b.quoteId)) return malo("Presupuesto inválido");
            if (!montoValido(b.monto)) return malo("El monto tiene que ser una cantidad entera de pesos");
            const quoteId = b.quoteId as string;

            const q = await db.from("quotes").select("title").eq("id", quoteId).maybeSingle();
            if (q.error) throw q.error;
            if (!q.data) return malo("No encontré el presupuesto");

            // El renglón va antes que el link: un pago nunca llega sin saber de qué link es.
            const id = randomUUID();
            const ahora = Date.now();
            const nuevo = await db.from("mp_links").insert({ id, quote_id: quoteId, concept: concepto, amount: b.monto, status: "open" });
            if (nuevo.error) throw nuevo.error;
            try {
                const preferencia = await crearLinkDePago({
                    referencia: referenciaDeCobro(quoteId, id),
                    titulo: `${concepto} · ${q.data.title || "Tu web"} · Logika`,
                    monto: b.monto as number,
                    volverA: SITE_URL,
                    ahora,
                });
                const listo = await db
                    .from("mp_links")
                    .update({ preference_id: preferencia.id, link: preferencia.init_point ?? "", expires_at: new Date(ahora + VIGENCIA_LINK_MS).toISOString() })
                    .eq("id", id)
                    .select()
                    .single();
                if (listo.error) throw listo.error;
                return NextResponse.json({ link: listo.data });
            } catch (e) {
                await db.from("mp_links").delete().eq("id", id);
                throw e;
            }
        }

        if (b.accion === "anular" || b.accion === "revisarLink") {
            const link = await db.from("mp_links").select("*").eq("id", String(b.id ?? "")).maybeSingle();
            if (link.error) throw link.error;
            if (!link.data) return malo("No encontré ese link");

            if (b.accion === "anular") {
                if (link.data.preference_id) await vencerLinkDePago(link.data.preference_id, Date.now());
                const anulado = await db.from("mp_links").update({ status: "void" }).eq("id", link.data.id).select().single();
                if (anulado.error) throw anulado.error;
                return NextResponse.json({ link: anulado.data });
            }

            for (const p of await buscarPagos(referenciaDeCobro(link.data.quote_id, link.data.id))) await registrarPago(db, p);
            const [actual, pagos] = await Promise.all([
                db.from("mp_links").select("*").eq("id", link.data.id).single(),
                db.from("mp_charges").select("*").eq("quote_id", link.data.quote_id),
            ]);
            if (actual.error) throw actual.error;
            if (pagos.error) throw pagos.error;
            return NextResponse.json({ link: actual.data, pagosMp: pagos.data });
        }

        // Las demás acciones son sobre una suscripción que ya está en el panel.
        const id = String(b.id ?? "");
        const fila = await db.from("mp_subscriptions").select("id, quote_id").eq("id", id).maybeSingle();
        if (fila.error) throw fila.error;
        if (!fila.data) return malo("No encontré ese cobro automático");

        if (b.accion === "cancelar") {
            return NextResponse.json({ suscripcion: await registrarSuscripcion(db, await cambiarSuscripcion(id, { status: "cancelled" })) });
        }
        if (b.accion === "monto") {
            if (!montoValido(b.monto)) return malo("El monto tiene que ser una cantidad entera de pesos");
            return NextResponse.json({ suscripcion: await registrarSuscripcion(db, await cambiarSuscripcion(id, { monto: b.monto as number })) });
        }
        if (b.accion === "revisar") {
            const suscripcion = await registrarSuscripcion(db, await leerSuscripcion(id));
            // De la más vieja a la más nueva: cada cobro nuevo toma el mes que le toca.
            const facturas = (await buscarFacturas(id)).sort((x, y) => String(x.date_created).localeCompare(String(y.date_created)));
            for (const f of facturas) await registrarFactura(db, f);
            const cobros = await db.from("mp_payments").select("*").eq("quote_id", fila.data.quote_id);
            if (cobros.error) throw cobros.error;
            return NextResponse.json({ suscripcion, cobros: cobros.data });
        }
        return malo("Acción inválida");
    } catch (e) {
        if (e instanceof ErrorMP) return NextResponse.json({ error: e.message }, { status: e.estado === 503 ? 503 : 502 });
        console.error("Admin mercadopago error:", e);
        return NextResponse.json({ error: "No se pudo guardar. Probá de nuevo." }, { status: 500 });
    }
}
