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
            // La familia ya no se llama "Material Icons": next/font/local genera un
            // nombre con hash y lo publica en --font-material-icons. Pedirle a
            // document.fonts una familia que no existe resuelve al instante, y los
            // iconos se revelarian antes de que la fuente este lista.
            //
            // Se lee del <body> y no del <html>: la clase que trae la variable la pone
            // el layout en el body. Desde documentElement esto devuelve "" y el
            // fallback vuelve a pedir una familia inexistente, que es justo el
            // problema que este bloque evita.
            const familia = getComputedStyle(document.body)
                .getPropertyValue("--font-material-icons")
                .trim();

            // El timeout evita que un fallo de red los deje ocultos para siempre.
            const timer = setTimeout(revelar, 3000);
            document.fonts
                .load(`24px ${familia || '"Material Icons"'}`)
                .then(revelar)
                .catch(revelar)
                .finally(() => clearTimeout(timer));
            return () => clearTimeout(timer);
        }

        revelar();
    }, []);

    return null;
}
