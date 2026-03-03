"use client";

import { motion, Variants } from "framer-motion";
import type { Service } from "@/lib/types/database";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20 }
    }
};

interface ServicesSectionProps {
    services: Service[];
}

/* "Who is this for?" micro-copy per service type */
const serviceTargetMap: Record<string, string> = {
    "Landing Page": "Emprendedores, freelancers y negocios locales que quieren empezar a recibir clientes.",
    "Sitio Institucional": "Empresas con múltiples servicios que necesitan presencia profesional y SEO.",
    "E-commerce / Plataforma": "Negocios que necesitan vender, gestionar turnos o administrar productos online.",
};

const fallbackTarget = "Para dar el salto al mundo digital y atraer más clientes.";

function ServiceRow({ service, index }: { service: Service; index: number }) {
    // Colors
    const bgColors = ["bg-mint", "bg-accent-yellow", "bg-purple-300", "bg-blue-300"];
    const accentBg = bgColors[index % bgColors.length];
    const badgeShadows = ["#059669", "#d97706", "#9333ea", "#2563eb"];
    const badgeColor = badgeShadows[index % badgeShadows.length];

    const targetText = serviceTargetMap[service.name] || fallbackTarget;

    return (
        <motion.div
            variants={itemVariants}
            className="group flex flex-col md:flex-row border-4 border-black rounded-xl overflow-hidden mb-8 bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#000] transition-all relative"
        >
            {/* Left Box (Title & Icon only) */}
            <div className={`md:w-1/3 p-6 ${accentBg} border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center relative overflow-hidden shrink-0`}>
                <div className="absolute -bottom-4 -left-4 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 pointer-events-none">
                    <span className="material-icons text-black" style={{ fontSize: "12rem", lineHeight: "1" }}>{service.icon}</span>
                </div>

                <div className="relative z-10 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3">
                    <div className="w-12 h-12 md:w-10 md:h-10 bg-white border-2 border-black shadow-[3px_3px_0_#000] rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-icons text-black text-2xl md:text-xl">{service.icon}</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black leading-none mt-1">
                        {service.name}
                    </h3>
                </div>
            </div>

            {/* Middle (Specs & Target) */}
            <div className="md:w-1/3 p-6 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center relative bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none"></div>
                <div className="relative z-10">
                    <p className="text-base font-bold text-muted-charcoal dark:text-gray-300 leading-snug mb-5">
                        {service.description}
                    </p>
                    <div className="bg-gray-50 dark:bg-zinc-800 border-2 border-black p-4 rounded-lg shadow-neo-sm transform -rotate-1">
                        <p className="text-xs font-black uppercase text-gray-500 mb-1.5 tracking-wider">¿Para quién?</p>
                        <p className="text-base font-bold leading-tight">{targetText}</p>
                    </div>
                </div>
            </div>

            {/* Right Box (Features & CTA) */}
            <div className="md:w-1/3 p-6 flex flex-col justify-center bg-white dark:bg-zinc-900 relative">
                <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.slice(0, 4).map((feature, i) => {
                        const featureText = typeof feature === "string" ? feature : feature.text;
                        return (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 border-2 border-black text-xs font-bold px-2.5 py-1.5 rounded shadow-neo-sm"
                            >
                                <span className="material-icons text-sm" style={{ color: badgeColor }}>check_circle</span>
                                {featureText}
                            </span>
                        );
                    })}
                    {service.features.length > 4 && (
                        <span className="text-xs font-bold text-gray-400 self-center ml-1">+{service.features.length - 4}</span>
                    )}
                </div>

                <a
                    href="#contacto"
                    className="mt-auto flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 font-bold uppercase text-sm border-2 border-black shadow-[3px_3px_0_#FFF] dark:shadow-[3px_3px_0_#zinc-700] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all rounded w-full"
                >
                    Me Interesa
                    <span className="material-icons text-base">arrow_forward</span>
                </a>
            </div>
        </motion.div>
    );
}

export default function ServicesSection({ services }: ServicesSectionProps) {
    return (
        <section id="servicios" className="py-16 bg-background-light dark:bg-background-dark relative overflow-hidden border-b-4 border-black">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mb-10 text-center flex flex-col items-center justify-center"
                >
                    <div className="inline-block relative">
                        <div className="absolute -top-4 -right-4 md:-top-6 md:-right-8 bg-[#00f090] border-2 border-black rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-black uppercase text-[8px] md:text-[9px] text-center transform rotate-12 shadow-[3px_3px_0_#000] z-20 animate-spin-slow">
                            Elegí<br />Bien
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none relative z-10">
                            <span className="bg-black text-white px-4 py-1 rounded inline-block transform -rotate-2 shadow-[6px_6px_0_#000] mb-2 border-4 border-black">Opciones</span> Claras
                        </h2>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-muted-charcoal dark:text-gray-300 max-w-3xl mt-4 border-l-4 border-primary pl-6 text-left mx-auto">
                        Vos elegís el modelo, nosotros nos encargamos del motor y la carrocería.
                    </p>
                </motion.div>

                {/* Grid (Horizontal Compact) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {services.map((service, index) => (
                        <ServiceRow key={service.id} service={service} index={index} />
                    ))}
                </motion.div>

                {/* Final soft block - Compressed */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-8 bg-mint border-4 border-black p-6 md:p-8 shadow-[6px_6px_0_#000] flex flex-col md:flex-row items-center justify-between gap-6 rounded-lg relative overflow-hidden"
                >
                    <div className="absolute -right-4 -top-8 opacity-10 pointer-events-none">
                        <span className="material-icons text-black text-[10rem]">verified</span>
                    </div>

                    <div className="text-center md:text-left relative z-10 flex-1">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
                            Mismos Servicios, Diferentes Planes
                        </h3>
                        <p className="text-base md:text-lg font-bold text-black/80 max-w-xl">
                            ¿Aún con dudas o querés ver números detallados? Compará los planes o pedinos asesoramiento gratuito por WhatsApp.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto shrink-0">
                        <a
                            href="#precios"
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-bold text-base uppercase rounded shadow-[4px_4px_0_#FFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all w-full sm:w-auto text-center"
                        >
                            Ver Precios
                            <span className="material-icons text-xl">payments</span>
                        </a>
                        <a
                            href="#contacto"
                            className="inline-flex items-center justify-center gap-2 bg-white text-black border-4 border-black px-6 py-3 font-black text-base uppercase rounded shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all w-full sm:w-auto text-center"
                        >
                            <span className="material-icons text-xl">chat</span>
                            Consultar
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
