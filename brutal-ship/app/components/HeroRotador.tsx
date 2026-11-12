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
 * Mosaico de casos reales: se ven 4 a la vez y cada 2 s uno cambia por otro cliente,
 * así pasan todos sin que se mueva todo junto (una cosa por vez, como pide motion.md).
 *
 * Lo que se mueve solo más de 5 s tiene que poder frenarse (WCAG 2.2.2): botón de pausa
 * (primero en el código, abajo en pantalla), pausa mientras el mouse o el foco están
 * sobre el mosaico (estados separados) y, con "reducir movimiento", no arranca solo.
 */
const CADA_MS = 2000;
const MAX_CELDAS = 4;
// Orden en que cambian las celdas: en diagonal se siente menos mecánico que en fila.
const ORDEN = [0, 3, 1, 2];
const SIZES = "(max-width: 1023px) 46vw, 256px";

export default function HeroRotador({ casos }: { casos: CasoHero[] }) {
    const n = casos.length;
    const celdas = Math.min(MAX_CELDAS, n);
    const rota = n > celdas;

    const [estado, setEstado] = useState(() => ({
        visibles: Array.from({ length: celdas }, (_, i) => i),
        proximo: celdas % n,
        turno: 0,
        cambiada: -1,
    }));
    const [pausado, setPausado] = useState(false);
    // Mouse y foco por separado: si el foco está en una tarjeta y el mouse sale, no
    // puede cambiar (la tarjeta enfocada desaparecería con el foco adentro).
    const [mouseEncima, setMouseEncima] = useState(false);
    const [focoAdentro, setFocoAdentro] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPausado(true);
    }, []);

    useEffect(() => {
        if (!rota || pausado || mouseEncima || focoAdentro) return;
        const id = window.setInterval(() => {
            if (document.hidden) return;
            setEstado(({ visibles, proximo, turno }) => {
                // Si rota, hay más casos que celdas: siempre son las 4.
                const celda = ORDEN[turno % ORDEN.length];
                const nuevos = [...visibles];
                nuevos[celda] = proximo;
                let p = (proximo + 1) % n;
                while (nuevos.includes(p)) p = (p + 1) % n;
                return { visibles: nuevos, proximo: p, turno: turno + 1, cambiada: celda };
            });
        }, CADA_MS);
        return () => window.clearInterval(id);
    }, [rota, pausado, mouseEncima, focoAdentro, celdas, n]);

    const salirDelFoco = (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocoAdentro(false);
    };

    const proximo = casos[estado.proximo];

    return (
        <figure className="relative mx-auto flex w-full max-w-md flex-col lg:max-w-lg">
            {rota && (
                <button
                    type="button"
                    onClick={() => setPausado((v) => !v)}
                    className="etiqueta order-last mt-5 inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg pr-2 text-ink-black/75 hover:text-primary"
                >
                    <span aria-hidden="true" className="material-icons text-xl">{pausado ? "play_arrow" : "pause"}</span>
                    {pausado ? "Seguir pasando los trabajos" : "Pausar los trabajos"}
                </button>
            )}

            <div
                className={`relative grid gap-3 sm:gap-4 ${celdas > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                // Solo el mouse de verdad: en el celular el toque también dispara "entrar",
                // y al volver con "atrás" el mosaico quedaba frenado sin que nadie lo pausara.
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setMouseEncima(true); }}
                onPointerLeave={(e) => { if (e.pointerType === "mouse") setMouseEncima(false); }}
                onFocus={() => setFocoAdentro(true)}
                onBlur={salirDelFoco}
            >
                {estado.visibles.map((indice, celda) => {
                    const c = casos[indice];
                    const dato = c.stats[0];
                    return (
                        // La key es el caso: al cambiar, la tarjeta nueva entra con su animación.
                        <Link
                            key={c.id}
                            href={c.ruta}
                            className={`group flex flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-neobrutalism transition-shadow hover:shadow-neobrutalism-lg ${celda === estado.cambiada ? "animate-[visor-entra_0.45s_cubic-bezier(0.05,0.7,0.1,1)]" : ""}`}
                        >
                            <span className="relative block aspect-[4/3] border-b-2 border-black bg-background-light">
                                {/* El título del enlace ya nombra el caso: con alt el lector lo repetía. */}
                                <Image
                                    src={c.imagen}
                                    alt=""
                                    fill
                                    priority={celda === 0 && estado.turno === 0}
                                    sizes={SIZES}
                                    className="object-cover object-top"
                                />
                                {/* En celular la tarjeta mide ~165px: una métrica larga ("+9 escritos
                                    publicados") ocupaba dos renglones y tapaba la captura. Ahí van
                                    solo las cortas (la de RAGO entra); en pantallas más anchas, todas. */}
                                {dato && (
                                    <span className={`absolute bottom-1.5 left-1.5 items-baseline gap-1 whitespace-nowrap rounded-md border-2 border-black bg-accent-yellow px-1.5 py-0.5 ${(dato.value + dato.label).length <= 16 ? "inline-flex" : "hidden sm:inline-flex"}`}>
                                        <span className="text-xs font-black tabular-nums text-ink-black">{dato.value}</span>
                                        <span className="etiqueta text-ink-black/80">{dato.label}</span>
                                    </span>
                                )}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-2 sm:px-3">
                                {c.rubro && <span className="etiqueta truncate text-ink-black/70">{c.rubro}</span>}
                                <span className="line-clamp-2 text-sm font-bold leading-tight text-ink-black group-hover:text-primary sm:text-base">{c.titulo}</span>
                            </span>
                        </Link>
                    );
                })}

                {/* Dentro de una caja posicionada: `.sello` fija position: relative fuera de
                    capa y le gana a la utilidad `absolute`. */}
                <span className="absolute -bottom-4 right-3 z-10">
                    <span className="sello sello-derecha bg-primary text-white text-xs shadow-neobrutalism-sm">Hecho por Logika</span>
                </span>
            </div>

            {/* La imagen que entra en el próximo cambio se baja antes, para que no aparezca
                la tarjeta vacía. Una sola a la vez: no se bajan las 6 de entrada. */}
            {rota && proximo && (
                <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0">
                    <Image src={proximo.imagen} alt="" fill sizes={SIZES} />
                </span>
            )}
        </figure>
    );
}
