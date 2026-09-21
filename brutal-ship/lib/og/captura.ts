import sharp from "sharp";

/**
 * La captura de un proyecto del portafolio, lista para entrar en una tarjeta.
 *
 * Satori (el motor de `next/og`) no lee WebP, y el panel guarda las capturas en
 * WebP: pasarle la URL tal cual rompia la imagen entera. Aca se baja, se recorta
 * al tamanio exacto del marco (anclada arriba, donde esta el hero del sitio) y
 * se pasa a JPEG. Si algo falla devuelve null, y la tarjeta dibuja un esqueleto
 * de pagina en vez de caerse.
 */
export async function captura(
    url: string | null | undefined,
    ancho: number,
    alto: number
): Promise<string | null> {
    if (!url) return null;

    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return null;

        const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
            .resize(Math.round(ancho), Math.round(alto), { fit: "cover", position: "top" })
            .jpeg({ quality: 86, mozjpeg: true })
            .toBuffer();

        return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
    } catch {
        return null;
    }
}

/**
 * Las tarjetas con capturas salen en JPEG y no en PNG: con una foto adentro el
 * PNG pasa los 300 KB, y WhatsApp deja de mostrar la imagen.
 */
export async function comoJpeg(imagen: Response): Promise<Response> {
    const jpeg = await sharp(Buffer.from(await imagen.arrayBuffer()))
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer();

    return new Response(new Uint8Array(jpeg), {
        headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": imagen.headers.get("Cache-Control") ?? "public, max-age=0, must-revalidate",
        },
    });
}

/** El dominio para la barra del navegador, solo si es propio del cliente. */
export function dominioPropio(url: string | null | undefined): string | null {
    if (!url) return null;

    try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        // Un subdominio de plataforma ("cosmic-narwhal-e83911.netlify.app") no es
        // la direccion del cliente: en la barra se veria como un borrador.
        const plataforma = /\.(vercel\.app|netlify\.app|github\.io|pages\.dev|onrender\.com|web\.app|firebaseapp\.com)$/;
        return plataforma.test(host) ? null : host;
    } catch {
        return null;
    }
}
