// Chequeo de lo que no habla con Mercado Pago. Correr con: node lib/mercadopago.check.mjs
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { datosDeFactura, datosDePago, filaDeSuscripcion, firmaValida, inicioDeCobro, isoArgentina, leerReferenciaDeCobro, referenciaDeCobro } from "./mercadopago.ts";

// La firma del aviso, armada como en la documentación: id:[data.id];request-id:[x-request-id];ts:[ts];
const secreto = "clave-de-prueba";
const firmar = (manifest) => createHmac("sha256", secreto).update(manifest).digest("hex");
const v1 = firmar("id:123456;request-id:abc-1;ts:1704908010;");
const aviso = { xSignature: `ts=1704908010,v1=${v1}`, xRequestId: "abc-1", dataId: "123456", secreto };
assert.equal(firmaValida(aviso), true);
assert.equal(firmaValida({ ...aviso, xSignature: ` ts=1704908010 , v1=${v1} ` }), true); // espacios del header
assert.equal(firmaValida({ ...aviso, dataId: "999" }), false); // otro recurso
assert.equal(firmaValida({ ...aviso, secreto: "otra" }), false);
assert.equal(firmaValida({ ...aviso, xSignature: "ts=1704908010" }), false);
assert.equal(firmaValida({ ...aviso, xSignature: null }), false);
assert.equal(firmaValida({ ...aviso, xSignature: `ts=abc,v1=${v1}` }), false);
// Lo que no viene en el aviso no va en el manifest (igual que el SDK oficial).
assert.equal(firmaValida({ xSignature: `ts=1,v1=${firmar("ts:1;")}`, xRequestId: null, dataId: null, secreto }), true);

// Suscripción: solo las de este panel, que llevan el id del presupuesto en external_reference.
const quote = "6f1c2b9e-1d2a-4c3b-9e8f-0a1b2c3d4e5f";
const preapproval = {
    id: "2c9380847e9b",
    status: "authorized",
    payer_email: "juana@gmail.com",
    external_reference: quote,
    init_point: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c9380847e9b",
    next_payment_date: "2026-11-09T10:00:00.000-03:00",
    auto_recurring: { transaction_amount: "39000.00" },
};
assert.deepEqual(filaDeSuscripcion(preapproval), {
    id: "2c9380847e9b",
    quote_id: quote,
    status: "authorized",
    payer_email: "juana@gmail.com",
    amount: 39000,
    link: preapproval.init_point,
    next_payment_date: "2026-11-09T10:00:00.000-03:00",
});
assert.equal(filaDeSuscripcion({ ...preapproval, external_reference: "YG-1234" }), null);

// Cobro: el día va en hora argentina. Las 23:30 del 31/10 en Argentina ya son el 1/11 en UTC.
const factura = {
    id: 6114264375,
    preapproval_id: "2c9380847e9b",
    external_reference: quote,
    transaction_amount: "39000.40",
    date_created: "2026-10-31T23:00:00.000-03:00",
    debit_date: "2026-11-01T02:30:00.000Z",
    status: "processed",
    payment: { id: 1995, status: "approved" },
};
assert.deepEqual(datosDeFactura(factura), { subscription_id: "2c9380847e9b", amount: 39000, paid_on: "2026-10-31", status: "approved" });
// Sin intento de cobro todavía: queda el estado de la factura.
assert.equal(datosDeFactura({ ...factura, payment: null, status: "scheduled" }).status, "scheduled");
assert.equal(datosDeFactura({ id: 1 }), null);

// Primer cobro: sin fecha o con hoy, cobra al cargar la tarjeta; más adelante, ese día al mediodía.
assert.equal(inicioDeCobro("", "2026-10-09"), undefined);
assert.equal(inicioDeCobro("2026-10-09", "2026-10-09"), undefined);
assert.equal(inicioDeCobro("2026-10-01", "2026-10-09"), undefined);
assert.equal(inicioDeCobro("2026-11-09", "2026-10-09"), "2026-11-09T12:00:00.000-03:00");

// Links de pago único: la referencia lleva el presupuesto y el link, y nada más los reconoce.
const link = "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";
assert.equal(referenciaDeCobro(quote, link), `cobro:${quote}:${link}`);
assert.deepEqual(leerReferenciaDeCobro(`cobro:${quote}:${link}`), { quoteId: quote, linkId: link });
assert.equal(leerReferenciaDeCobro(quote), null); // así llegan los cobros de una suscripción: no son de un link
assert.equal(leerReferenciaDeCobro(`cobro:${quote}:nada`), null);
assert.equal(leerReferenciaDeCobro(undefined), null);

// El pago: el día es el de la aprobación, en hora argentina.
const pagoMp = { id: 123, status: "approved", transaction_amount: 97250, date_created: "2026-10-09T20:00:00.000-03:00", date_approved: "2026-10-10T02:10:00.000Z" };
assert.deepEqual(datosDePago(pagoMp), { amount: 97250, paid_on: "2026-10-09", status: "approved" });
assert.equal(datosDePago({ ...pagoMp, status: "pending", date_approved: null }).paid_on, "2026-10-09");
assert.equal(datosDePago({ id: 1 }), null);

// Las fechas para Mercado Pago, en hora argentina (siempre -03:00).
assert.equal(isoArgentina(Date.parse("2026-10-09T15:00:00.000Z")), "2026-10-09T12:00:00.000-03:00");

console.log("mercadopago: ok");
