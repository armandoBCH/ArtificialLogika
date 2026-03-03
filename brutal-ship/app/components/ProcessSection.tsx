"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 15
        }
    }
};

export default function ProcessSection() {
    return (
        <section id="proceso" className="relative py-24 px-6 md:px-12 lg:px-20 min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Floating Geometric Shapes */}
            <div className="shape-float top-10 left-10 w-24 h-24 rounded-full border-2 border-primary/30"></div>
            <div className="shape-float bottom-20 right-10 w-32 h-32 rounded-full bg-accent-mint/10 border-2 border-accent-mint/30"></div>
            <div className="shape-float top-1/4 right-1/4 w-16 h-16 transform rotate-45 border-2 border-accent-coral/30"></div>
            <div className="shape-float bottom-1/3 left-12 w-20 h-20 rounded-xl bg-accent-blue/10 border-2 border-accent-blue/30 rotate-12"></div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10 text-center mb-20 max-w-4xl mx-auto"
            >
                <span className="inline-block py-1 px-3 mb-4 rounded-full border-2 border-primary bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider">
                    Así de Simple
                </span>
                <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-ink-black dark:text-white">
                    ¿Cómo Funciona?
                </h2>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    En 4 pasos simples tenés tu web lista. Vos nos contás qué necesitás y nosotros hacemos todo el trabajo pesado.
                </p>
            </motion.div>

            {/* Timeline Container */}
            <div className="relative w-full max-w-7xl mx-auto z-10">
                {/* Desktop Connector Line (Animated SVG) */}
                <svg className="hidden lg:block absolute top-12 left-0 w-full h-2 z-0 pointer-events-none transform translate-y-4" preserveAspectRatio="none">
                    <motion.line
                        x1="5%"
                        y1="4"
                        x2="95%"
                        y2="4"
                        stroke="currentColor"
                        className="text-gray-300 dark:text-gray-600"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        initial={{ pathLength: 0, strokeDashoffset: 0 }}
                        whileInView={{ pathLength: 1 }}
                        animate={{ strokeDashoffset: [0, -32] }}
                        transition={{
                            pathLength: { duration: 1.5, ease: "easeOut" },
                            strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1 }
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                    />
                </svg>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
                >
                    {/* Card 01 */}
                    <motion.div variants={itemVariants} className="card-neo bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-start h-full group">
                        <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white border-2 border-ink-black shadow-[2px_2px_0px_0px_#121212]">
                            <span className="text-xl font-bold">01</span>
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3 text-ink-black dark:text-white leading-tight">Contanos Tu Idea</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Nos escribís por WhatsApp o completás el formulario. Nos contás sobre tu negocio y qué querés lograr con tu web.
                        </p>
                        <div className="mt-auto pt-4 flex w-full justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-icons text-primary transform rotate-45 text-2xl">arrow_upward</span>
                        </div>
                    </motion.div>

                    {/* Card 02 */}
                    <motion.div variants={itemVariants} className="card-neo bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-start h-full group">
                        <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-accent-mint text-ink-black border-2 border-ink-black shadow-[2px_2px_0px_0px_#121212]">
                            <span className="text-xl font-bold">02</span>
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3 text-ink-black dark:text-white leading-tight">Te Mostramos el Diseño</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Creamos un boceto visual de tu web. Lo revisás, nos decís qué cambiar y lo ajustamos hasta que te encante.
                        </p>
                        <div className="mt-auto pt-4 flex w-full justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-icons text-accent-mint transform rotate-45 text-2xl">arrow_upward</span>
                        </div>
                    </motion.div>

                    {/* Card 03 */}
                    <motion.div variants={itemVariants} className="card-neo bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-start h-full group">
                        <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-accent-coral text-ink-black border-2 border-ink-black shadow-[2px_2px_0px_0px_#121212]">
                            <span className="text-xl font-bold">03</span>
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3 text-ink-black dark:text-white leading-tight">Nosotros la Armamos</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Desarrollamos tu web completa. Vos seguís con tu negocio tranquilo mientras nosotros trabajamos.
                        </p>
                        <div className="mt-auto pt-4 flex w-full justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-icons text-accent-coral transform rotate-45 text-2xl">arrow_upward</span>
                        </div>
                    </motion.div>

                    {/* Card 04 */}
                    <motion.div variants={itemVariants} className="card-neo bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-start h-full group">
                        <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-accent-blue text-ink-black border-2 border-ink-black shadow-[2px_2px_0px_0px_#121212]">
                            <span className="text-xl font-bold">04</span>
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3 text-ink-black dark:text-white leading-tight">¡Tu Web Online!</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Publicamos tu sitio, configuramos dominio y todo lo técnico. Te enseñamos a usarlo y listo — ¡a recibir clientes!
                        </p>
                        <div className="mt-auto pt-4 flex w-full justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-icons text-accent-blue transform rotate-45 text-2xl">arrow_upward</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
            {/* Trust Badges */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4 }}
                className="mt-20 flex flex-wrap justify-center gap-6 relative z-10"
            >
                <div className="pill-neo bg-white dark:bg-gray-800 px-6 py-3 rounded-full flex items-center space-x-3 border-2 border-primary hover:bg-primary/5 transition-colors cursor-default">
                    <span className="material-icons text-primary">bolt</span>
                    <span className="font-bold text-ink-black dark:text-white">Entrega en 1-2 Semanas</span>
                </div>
                <div className="pill-neo bg-white dark:bg-gray-800 px-6 py-3 rounded-full flex items-center space-x-3 border-2 border-ink-black hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-default">
                    <span className="material-icons text-gray-700 dark:text-gray-300">support_agent</span>
                    <span className="font-bold text-ink-black dark:text-white">Soporte Post-Entrega</span>
                </div>
                <div className="pill-neo bg-white dark:bg-gray-800 px-6 py-3 rounded-full flex items-center space-x-3 border-2 border-ink-black hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-default">
                    <span className="material-icons text-gray-700 dark:text-gray-300">credit_card</span>
                    <span className="font-bold text-ink-black dark:text-white">Pago Flexible</span>
                </div>
            </motion.div>
            {/* Decorative Bottom Bar */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent-mint to-accent-blue opacity-50"></div>
        </section>
    );
}
