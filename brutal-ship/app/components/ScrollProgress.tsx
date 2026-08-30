"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * El único elemento que cruza las once secciones.
 *
 * La página es una pila de bloques que empiezan y terminan en seco; esta barra es
 * lo que las cose. Por eso lleva el grosor y el filete negro del sistema en vez de
 * ser una línea fina genérica: tiene que leerse como parte del mismo material que
 * los bordes de las tarjetas, no como un indicador pegado encima.
 *
 * El `useSpring` importa: con `scrollYProgress` crudo la barra tiembla en cada
 * pulso de la rueda. Amortiguada, avanza como un objeto con peso — que es la única
 * física que este sistema visual acepta.
 */
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const avance = useSpring(scrollYProgress, {
        stiffness: 180,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 h-1.5 bg-primary border-b-2 border-black origin-left z-[100] pointer-events-none"
            style={{ scaleX: avance }}
        />
    );
}
