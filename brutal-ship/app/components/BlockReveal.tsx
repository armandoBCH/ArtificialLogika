"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BlockRevealProps {
    children: ReactNode;
    bgColor?: string;
    delay?: number;
}

export default function BlockReveal({ children, bgColor = "bg-primary", delay = 0 }: BlockRevealProps) {
    return (
        <div className="relative overflow-hidden w-full h-full">
            {children}
            <motion.div
                className={`absolute top-0 bottom-0 left-0 w-full z-20 ${bgColor} border-r-2 border-black`}
                initial={{ x: 0 }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1], delay }}
                viewport={{ once: true, margin: "-50px" }}
            />
        </div>
    );
}
