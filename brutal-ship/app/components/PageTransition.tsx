"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
