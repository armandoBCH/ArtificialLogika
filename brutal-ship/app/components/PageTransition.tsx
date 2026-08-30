"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";

/**
 * `MotionConfig reducedMotion="user"` es la única forma de que framer-motion respete
 * `prefers-reduced-motion`. El bloque de globals.css solo alcanza a las animaciones CSS;
 * las ~90 animaciones de framer-motion del sitio son transforms inline y lo ignoraban.
 */
export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </MotionConfig>
    );
}
