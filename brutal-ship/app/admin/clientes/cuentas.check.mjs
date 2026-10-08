// Chequeo de las cuentas de cobro. Correr con: node app/admin/clientes/cuentas.check.mjs
import assert from "node:assert/strict";
import { cobroDe, costosDe, mismoCliente, pagosDe, peorEstado } from "./cuentas.ts";

const pago = (monto) => ({ id: String(monto), fecha: "2026-10-07", monto, nota: "" });

// Nada cobrado: debe la seña y falta todo.
let c = cobroDe(400000, 200000, [], []);
assert.equal(c.estado, "debe-sena");
assert.equal(c.falta, 400000);
assert.equal(c.faltaSena, 200000);

// Seña pagada en dos cuotas, con costos.
c = cobroDe(400000, 200000, [pago(150000), pago(50000)], [{ id: "a", concepto: "Plugin", monto: 30000 }]);
assert.equal(c.estado, "falta-saldo");
assert.equal(c.cobrado, 200000);
assert.equal(c.falta, 200000);
assert.equal(c.faltaSena, 0);
assert.equal(c.ganancia, 370000);
assert.equal(c.gananciaCobrada, 170000);

// Pagado de más: no queda deuda negativa.
c = cobroDe(400000, 200000, [pago(450000)], []);
assert.equal(c.estado, "pagado");
assert.equal(c.falta, 0);

// Sin seña pactada y sin cobrar: falta el saldo, no "debe la seña".
assert.equal(cobroDe(100000, 0, [], []).estado, "falta-saldo");

assert.equal(peorEstado(["pagado", "falta-saldo"]), "falta-saldo");
assert.equal(peorEstado([]), null);

// JSON roto de la base: se descarta lo que no sirve sin romper.
assert.deepEqual(pagosDe([null, "x", { monto: "-5", fecha: 3 }]), [{ id: "pago-0", fecha: "", monto: 0, nota: "" }]);
assert.deepEqual(costosDe("nada"), []);

const contacto = (o) => ({ name: "", business: "", whatsapp: "", email: "", ...o });
assert.ok(mismoCliente(contacto({ whatsapp: "11 2345-6789" }), contacto({ whatsapp: "+54 9 11 2345 6789" })));
assert.ok(mismoCliente(contacto({ email: "Juana@Gmail.com " }), contacto({ email: "juana@gmail.com" })));
assert.ok(mismoCliente(contacto({ name: "Juana", business: "La Espiga" }), contacto({ name: "juana ", business: "la espiga" })));
assert.ok(!mismoCliente(contacto({ name: "Juana" }), contacto({ name: "Juana", business: "Otra" })));
assert.ok(!mismoCliente(contacto({}), contacto({})));

console.log("cuentas: ok");
