"use client";

import { useEffect } from "react";

/**
 * Dispara las animaciones cortas de la home cuando cada parte entra en pantalla
 * (globals.css, "ANIMA AL VER"). Desde 2026-11-21, por pedido del dueño, el
 * movimiento de las secciones pasa con el reloj y no atado al scroll: atado al
 * scroll, si alguien bajaba rápido la escena ya estaba terminada y no se veía
 * moverse.
 *
 * Cómo funciona: marca <html> con `anima-lista`; con esa clase, las animaciones
 * quedan en pausa en su primer cuadro. Cuando un `[data-anima]` o un marcador
 * entra en pantalla, recibe `data-visto` y su animación corre UNA vez (todas
 * duran menos de 2 s, así que no hace falta botón de pausa: WCAG 2.2.2 pide pausa
 * desde los 5 s).
 *
 * Sin JavaScript, sin IntersectionObserver o con "reducir movimiento" no se
 * agrega la clase y todo queda en su estado final, que es el estilo base.
 */
export default function AnimaAlVer() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!("IntersectionObserver" in window)) return;

        document.documentElement.classList.add("anima-lista");
        const observador = new IntersectionObserver(
            (entradas) => {
                for (const e of entradas) {
                    if (!e.isIntersecting) continue;
                    e.target.setAttribute("data-visto", "");
                    observador.unobserve(e.target);
                }
            },
            { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
        );
        document.querySelectorAll("[data-anima], .marcador:not(.marcador-entra)").forEach((el) => observador.observe(el));

        return () => {
            observador.disconnect();
            document.documentElement.classList.remove("anima-lista");
        };
    }, []);

    return null;
}
