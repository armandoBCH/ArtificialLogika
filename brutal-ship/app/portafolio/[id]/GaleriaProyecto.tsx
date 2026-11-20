"use client";

import Image from "next/image";
import { useState } from "react";
import PortfolioViewer from "@/app/components/PortfolioViewer";

interface Imagen {
    src: string;
    /** "4:3" es la captura de detalle; "16:9" la panorámica del catálogo; "celular", la
        primera pantalla en un teléfono. */
    formato: "4:3" | "16:9" | "celular";
}

const PROPORCION = { "4:3": "aspect-[4/3]", "16:9": "aspect-video", celular: "aspect-[375/812]" } as const;

interface GaleriaProyectoProps {
    imagenes: Imagen[];
    alt: string;
    titulo: string;
}

/**
 * La galería del caso, como la de un producto en MercadoLibre: la imagen grande se abre
 * completa (PortfolioViewer, con Escape y foco atrapado) y las miniaturas cambian cuál se
 * ve. Cada imagen se muestra en su propia proporción, así ninguna se recorta.
 */
export default function GaleriaProyecto({ imagenes, alt, titulo }: GaleriaProyectoProps) {
    const [actual, setActual] = useState(0);
    if (imagenes.length === 0) return null;
    const imagen = imagenes[actual];

    return (
        <div>
            {/* En celular la captura va de borde a borde, sin marco: se integra con la página
                como la foto de un producto. Desde tablet vuelve el marco, que la separa del panel. */}
            {imagen.formato === "celular" ? (
                // La captura de celular va dentro de un teléfono, centrado en una caja 4:3: así
                // la galería no salta de alto al cambiar de imagen. El teléfono va absoluto con
                // top/bottom fijos: un h-% sobre una altura que sale de aspect-ratio falla en
                // Safari viejo.
                <div className="relative -mx-4 aspect-[4/3] overflow-hidden bg-ink-black sm:mx-0 sm:rounded-xl sm:border-2 sm:border-black sm:shadow-neobrutalism">
                    <div className="absolute inset-y-[5%] left-1/2 aspect-[375/812] -translate-x-1/2 rounded-[1.6rem] border-2 border-white bg-black p-1.5">
                        <div className="relative h-full w-full overflow-hidden rounded-[1.15rem] bg-background-light">
                            <PortfolioViewer key={imagen.src} src={imagen.src} alt={`${alt}, vista en un celular`} titulo={titulo} sizes="(max-width: 1023px) 45vw, 320px" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`relative -mx-4 overflow-hidden bg-background-light sm:mx-0 sm:rounded-xl sm:border-2 sm:border-black sm:shadow-neobrutalism ${PROPORCION[imagen.formato]}`}>
                    <PortfolioViewer key={imagen.src} src={imagen.src} alt={alt} titulo={titulo} sizes="(max-width: 1023px) 100vw, 720px" />
                </div>
            )}

            {imagenes.length > 1 && (
                <ul className="mt-3 flex gap-3" aria-label="Imágenes del proyecto">
                    {imagenes.map((img, i) => (
                        <li key={img.src}>
                            <button
                                type="button"
                                onClick={() => setActual(i)}
                                aria-pressed={i === actual}
                                aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
                                className={`relative block h-16 overflow-hidden rounded-lg border-2 bg-background-light transition-all md:h-20 ${PROPORCION[img.formato]} ${i === actual
                                    ? "border-black shadow-neobrutalism-sm"
                                    : "border-black/20 opacity-70 hover:opacity-100"}`}
                            >
                                <Image src={img.src} alt="" fill sizes="140px" className="object-cover object-top" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
