import { NextResponse, type NextRequest } from "next/server";
import { firmaValida, leerFactura, leerPago, leerSuscripcion } from "@/lib/mercadopago";
import { registrarFactura, registrarPago, registrarSuscripcion } from "@/lib/mercadopago-registro";
import { createServiceClient } from "@/lib/supabase/servicio";

/**
 * Avisos de Mercado Pago: Tus integraciones → Webhooks, eventos "Pagos" (links de
 * pago único) y "Planes y suscripciones" (el mensual), con la URL
 * https://www.logikaweb.com.ar/api/mercadopago/webhook.
 *
 * El aviso solo dice qué cambió. Los datos se vuelven a pedir a la API con el
 * token, así que uno falso no podría cargar nada aunque pasara la firma. Hay que
 * responder 200 en menos de 22 segundos; con un error, Mercado Pago reintenta
 * cada 15 minutos.
 */
export async function POST(request: NextRequest) {
    const query = request.nextUrl.searchParams;
    const cuerpo = ((await request.json().catch(() => null)) ?? {}) as { type?: string; topic?: string; data?: { id?: string | number } };
    const tipo = query.get("type") ?? query.get("topic") ?? cuerpo.type ?? cuerpo.topic ?? "";
    // La firma usa el data.id de la URL; si no viene, el del cuerpo sirve igual para pedir el recurso.
    const idDeUrl = query.get("data.id");
    const id = idDeUrl ?? (cuerpo.data?.id != null ? String(cuerpo.data.id) : "");

    const secreto = process.env.MP_WEBHOOK_SECRET;
    if (!secreto) {
        console.error("Aviso de Mercado Pago sin MP_WEBHOOK_SECRET configurado");
        return NextResponse.json({ error: "Sin configurar" }, { status: 503 });
    }
    const firmado = firmaValida({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId: idDeUrl,
        secreto,
    });
    if (!firmado) return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    if (!id) return NextResponse.json({ ok: true });

    try {
        const db = createServiceClient();
        if (tipo === "subscription_preapproval") await registrarSuscripcion(db, await leerSuscripcion(id));
        else if (tipo === "subscription_authorized_payment") await registrarFactura(db, await leerFactura(id));
        else if (tipo === "payment") await registrarPago(db, await leerPago(id));
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("Aviso de Mercado Pago:", tipo, id, e);
        return NextResponse.json({ error: "No se pudo registrar" }, { status: 500 });
    }
}
