"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * La lista de "Y así se ven en el celular". En celular siempre se desliza de costado.
 * En computadora: hasta 6 webs, grilla quieta; con más, sigue deslizándose y suma dos
 * flechas que corren una pantalla de teléfonos por vez (sin animar si el sistema pide
 * menos movimiento).
 *
 * Es una zona con scroll: lleva tabIndex y nombre para que se pueda mover con el teclado.
 * El pt-2 es aire para el teléfono que se levanta al pasar el mouse: la zona con scroll
 * también recorta arriba.
 */
export default function CarruselCelular({ carrusel, etiqueta, children }: { carrusel: boolean; etiqueta: string; children: ReactNode }) {
    const lista = useRef<HTMLUListElement>(null);
    const [enInicio, setEnInicio] = useState(true);
    const [enFin, setEnFin] = useState(false);

    const medir = useCallback(() => {
        const ul = lista.current;
        if (!ul) return;
        setEnInicio(ul.scrollLeft <= 4);
        setEnFin(ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4);
    }, []);

    useEffect(() => {
        if (!carrusel) return;
        medir();
        window.addEventListener("resize", medir);
        return () => window.removeEventListener("resize", medir);
    }, [carrusel, medir]);

    const mover = (sentido: 1 | -1) => {
        const ul = lista.current;
        if (!ul || (sentido === -1 ? enInicio : enFin)) return;
        const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        ul.scrollBy({ left: sentido * ul.clientWidth, behavior: suave ? "smooth" : "auto" });
    };

    // aria-disabled y no disabled: un botón deshabilitado pierde el foco y el teclado
    // quedaba en el body al llegar a una punta.
    const flecha = "inline-flex size-11 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-neobrutalism-white transition-all hover:bg-accent-yellow hover:text-ink-black aria-disabled:cursor-not-allowed aria-disabled:opacity-30 aria-disabled:hover:bg-black aria-disabled:hover:text-white";

    return (
        <div>
            {carrusel && (
                <div className="mt-4 hidden justify-end gap-3 lg:flex">
                    <button type="button" className={flecha} onClick={() => mover(-1)} aria-disabled={enInicio} aria-label="Ver los anteriores">
                        <span aria-hidden="true" className="material-icons">chevron_left</span>
                    </button>
                    <button type="button" className={flecha} onClick={() => mover(1)} aria-disabled={enFin} aria-label="Ver los siguientes">
                        <span aria-hidden="true" className="material-icons">chevron_right</span>
                    </button>
                </div>
            )}
            <ul
                ref={lista}
                role="list"
                tabIndex={0}
                aria-label={etiqueta}
                onScroll={carrusel ? medir : undefined}
                className={`-mx-4 mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pt-2 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-6 lg:px-0 ${carrusel ? "lg:-mx-2 lg:scroll-px-2 lg:px-2" : "lg:grid lg:grid-cols-6 lg:overflow-visible"}`}
            >
                {children}
            </ul>
        </div>
    );
}
