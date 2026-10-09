// Chequeo de las cuentas de cobro. Correr con: node app/admin/clientes/cuentas.check.mjs
import assert from "node:assert/strict";
import { cobroDe, costosDe, mensualDe, mismoCliente, nombreMes, pagosDe, peorEstado, resumenDe, sumarMeses, trabajoDe } from "./cuentas.ts";

const pago = (monto, fecha = "2026-10-07") => ({ id: `${monto}-${fecha}`, fecha, monto, nota: "", mes: "" });
const cuota = (mes, monto = 39000, fecha = `${mes}-05`) => ({ id: `c-${mes}`, fecha, monto, nota: "", mes });
const costo = (monto, mensual = false) => ({ id: `k-${monto}`, concepto: "", monto, mensual });

// Nada cobrado: debe la seña y falta todo.
let c = cobroDe(400000, 200000, [], []);
assert.equal(c.estado, "debe-sena");
assert.equal(c.falta, 400000);
assert.equal(c.faltaSena, 200000);

// Pagó la mitad de la seña: no es lo mismo que no haber pagado nada.
c = cobroDe(400000, 200000, [pago(100000)], []);
assert.equal(c.estado, "sena-incompleta");
assert.equal(c.faltaSena, 100000);
assert.equal(c.falta, 300000);

// Seña pagada en dos cuotas, con costos.
c = cobroDe(400000, 200000, [pago(150000), pago(50000)], [costo(30000)]);
assert.equal(c.estado, "falta-saldo");
assert.equal(c.cobrado, 200000);
assert.equal(c.falta, 200000);
assert.equal(c.faltaSena, 0);
assert.equal(c.ganancia, 370000);
assert.equal(c.gananciaCobrada, 170000);

// Las cuotas del mensual y los costos de todos los meses no tocan el proyecto.
c = cobroDe(400000, 200000, [pago(200000), cuota("2026-09")], [costo(30000), costo(8000, true)]);
assert.equal(c.cobrado, 200000);
assert.equal(c.falta, 200000);
assert.equal(c.costos, 30000);

// Pagado de más: no queda deuda negativa.
c = cobroDe(400000, 200000, [pago(450000)], []);
assert.equal(c.estado, "pagado");
assert.equal(c.falta, 0);

// Sin seña pactada y sin cobrar: falta el saldo, no "debe la seña".
assert.equal(cobroDe(100000, 0, [], []).estado, "falta-saldo");

assert.equal(peorEstado(["pagado", "sena-incompleta", "falta-saldo"]), "sena-incompleta");
assert.equal(peorEstado(["sena-incompleta", "debe-sena"]), "debe-sena");
assert.equal(peorEstado([]), null);

// Meses.
assert.equal(sumarMeses("2026-12", 1), "2027-01");
assert.equal(sumarMeses("2026-01", -1), "2025-12");
assert.equal(sumarMeses("2026-10", -13), "2025-09");
assert.equal(nombreMes("2026-10"), "octubre 2026");

// Mensual sin cuotas: no se espera nada hasta registrar la primera.
let m = mensualDe([], 39000, true, "2026-10");
assert.equal(m.empezo, false);
assert.deepEqual(m.deben, []);
assert.equal(m.proximo, "2026-10");
assert.equal(m.cuota, 39000);

// Pagó julio y septiembre: debe agosto; octubre todavía está en curso.
m = mensualDe([cuota("2026-07"), cuota("2026-09")], 39000, true, "2026-10");
assert.equal(m.empezo, true);
assert.deepEqual(m.deben, ["2026-08"]);
assert.equal(m.pagoEsteMes, false);
assert.equal(m.proximo, "2026-08");
assert.deepEqual(m.cuotas.map((x) => x.mes), ["2026-09", "2026-07"]);

// Al día con octubre: lo próximo es noviembre.
m = mensualDe([cuota("2026-09"), cuota("2026-10")], 39000, true, "2026-10");
assert.deepEqual(m.deben, []);
assert.equal(m.pagoEsteMes, true);
assert.equal(m.proximo, "2026-11");

// Dado de baja: los huecos no se cuentan como deuda.
assert.deepEqual(mensualDe([cuota("2026-07")], 39000, false, "2026-10").deben, []);

// La cuota se actualiza seguido: se espera lo último que pagó.
assert.equal(mensualDe([cuota("2026-08", 39000), cuota("2026-09", 45000)], 39000, true, "2026-10").cuota, 45000);

// JSON roto de la base: se descarta lo que no sirve sin romper.
assert.deepEqual(pagosDe([null, "x", { monto: "-5", fecha: 3 }]), [{ id: "pago-0", fecha: "", monto: 0, nota: "", mes: "" }]);
assert.equal(pagosDe([{ monto: 1, mes: "2026-13" }])[0].mes, "");
assert.equal(pagosDe([{ monto: 1, mes: "2026-09" }])[0].mes, "2026-09");
assert.deepEqual(costosDe("nada"), []);
assert.equal(costosDe([{ monto: 5 }])[0].mensual, false);
assert.equal(costosDe([{ monto: 5, mensual: true }])[0].mensual, true);

// Resumen: un trabajo con media seña y un mensual que debe septiembre, y uno sin aceptar que no suma.
const fila = (o) => ({ id: "q", status: "aceptado", client_id: "a", payments: [], costs: [], monthly_active: true, ...o });
const totales = { total: 400000, sena: 200000, mensual: 39000 };
const trabajos = [
    trabajoDe(fila({ payments: [pago(100000, "2026-10-08"), cuota("2026-08", 39000, "2026-08-05"), cuota("2026-10", 39000, "2026-10-03")], costs: [costo(30000), costo(8000, true)] }), totales, "2026-10"),
    trabajoDe(fila({ id: "otro", status: "enviado" }), totales, "2026-10"),
];
assert.equal(trabajos[0].cobro.estado, "sena-incompleta");
assert.equal(trabajos[0].pagos.length, 1);
assert.equal(trabajos[0].costosMes, 8000);
assert.equal(trabajos[1].cuenta, false);
const r = resumenDe(trabajos, "2026-10");
assert.equal(r.trabajos, 1);
assert.equal(r.falta, 300000 + 39000); // el saldo del proyecto más la cuota de septiembre
assert.equal(r.cuotasAtrasadas, 1);
assert.equal(r.cobrado, 100000 + 39000 + 39000);
assert.equal(r.entroEsteMes, 100000 + 39000);
assert.equal(r.ganancia, 370000);
assert.equal(r.porMes, 39000);
assert.equal(r.gananciaPorMes, 31000);
assert.equal(r.conMensual, 1);
assert.equal(r.pagaronEsteMes, 1);
assert.equal(r.estado, "sena-incompleta");

const contacto = (o) => ({ name: "", business: "", whatsapp: "", email: "", ...o });
assert.ok(mismoCliente(contacto({ whatsapp: "11 2345-6789" }), contacto({ whatsapp: "+54 9 11 2345 6789" })));
assert.ok(mismoCliente(contacto({ email: "Juana@Gmail.com " }), contacto({ email: "juana@gmail.com" })));
assert.ok(mismoCliente(contacto({ name: "Juana", business: "La Espiga" }), contacto({ name: "juana ", business: "la espiga" })));
assert.ok(!mismoCliente(contacto({ name: "Juana" }), contacto({ name: "Juana", business: "Otra" })));
assert.ok(!mismoCliente(contacto({}), contacto({})));

console.log("cuentas: ok");
