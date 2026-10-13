/**
 * En qué grupo va cada característica de un plan y cómo pasa de uno a otro.
 * Sin React ni alias de rutas, para que lo pruebe grupos.check.mjs con node.
 *
 * Los grupos van en este orden, igual en el editor que en la tarjeta del sitio:
 * a la vista, en "ver más" y ocultas (guardadas, pero no se muestran).
 */
export const ESTADOS = ["vista", "mas", "oculta"] as const;
export type Estado = (typeof ESTADOS)[number];

type ConGrupo = { _key: string; collapsed: boolean; hidden: boolean };

export const estadoDe = (f: ConGrupo): Estado => (f.hidden ? "oculta" : f.collapsed ? "mas" : "vista");
const rango = (f: ConGrupo) => ESTADOS.indexOf(estadoDe(f));

export function conEstado<F extends ConGrupo>(f: F, e: Estado): F {
    return { ...f, collapsed: e !== "vista", hidden: e === "oculta" };
}

/** Ordena por grupo y deja cada grupo en su orden (sort es estable). */
export function agrupar<F extends ConGrupo>(lista: F[]): F[] {
    return [...lista].sort((a, b) => rango(a) - rango(b));
}

/**
 * Después de arrastrar una, decide en qué grupo queda según dónde la soltaron:
 * el suyo si entra entre sus vecinas, y si no el más cercano (entre el de la de
 * arriba y el de la de abajo). Con la lista agrupada, eso nunca deja una de
 * "ver más" en medio de las visibles, ni cambia de grupo a una que se soltó en
 * el borde de su propio grupo.
 */
export function ubicarMovida<F extends ConGrupo>(lista: F[], key: string): F[] {
    const i = lista.findIndex((f) => f._key === key);
    if (i < 0) return lista;
    const arriba = i > 0 ? rango(lista[i - 1]) : 0;
    const abajo = i < lista.length - 1 ? rango(lista[i + 1]) : ESTADOS.length - 1;
    const r = Math.max(arriba, Math.min(rango(lista[i]), abajo));
    return lista.map((f) => (f._key === key ? conEstado(f, ESTADOS[r]) : f));
}

/**
 * La pasa de grupo y la deja en el borde que da a su grupo de antes: arriba del
 * grupo nuevo si baja, al final si sube. Así queda cerca de donde estaba.
 */
export function cambiarEstado<F extends ConGrupo>(lista: F[], key: string, e: Estado): F[] {
    const f = lista.find((x) => x._key === key);
    if (!f || estadoDe(f) === e) return lista;
    const r = ESTADOS.indexOf(e);
    const baja = r > rango(f);
    const resto = lista.filter((x) => x._key !== key);
    const borde = resto.filter((x) => (baja ? rango(x) < r : rango(x) <= r)).length;
    resto.splice(borde, 0, conEstado(f, e));
    return resto;
}

/**
 * Una nueva entra al final del grupo de la última que se ve. Nunca oculta:
 * recién escrita, se quiere ver. Después se cambia con un clic.
 */
export function agregarAlFinal<F extends ConGrupo>(lista: F[], nueva: F): F[] {
    const ultima = lista.findLast((f) => !f.hidden);
    const e = ultima ? estadoDe(ultima) : "vista";
    const r = ESTADOS.indexOf(e);
    const out = lista.slice();
    out.splice(lista.filter((x) => rango(x) <= r).length, 0, conEstado(nueva, e));
    return out;
}
