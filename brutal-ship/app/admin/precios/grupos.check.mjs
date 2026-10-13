// Chequeo de los grupos de características (a la vista, ver más, oculta).
// Correr con: node app/admin/precios/grupos.check.mjs
import assert from "node:assert/strict";
import { agrupar, agregarAlFinal, cambiarEstado, estadoDe, ubicarMovida } from "./grupos.ts";
import { separarCaracteristicas } from "../../../lib/precios.ts";

const f = (k, e = "vista") => ({ _key: k, collapsed: e !== "vista", hidden: e === "oculta" });
const claves = (lista) => lista.map((x) => x._key).join(",");
const estados = (lista) => lista.map(estadoDe).join(",");

// Agrupar respeta el orden dentro de cada grupo.
let l = agrupar([f("a", "oculta"), f("b", "mas"), f("c"), f("d", "mas"), f("e")]);
assert.equal(claves(l), "c,e,b,d,a");

// Bajar a oculta: queda arriba de las ocultas. Subir a la vista: al final de las visibles.
l = [f("a"), f("b"), f("c", "mas"), f("d", "oculta")];
assert.equal(claves(cambiarEstado(l, "a", "oculta")), "b,c,a,d");
assert.equal(estados(cambiarEstado(l, "a", "oculta")), "vista,mas,oculta,oculta");
assert.equal(claves(cambiarEstado(l, "d", "vista")), "a,b,d,c");
assert.equal(cambiarEstado(l, "a", "vista"), l, "mismo estado: no cambia nada");

// Arrastrar: soltada entre dos visibles, pasa a la vista.
l = ubicarMovida([f("a"), f("x", "oculta"), f("b"), f("c", "mas")], "x");
assert.equal(estados(l), "vista,vista,vista,mas");
// Soltada en el borde de su propio grupo, no cambia de grupo.
l = ubicarMovida([f("a"), f("x", "mas"), f("c", "mas")], "x");
assert.equal(estadoDe(l[1]), "mas");
// Al final, debajo de ocultas, queda oculta.
l = ubicarMovida([f("c", "mas"), f("d", "oculta"), f("x")], "x");
assert.equal(estadoDe(l[2]), "oculta");
// Primera de todas, arriba de las visibles, pasa a la vista.
l = ubicarMovida([f("x", "oculta"), f("a"), f("b", "mas")], "x");
assert.equal(estadoDe(l[0]), "vista");

// Una nueva nunca nace oculta: va al final del grupo de la última que se ve.
l = agregarAlFinal([f("a"), f("b", "mas"), f("c", "oculta")], f("n"));
assert.equal(claves(l), "a,b,n,c");
assert.equal(estadoDe(l[2]), "mas");
l = agregarAlFinal([f("c", "oculta")], f("n", "oculta"));
assert.equal(claves(l), "n,c");
assert.equal(estadoDe(l[0]), "vista");

// En el sitio las ocultas no salen; las viejas sin dato siguen la regla de 4 a la vista.
const sitio = separarCaracteristicas([
    { text: "1" }, { text: "2", hidden: true, collapsed: false }, { text: "3" }, { text: "4" }, { text: "5" },
]);
assert.deepEqual(sitio.aLaVista.map((x) => x.text), ["1", "3", "4"]);
assert.deepEqual(sitio.enVerMas.map((x) => x.text), ["5"]);
assert.deepEqual(sitio.ocultas.map((x) => x.text), ["2"]);

console.log("grupos: ok");
