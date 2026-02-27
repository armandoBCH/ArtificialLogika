"use client";

import { motion } from "framer-motion";

export default function OldWebsiteSection() {
    return (
        <section className="py-24 bg-[#E8F5E9] border-y-2 border-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-mint rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-accent-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 bg-hot-coral text-white font-bold px-4 py-2 border-2 border-black rounded-full shadow-[2px_2px_0px_#000] mb-6 uppercase tracking-wider text-sm">
                            <span className="material-icons text-sm">handyman</span>
                            Rediseño Web
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-6 leading-[1.05]">
                            ¿Tu web parece sacada del 2005?
                        </h2>
                        <p className="text-xl font-medium text-gray-800 mb-8 max-w-lg border-l-4 border-black pl-4">
                            Una web lenta, fea o que se ve mal en celular hace que tus clientes desconfíen y compren en otro lado. Dejá de perder ventas.
                        </p>

                        <div className="space-y-4 mb-10 w-full max-w-md">
                            <div className="flex items-start gap-4 p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#E11D48] transform transition-transform hover:-translate-y-1">
                                <div className="w-10 h-10 bg-hot-coral rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons text-white">hourglass_empty</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-none mb-1">Carga Lenta</h4>
                                    <p className="text-gray-600 font-medium text-sm leading-snug">Si tarda más de 3 segundos, ya perdiste a la mitad de tus visitas.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#fffb00] transform transition-transform hover:-translate-y-1">
                                <div className="w-10 h-10 bg-accent-yellow rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons text-black">smartphone</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-none mb-1">No Adaptable</h4>
                                    <p className="text-gray-600 font-medium text-sm leading-snug">El 80% entra por celular. Si hay que hacer zoom, olvidate que te contacten.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#757575] transform transition-transform hover:-translate-y-1">
                                <div className="w-10 h-10 bg-gray-300 rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons text-black">design_services</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-none mb-1">Poco Profesional</h4>
                                    <p className="text-gray-600 font-medium text-sm leading-snug">Un diseño anticuado transmite desconfianza y hace ver a tu negocio poco serio.</p>
                                </div>
                            </div>
                        </div>

                        <a href="#contacto" className="inline-flex items-center gap-3 bg-primary text-white font-bold text-lg px-8 py-4 border-2 border-black rounded-lg shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-y-[2px] hover:translate-x-[2px] transition-all uppercase">
                            Renová Tu Web Ahora <span className="material-icons">arrow_forward</span>
                        </a>
                    </motion.div>

                    {/* Right Visuals */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        {/* Decorative background blocks */}
                        <div className="absolute inset-0 bg-primary rounded-3xl border-2 border-black transform rotate-6 translate-x-4 translate-y-4"></div>
                        <div className="absolute inset-0 bg-hot-coral rounded-3xl border-2 border-black transform -rotate-3 -translate-x-2 -translate-y-2"></div>

                        <div className="relative bg-white border-2 border-black rounded-3xl p-8 shadow-neobrutalism flex flex-col items-center justify-center text-center">

                            <div className="bg-ink-black text-white p-6 sm:p-8 rounded-2xl w-full border-2 border-black shadow-[4px_4px_0px_#00f090]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-black text-2xl text-mint tracking-tighter">L.</span>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black uppercase mb-3 text-center leading-tight">La Solución <br /><span className="text-accent-yellow">Logika</span></h3>
                                <p className="text-gray-400 font-medium text-sm text-center mb-6">Rediseñamos tu web desde cero con las mejores prácticas actuales.</p>

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="w-10 h-10 bg-mint text-black border-2 border-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
                                            <span className="material-icons font-black">bolt</span>
                                        </div>
                                        <span className="font-bold text-lg">Optimización Extrema</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="w-10 h-10 bg-mint text-black border-2 border-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
                                            <span className="material-icons font-black">brush</span>
                                        </div>
                                        <span className="font-bold text-lg">Diseño Moderno UX/UI</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="w-10 h-10 bg-mint text-black border-2 border-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
                                            <span className="material-icons font-black">smartphone</span>
                                        </div>
                                        <span className="font-bold text-lg">100% Celular-First</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
