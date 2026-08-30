"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface PortfolioViewerProps {
    src: string;
    alt: string;
    titulo: string;
    /** Clase del filtro que ya aplicaba la tarjeta (escala de grises, etc.). */
    filtro?: string;
}

/**
 * El screenshot dejaba de ser una prueba y pasaba a ser un adorno: `object-cover`
 * dentro de un 4:3 recorta la web y muestra sólo la cabecera. En el portafolio de
 * una agencia eso es lo único que no se puede hacer — el trabajo tiene que verse.
 *
 * Dos gestos, uno por dispositivo:
 *   · En escritorio, al pasar el mouse la captura RECORRE la página hacia abajo.
 *     No es un efecto: es la forma más corta de decir "esto es un sitio completo,
 *     no una imagen".
 *   · Al hacer clic (o Enter), se abre completa y scrolleable.
 *
 * Usa `<dialog>` nativo con `showModal()`, que ya trae trampa de foco, cierre con
 * Escape, `::backdrop` e inertización del fondo. Reimplementar eso a mano siempre
 * sale peor.
 */
export default function PortfolioViewer({ src, alt, titulo, filtro = "" }: PortfolioViewerProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const disparadorRef = useRef<HTMLButtonElement>(null);
    const [abierto, setAbierto] = useState(false);

    const abrir = useCallback(() => {
        setAbierto(true);
        dialogRef.current?.showModal();
    }, []);

    const cerrar = useCallback(() => {
        setAbierto(false);
        dialogRef.current?.close();
    }, []);

    // `close` también dispara con Escape, así que el foco vuelve siempre al disparador.
    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        const alCerrar = () => {
            setAbierto(false);
            disparadorRef.current?.focus();
        };
        d.addEventListener("close", alCerrar);
        return () => d.removeEventListener("close", alCerrar);
    }, []);

    return (
        <>
            <button
                ref={disparadorRef}
                type="button"
                onClick={abrir}
                aria-haspopup="dialog"
                className="group/ver relative block w-full h-full cursor-zoom-in focus-visible:outline-3"
            >
                <span className="sr-only">Ver {titulo} en grande</span>
                <span aria-hidden="true" className="block w-full h-full overflow-hidden">
                    <Image
                        alt={alt}
                        className={`w-full h-full object-cover object-top transition-[object-position] duration-[2500ms] ease-linear group-hover/ver:object-bottom ${filtro}`}
                        src={src}
                        width={800}
                        height={600}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        loading="lazy"
                    />
                </span>
                {/* Afordancia explícita: sin esto nadie sabe que la imagen se abre. */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-ink-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-black shadow-neobrutalism-sm rounded opacity-0 translate-y-1 transition-all duration-200 group-hover/ver:opacity-100 group-hover/ver:translate-y-0 group-focus-visible/ver:opacity-100 group-focus-visible/ver:translate-y-0"
                >
                    {/* `expand_content` pertenece a Material Symbols, no al set clasico que carga
                        el sitio. La ligadura nunca se formaba y en su lugar se imprimia la
                        palabra "expand_content" al lado de "Ver completo", 126px de texto
                        donde iba un icono de 14. `open_in_full` es el equivalente y si existe. */}
                    <span className="material-icons text-sm">open_in_full</span>
                    Ver completo
                </span>
            </button>

            <dialog
                ref={dialogRef}
                aria-label={`${titulo} — captura completa`}
                className="visor backdrop:bg-ink-black/80 bg-transparent p-0 max-w-none max-h-none w-full h-full"
            >
                {abierto && (
                    <div className="flex flex-col h-full w-full p-4 md:p-8">
                        <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                            <p className="bg-accent-yellow text-ink-black font-bold text-sm uppercase tracking-wider px-4 py-2 border-2 border-black shadow-neobrutalism-sm rounded">
                                {titulo}
                            </p>
                            <button
                                type="button"
                                onClick={cerrar}
                                className="inline-flex items-center gap-2 min-h-11 bg-white text-ink-black font-bold text-sm uppercase tracking-wider px-4 border-2 border-black shadow-neobrutalism rounded hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Cerrar
                                <span aria-hidden="true" className="material-icons text-lg">close</span>
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto border-4 border-black rounded-xl bg-white shadow-neobrutalism-xl">
                            {/* Ancho natural, alto libre: la captura se recorre entera. */}
                            <Image
                                alt={alt}
                                className="w-full h-auto block"
                                src={src}
                                width={1600}
                                height={1200}
                                sizes="100vw"
                            />
                        </div>
                        <p className="mt-3 text-center text-white/70 text-sm font-medium shrink-0">
                            Scrolleá para recorrer el sitio · Escape para cerrar
                        </p>
                    </div>
                )}
            </dialog>
        </>
    );
}
