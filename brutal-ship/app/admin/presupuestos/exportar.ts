/**
 * Descarga del presupuesto como archivo, sin pasar por el diálogo de imprimir.
 *
 * La hoja se fotografía con modern-screenshot, que la dibuja con el propio motor
 * del navegador (SVG foreignObject). Por eso sale idéntica a la vista previa:
 * container queries, color-mix de Tailwind, las fuentes de la marca, el sello.
 * html2canvas, la alternativa habitual, reimplementa el CSS a mano y no entiende
 * nada de eso.
 *
 * El PDF arma páginas A4 con esa imagen, cortando solo en los huecos entre
 * bloques: nunca por la mitad de un renglón, una fila del detalle o una ficha.
 *
 * Las dos librerías se cargan recién al descargar; el panel no las paga.
 */

/** Ancho útil de un A4 con 12 mm de margen, en px CSS: 186 mm a 96 ppp. */
export const ANCHO_HOJA_PX = 703;

const MARGEN_MM = 12;
const ANCHO_UTIL_MM = 210 - MARGEN_MM * 2;
const ALTO_UTIL_MM = 297 - MARGEN_MM * 2;
const MM_POR_PX = ANCHO_UTIL_MM / ANCHO_HOJA_PX;
/** 2x para que el texto se lea nítido al hacer zoom o al imprimir el PDF. */
const ESCALA = 2;

async function fotografiar(nodo: HTMLElement): Promise<HTMLCanvasElement> {
    await document.fonts.ready;
    const { domToCanvas } = await import("modern-screenshot");
    return domToCanvas(nodo, { scale: ESCALA, backgroundColor: "#ffffff" });
}

function bajar(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    // Safari empieza la descarga de forma asíncrona: revocar en el acto la cancela.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** "Presupuesto 0007 Panadería La Espiga" -> "Presupuesto-0007-Panaderia-La-Espiga" */
export function nombreDeArchivo(partes: string[]): string {
    return partes
        .filter(Boolean)
        .join(" ")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export async function descargarImagen(nodo: HTMLElement, nombre: string) {
    const foto = await fotografiar(nodo);
    // Con aire alrededor: pegada al borde parece un recorte, no un documento.
    const margen = 40 * ESCALA;
    const lienzo = document.createElement("canvas");
    lienzo.width = foto.width + margen * 2;
    lienzo.height = foto.height + margen * 2;
    const ctx = lienzo.getContext("2d");
    if (!ctx) throw new Error("El navegador no pudo preparar la imagen");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(foto, margen, margen);

    const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, "image/png"));
    if (!blob) throw new Error("No se pudo generar la imagen");
    bajar(blob, `${nombre}.png`);
}

export async function descargarPdf(nodo: HTMLElement, nombre: string, titulo: string) {
    const cortes = puntosDeCorte(nodo, ALTO_UTIL_MM / MM_POR_PX);
    const foto = await fotografiar(nodo);
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    pdf.setProperties({ title: titulo, author: "Logika", creator: "Logika" });

    for (let i = 0; i < cortes.length - 1; i++) {
        const desde = Math.round(cortes[i] * ESCALA);
        const hasta = Math.min(Math.round(cortes[i + 1] * ESCALA), foto.height);
        if (hasta - desde < 2) continue;

        const pagina = document.createElement("canvas");
        pagina.width = foto.width;
        pagina.height = hasta - desde;
        const ctx = pagina.getContext("2d");
        if (!ctx) throw new Error("El navegador no pudo preparar el PDF");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pagina.width, pagina.height);
        ctx.drawImage(foto, 0, desde, foto.width, pagina.height, 0, 0, foto.width, pagina.height);

        if (i > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(
            pagina.toDataURL("image/jpeg", 0.92),
            "JPEG",
            MARGEN_MM,
            MARGEN_MM,
            ANCHO_UTIL_MM,
            (pagina.height / ESCALA) * MM_POR_PX,
            undefined,
            "FAST"
        );
    }

    bajar(pdf.output("blob"), `${nombre}.pdf`);
}

/**
 * Dónde termina cada página, en px CSS desde el borde superior de la hoja.
 *
 * Un corte es seguro si no cae adentro de ningún bloque que se lee de una vez:
 * los marcados `.no-cortar`, las fichas con su etiqueta (que sobresale del borde)
 * y cualquier renglón de texto. Desde el fondo de la página se sube hasta el
 * primer hueco seguro; si no aparece en la mitad inferior, se corta al ras.
 */
function puntosDeCorte(nodo: HTMLElement, altoPagina: number): number[] {
    const origen = nodo.getBoundingClientRect().top;
    const total = nodo.getBoundingClientRect().height;
    const bloques = Array.from(
        nodo.querySelectorAll<HTMLElement>(".no-cortar, .ficha, .ficha-etiqueta, .sello, header, h2, h3, p, li, dt, dd")
    ).map((el) => {
        const r = el.getBoundingClientRect();
        return [r.top - origen, r.bottom - origen] as const;
    });
    const adentroDeUnBloque = (y: number) => bloques.some(([arriba, abajo]) => y > arriba + 0.5 && y < abajo - 0.5);

    const cortes = [0];
    let inicio = 0;
    while (total - inicio > altoPagina) {
        const minimo = inicio + altoPagina * 0.5;
        let y = Math.floor(inicio + altoPagina);
        while (y > minimo && adentroDeUnBloque(y)) y--;
        if (y <= minimo) y = Math.floor(inicio + altoPagina);
        cortes.push(y);
        inicio = y;
    }
    cortes.push(total);
    return cortes;
}
