"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FocusEvent } from "react";

export interface CasoHero {
    id: string;
    ruta: string;
    titulo: string;
    imagen: string;
    rubro?: string;
    stats: { value: string; label: string }[];
}

/**
 * Los casos reales van pasando en el hero: el de adelante se va atrás y entra el
 * siguiente. Lo que se mueve solo más de 5 s tiene que poder frenarse (WCAG 2.2.2),
 * así que hay botón de pausa, se frena mientras el mouse o el foco están encima y,
 * con "reducir movimiento", no arranca solo.
 *
 * Las tarjetas comparten la misma celda de una grilla: el alto lo pone la más alta y
 * el cambio no mueve nada de la página. Solo la de adelante es enlace y recibe foco.
 */
const POSICION = {
    frente: { transform: "translate(0, 2.5rem)", zIndex: 30, opacity: 1 },
    derecha: { transform: "translate(calc(19% - 1rem), 0) rotate(6deg) scale(0.62)", zIndex: 20, opacity: 1 },
    izquierda: { transform: "translate(calc(-19% + 1rem), 0) rotate(-6deg) scale(0.62)", zIndex: 10, opacity: 1 },
    oculta: { transform: "translate(0, 1rem) scale(0.5)", zIndex: 0, opacity: 0 },
} as const;

const CADA_MS = 5000;

export default function HeroRotador({ casos }: { casos: CasoHero[] }) {
    const n = casos.length;
    const [actual, setActual] = useState(0);
    const [pausado, setPausado] = useState(false);
    // Mouse y foco por separado: si el foco está en la tarjeta y el mouse sale, no puede
    // volver a pasar (la tarjeta quedaría inert con el foco adentro).
    const [mouseEncima, setMouseEncima] = useState(false);
    const [focoAdentro, setFocoAdentro] = useState(false);
    const encima = mouseEncima || focoAdentro;

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPausado(true);
    }, []);

    useEffect(() => {
        if (n < 2 || pausado || encima) return;
        const id = window.setInterval(() => {
            if (!document.hidden) setActual((a) => (a + 1) % n);
        }, CADA_MS);
        return () => window.clearInterval(id);
    }, [n, pausado, encima]);

    const lugar = (i: number): keyof typeof POSICION => {
        const o = (((i - actual) % n) + n) % n;
        if (o === 0) return "frente";
        if (o === 1) return "derecha";
        if (o === n - 1) return "izquierda";
        return "oculta";
    };

    const salirDelFoco = (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocoAdentro(false);
    };

    return (
        // El botón va primero en el código (un lector de pantalla lo encuentra antes que
        // lo que cambia) y abajo en pantalla. Pausa al tocar las tarjetas, no el botón.
        <figure className="relative mx-auto flex w-full max-w-md flex-col lg:max-w-lg">
            {n > 1 && (
                <button
                    type="button"
                    onClick={() => setPausado((v) => !v)}
                    className="etiqueta order-last mt-3 inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg pr-2 text-ink-black/75 hover:text-primary"
                >
                    <span aria-hidden="true" className="material-icons text-xl">{pausado ? "play_arrow" : "pause"}</span>
                    {pausado ? "Seguir pasando los trabajos" : "Pausar los trabajos"}
                </button>
            )}

            <div
                className="relative grid pb-10"
                onMouseEnter={() => setMouseEncima(true)}
                onMouseLeave={() => setMouseEncima(false)}
                onFocus={() => setFocoAdentro(true)}
                onBlur={salirDelFoco}
            >
                {casos.map((c, i) => {
                    const p = lugar(i);
                    const adelante = p === "frente";
                    return (
                        <Link
                            key={c.id}
                            href={c.ruta}
                            inert={!adelante}
                            style={POSICION[p]}
                            className="group block origin-top overflow-hidden rounded-xl border-2 border-black bg-white shadow-neobrutalism-lg transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0,0,1)] [grid-area:1/1]"
                        >
                            <span className="relative block aspect-[4/3] border-b-2 border-black bg-background-light">
                                {/* El título del enlace ya nombra el caso: con alt el lector lo repetía.
                                    Las ocultas no cargan imagen: si no, se bajaban las 6 de entrada (la
                                    carga diferida mira si está en pantalla, no si se ve). Cada una entra
                                    5 s antes de pasar al frente. */}
                                {p !== "oculta" && (
                                    <Image
                                        src={c.imagen}
                                        alt=""
                                        fill
                                        priority={i === 0}
                                        sizes="(max-width: 1023px) 90vw, 512px"
                                        className="object-cover object-top"
                                    />
                                )}
                            </span>
                            <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-3 sm:p-4">
                                <span className="min-w-0">
                                    {c.rubro && <span className="etiqueta block text-ink-black/70">{c.rubro}</span>}
                                    <span className="block font-bold leading-tight text-ink-black group-hover:text-primary">{c.titulo}</span>
                                </span>
                                {c.stats.length > 0 && (
                                    <span className="flex flex-wrap gap-1.5">
                                        {c.stats.map((s, j) => (
                                            <span key={j} className="inline-flex items-baseline gap-1 rounded-md border-2 border-black bg-accent-yellow px-2 py-0.5">
                                                <span className="text-sm font-black tabular-nums text-ink-black">{s.value}</span>
                                                <span className="etiqueta text-ink-black/80">{s.label}</span>
                                            </span>
                                        ))}
                                    </span>
                                )}
                            </span>
                        </Link>
                    );
                })}

                {/* Dentro de una caja posicionada: `.sello` fija position: relative fuera de
                    capa y le gana a la utilidad `absolute`. */}
                <span className="absolute -bottom-4 right-4 z-40">
                    <span className="sello sello-derecha bg-primary text-white text-xs shadow-neobrutalism-sm">Hecho por Logika</span>
                </span>
            </div>
        </figure>
    );
}
