"use client";

import { useEffect } from "react";

/**
 * Dispara las animaciones de la home cuando cada parte entra en pantalla
 * (globals.css, "ANIMA AL VER"). Desde 2026-11-21, por pedido del dueño, el
 * movimiento de las secciones pasa con el reloj y no atado al scroll: atado al
 * scroll, si alguien bajaba rápido la escena ya estaba terminada y no se veía
 * moverse.
 *
 * Cómo funciona: marca <html> con `anima-lista`; con esa clase, las animaciones
 * quedan en pausa en su primer cuadro. Cuando un `[data-anima]` o un marcador
 * entra en pantalla, recibe `data-visto` y su animación corre UNA vez.
 *
 * Las escenas de "Más que una web" (`data-anima="escena"`) van EN FILA: en
 * compu se ven las tres juntas y, si arrancaban a la vez, no se entendía
 * ninguna (dueño, 2026-11-21). Cada una espera a que termine la anterior;
 * `data-dura` dice cuánto dura en ms. En celular se ven de a una y la fila casi
 * nunca hace esperar. Cada escena dura menos de 5 s (WCAG 2.2.2) y se detiene sola.
 *
 * Sin JavaScript, sin IntersectionObserver o con "reducir movimiento" no se
 * agrega la clase y todo queda en su estado final, que es el estilo base.
 */
export default function AnimaAlVer() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!("IntersectionObserver" in window)) return;

        document.documentElement.classList.add("anima-lista");
        const esperas: number[] = [];
        let filaLibre = 0; // momento en que termina la última escena en fila

        const ver = (el: Element) => el.setAttribute("data-visto", "");
        const observador = new IntersectionObserver(
            (entradas) => {
                // En el orden de la página: la escena de la izquierda va primero.
                const visibles = entradas
                    .filter((e) => e.isIntersecting)
                    .map((e) => e.target)
                    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
                for (const el of visibles) {
                    observador.unobserve(el);
                    if (el.getAttribute("data-anima") !== "escena") {
                        ver(el);
                        continue;
                    }
                    const ahora = performance.now();
                    const inicio = Math.max(ahora, filaLibre);
                    filaLibre = inicio + Number((el as HTMLElement).dataset.dura ?? 2500) + 300;
                    if (inicio === ahora) ver(el);
                    else esperas.push(window.setTimeout(() => ver(el), inicio - ahora));
                }
            },
            { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
        );
        document.querySelectorAll("[data-anima], .marcador:not(.marcador-entra)").forEach((el) => observador.observe(el));

        return () => {
            observador.disconnect();
            esperas.forEach((t) => window.clearTimeout(t));
            document.documentElement.classList.remove("anima-lista");
        };
    }, []);

    return null;
}
