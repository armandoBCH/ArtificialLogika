/**
 * Encabezado de cada pagina legal. Lo leen la pagina y su imagen de vista
 * previa: si la fecha de actualizacion viviera en dos lugares, la tarjeta de
 * LinkedIn terminaria mostrando una distinta de la que dice la pagina.
 *
 * `sello` es el veredicto de la tarjeta, y solo dice lo que la pagina ya dice.
 */
export const DOCUMENTOS = {
    privacidad: {
        titulo: "Política de Privacidad",
        actualizado: "23 de agosto de 2026",
        intro: "Qué datos tuyos guardamos, para qué los usamos y cómo pedir que los borremos. Sin letra chica.",
        sello: "Sin letra chica",
    },
    terminos: {
        titulo: "Términos de Servicio",
        actualizado: "16 de septiembre de 2026",
        intro: "Cómo trabajamos, qué incluye cada plan, cuándo se paga y qué pasa si algo no sale como esperabas.",
        sello: "Vigente",
    },
} as const;

export type Documento = (typeof DOCUMENTOS)[keyof typeof DOCUMENTOS];
