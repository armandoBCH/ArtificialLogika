"use client";

import Image from "next/image";
import { useState } from "react";
import PortfolioViewer from "@/app/components/PortfolioViewer";

interface Imagen {
    src: string;
    /** "4:3" es la captura de detalle; "16:9" la panorámica del catálogo. */
    formato: "4:3" | "16:9";
}

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
            <div className={`relative overflow-hidden rounded-xl border-2 border-black bg-background-light shadow-neobrutalism ${imagen.formato === "4:3" ? "aspect-[4/3]" : "aspect-video"}`}>
                <PortfolioViewer key={imagen.src} src={imagen.src} alt={alt} titulo={titulo} sizes="(max-width: 1023px) 100vw, 720px" />
            </div>

            {imagenes.length > 1 && (
                <ul className="mt-3 flex gap-3" aria-label="Imágenes del proyecto">
                    {imagenes.map((img, i) => (
                        <li key={img.src}>
                            <button
                                type="button"
                                onClick={() => setActual(i)}
                                aria-pressed={i === actual}
                                aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
                                className={`relative block h-16 overflow-hidden rounded-lg border-2 bg-background-light transition-all md:h-20 ${img.formato === "4:3" ? "aspect-[4/3]" : "aspect-video"} ${i === actual
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
