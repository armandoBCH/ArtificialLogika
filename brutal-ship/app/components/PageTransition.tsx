"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * `MotionConfig reducedMotion="user"` es la única forma de que framer-motion respete
 * `prefers-reduced-motion`. El bloque de globals.css solo alcanza a las animaciones CSS;
 * las ~90 animaciones de framer-motion del sitio son transforms inline y lo ignoraban.
 *
 * `LazyMotion` + `m` (en vez de `motion`) deja afuera las funciones que el sitio no usa
 * (drag, layout): ~20 KB menos. `domAnimation` alcanza para hover, tap, inView y exit.
 * Antes había un `motion.div` con `initial={false} animate={{opacity: 1}}` que no
 * animaba nada; se fue con su `AnimatePresence`.
 */
export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MotionConfig reducedMotion="user">
            <LazyMotion features={domAnimation}>{children}</LazyMotion>
        </MotionConfig>
    );
}
