import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Las dos voces del sitio, en TTF estatico para Satori (el motor de `next/og`).
 *
 * Salen de los mismos archivos que next/font baja de Google Fonts para el sitio:
 * se tomo cada fuente variable, se fijo el peso y se guardo como TTF, que es lo
 * que Satori sabe leer (woff2 no). Subset latino: cubre castellano completo.
 * Space Grotesk y Bitter son SIL Open Font License 1.1 (ver fonts/LICENSE.txt).
 *
 *   Space Grotesk Bold   — titulares, etiquetas, sellos, numeros
 *   Space Grotesk Medium — la URL de la barra del navegador
 *   Bitter Medium / Bold — lo que se lee de corrido
 *
 * Las rutas van escritas enteras a proposito: asi el build ve que archivos usa
 * cada funcion y los incluye en el deploy (las tarjetas del portafolio se
 * regeneran en el servidor). next.config.ts los declara tambien, por las dudas.
 */
function leer() {
    const cwd = process.cwd();
    return Promise.all([
        readFile(join(cwd, "lib/og/fonts/SpaceGrotesk-Bold.ttf")),
        readFile(join(cwd, "lib/og/fonts/SpaceGrotesk-Medium.ttf")),
        readFile(join(cwd, "lib/og/fonts/Bitter-Medium.ttf")),
        readFile(join(cwd, "lib/og/fonts/Bitter-Bold.ttf")),
    ]).then(([grotesk700, grotesk500, bitter500, bitter700]) => [
        { name: "Space Grotesk", data: grotesk700, weight: 700 as const, style: "normal" as const },
        { name: "Space Grotesk", data: grotesk500, weight: 500 as const, style: "normal" as const },
        { name: "Bitter", data: bitter500, weight: 500 as const, style: "normal" as const },
        { name: "Bitter", data: bitter700, weight: 700 as const, style: "normal" as const },
    ]);
}

let cargadas: ReturnType<typeof leer> | null = null;

export function fuentes() {
    cargadas ??= leer();
    return cargadas;
}
