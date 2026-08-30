"use client";

import { useEffect } from "react";

/**
 * Revela los íconos recién cuando la fuente Material Icons está lista.
 *
 * Sin esto, mientras la fuente descarga el navegador dibuja la LIGADURA como texto:
 * "arrow_forward" impreso adentro del botón de compra.
 *
 * Por qué en un efecto y no en el script del <head>: tocar `documentElement.className`
 * antes de que React hidrate produce un mismatch — el HTML del servidor no tiene la
 * clase y el cliente sí. Acá corre después de hidratar, así que no hay discrepancia.
 *
 * Los íconos son decorativos y llevan `aria-hidden`, de modo que si la fuente nunca
 * carga no se pierde información. Con JS deshabilitado los muestra el bloque
 * `@media (scripting: none)` de globals.css.
 */
export default function IconFontGate() {
    useEffect(() => {
        const revelar = () => document.documentElement.classList.add("iconos-listos");

        if (typeof document.fonts?.load === "function") {
            // El timeout evita que un fallo de red los deje ocultos para siempre.
            const timer = setTimeout(revelar, 3000);
            document.fonts
                .load('24px "Material Icons"')
                .then(revelar)
                .catch(revelar)
                .finally(() => clearTimeout(timer));
            return () => clearTimeout(timer);
        }

        revelar();
    }, []);

    return null;
}
