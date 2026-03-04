"use client";

import { motion, Variants } from "framer-motion";
import type { PricingPlan, PricingFeature } from "@/lib/types/database";
import type { SiteConfigMap } from "@/lib/types/database";

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
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15
        }
    }
};

interface PricingSectionProps {
    plans: PricingPlan[];
    config: SiteConfigMap;
}

function FeatureItem({ feature }: { feature: PricingFeature }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 ${feature.icon_bg} border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center flex-shrink-0 ${feature.icon_bg === 'bg-hot-coral' ? 'text-white' : ''}`}>
                <span className="material-icons text-sm font-black">{feature.icon}</span>
            </div>
            <span className={feature.is_highlighted ? "font-bold underline decoration-hot-coral decoration-2 underline-offset-2" : "font-medium"}>
                {feature.text}
            </span>
        </div>
    );
}

function PlanCard({ plan }: { plan: PricingPlan }) {
    const isFeatured = plan.is_featured;

    return (
        <motion.div
            variants={itemVariants}
            className={`bg-white dark:bg-zinc-900 border-2 ${isFeatured ? 'border-primary' : 'border-black'} rounded-xl ${isFeatured ? 'shadow-neobrutalism-lg' : 'shadow-neobrutalism'} overflow-hidden ${isFeatured ? 'transform md:-translate-y-4 relative' : ''}`}
        >
            {isFeatured && plan.featured_label && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-secondary-coral text-white text-xs font-bold px-4 py-1.5 border-2 border-black rounded-full shadow-neobrutalism-sm uppercase tracking-wider whitespace-nowrap z-10 -rotate-2 animate-pulse hover:animate-none">
                    {plan.featured_label}
                </div>
            )}
            <div className={`${plan.header_bg} p-5 ${isFeatured ? 'pt-10' : ''} border-b-2 border-black`}>
                <h3 className="text-white text-2xl font-bold uppercase mt-1">{plan.name}</h3>
                <p className={`${isFeatured ? 'text-white/80' : 'text-white/70'} font-medium mt-1 text-sm`}>{plan.subtitle}</p>
            </div>
            <div className="p-6">
                {plan.original_price && (
                    <div className="flex items-end justify-center gap-1 mb-1">
                        <span className="text-xl font-bold text-gray-400 line-through">${plan.original_price}</span>
                    </div>
                )}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 mb-3 mt-2 flex-wrap lg:flex-nowrap">
                    <div className="flex items-end gap-0.5 sm:gap-1">
                        <span className="text-4xl lg:text-5xl font-bold">${plan.price}</span>
                        <span className="text-base lg:text-lg font-bold text-gray-500 mb-1">{plan.currency}</span>
                    </div>
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-hot-coral text-white font-black text-lg lg:text-xl border-[2px] border-black rounded-full shadow-[2px_2px_0px_#000] rotate-12 relative z-10">
                        +
                    </span>
                    <span className={`inline-flex items-center gap-1 border-[2px] border-black px-2 lg:px-3 py-1 rounded-md text-[9px] lg:text-xs font-black uppercase tracking-widest ${isFeatured ? 'bg-accent-yellow text-black shadow-[3px_3px_0px_#1A1A1A] -rotate-1 hover:rotate-0' : 'bg-primary text-white shadow-[3px_3px_0px_#1A1A1A] rotate-1 hover:rotate-0'} transition-transform whitespace-nowrap`}>
                        <span className={`material-icons text-[14px] lg:text-[16px] ${isFeatured ? 'text-[#059669]' : 'text-accent-yellow'}`}>bolt</span>
                        Soporte Mensual
                    </span>
                </div>
                <div className="flex justify-center mb-1">
                    <div className={`inline-flex items-center gap-1.5 ${isFeatured ? 'bg-hot-coral/20 border-2 border-hot-coral text-hot-coral shadow-[2px_2px_0px_#E11D48] animate-pulse' : 'bg-mint/20 border-2 border-mint text-mint shadow-[2px_2px_0px_#059669]'} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest`}>
                        <svg className="w-3.5 h-3.5 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
                        </svg>
                        {plan.payment_type}
                    </div>
                </div>
                {plan.price_note && (
                    <p className="text-xs text-gray-500 font-medium mb-6 text-center">{plan.price_note}</p>
                )}
                {!plan.price_note && <div className="mb-4" />}
                <div className="space-y-3 mb-6 text-left">
                    {plan.features.map((feature, i) => (
                        <FeatureItem key={i} feature={feature} />
                    ))}
                </div>
                {plan.cta_style === "primary" ? (
                    <a href="#contacto" className="block w-full bg-accent-yellow text-black font-black py-3 text-base border-2 border-black shadow-[4px_4px_0px_0px_#8523e1] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-lg uppercase tracking-wide text-center animate-ring-pulse hover:animate-none">
                        {plan.cta_text}
                    </a>
                ) : (
                    <a href="#contacto" className="block w-full bg-white text-black font-bold py-3 text-base border-2 border-black shadow-[3px_3px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-lg uppercase tracking-wide text-center">
                        {plan.cta_text}
                    </a>
                )}
            </div>
        </motion.div>
    );
}

export default function PricingSection({ plans, config }: PricingSectionProps) {
    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola, tengo dudas sobre los planes web")}`;

    return (
        <section id="precios" className="py-24 bg-accent-yellow border-b-2 border-black relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-10 left-10 text-9xl opacity-10 font-bold rotate-12 pointer-events-none">✦</div>
            <div className="absolute bottom-10 right-10 text-9xl opacity-10 font-bold -rotate-12 pointer-events-none">✦</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="text-5xl font-bold uppercase tracking-tighter mb-4">Precios Claros</h2>
                    <p className="text-xl font-medium mb-12 max-w-xl mx-auto">Sin sorpresas, sin letra chica. Sabés exactamente lo que recibís y cuánto cuesta.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl lg:max-w-[85rem] mx-auto items-start relative z-10"
                >
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </motion.div>

                {/* Monthly Fee Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mt-20 max-w-5xl mx-auto w-full px-4 sm:px-0 relative z-10"
                >
                    <div className="bg-white border-[3px] border-black shadow-neobrutalism-lg overflow-hidden flex flex-col lg:flex-row rounded-xl relative">
                        <div className="absolute top-0 right-0 bg-hot-coral text-white text-xs sm:text-sm font-black px-4 py-1.5 sm:px-5 sm:py-2 border-b-[3px] border-l-[3px] border-black rounded-bl-xl shadow-[-2px_2px_0px_#000] uppercase tracking-widest z-20">
                            Imprescindible
                        </div>
                        <div className="bg-primary p-6 md:p-10 lg:p-12 lg:w-3/5 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black flex flex-col justify-center relative">
                            {/* Decorative element hidden on mobile */}
                            <div className="absolute -left-4 -top-4 w-12 h-12 bg-accent-yellow border-[3px] border-black rounded-full shadow-[4px_4px_0px_#000] z-20 hidden sm:block"></div>

                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 sm:mb-5 text-white relative z-10 leading-none mt-2 sm:mt-0">
                                ¿Por qué hay un<br />
                                <span className="bg-accent-yellow text-black px-2 mt-2 inline-block -rotate-2 border-[3px] border-black shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000]">pago mensual?</span>
                            </h3>
                            <p className="text-lg sm:text-xl font-bold mb-6 text-white/90 relative z-10">
                                Tu web es un ecosistema vivo. Nosotros nos hacemos cargo de la parte técnica para que funcione rapidísima y segura las 24 horas.
                            </p>

                            <div className="bg-white/10 p-4 sm:p-5 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] relative z-10">
                                <p className="font-extrabold uppercase text-xs sm:text-sm mb-4 text-white border-b-2 border-white/20 pb-2">Todo esto está incluido:</p>
                                <div className="space-y-3">
                                    {[
                                        "Hosting en servidores ultrarrápidos",
                                        "Dominio web anual (www.tu-marca.com)",
                                        "Base de datos y almacenamiento en la nube",
                                        "Certificado de Seguridad SSL (candado HTTPS)",
                                        "Backups automáticos periódicos",
                                        "Actualizaciones y mantenimiento continuo",
                                        "Soporte directo por WhatsApp"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 bg-mint border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-black text-[12px] sm:text-[14px] font-black leading-none">check</span>
                                            </div>
                                            <span className="font-bold text-white text-sm sm:text-base md:text-lg leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#F5F5F5] p-6 md:p-10 lg:p-12 lg:w-2/5 flex flex-col justify-center relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                            <h4 className="text-xl sm:text-2xl font-black uppercase mb-6 sm:mb-8 text-center decoration-wavy underline decoration-hot-coral decoration-2 underline-offset-4 relative z-10 bg-white inline-block px-3 py-1 sm:px-4 sm:py-2 border-2 border-black -rotate-1 shadow-[4px_4px_0px_#000] mx-auto leading-tight">
                                Valores Mensuales<br />
                                <span className="text-[10px] sm:text-xs tracking-wide bg-black text-white px-2 py-0.5 mt-2 inline-block rotate-1 rounded-sm border border-black shadow-[2px_2px_0px_#8523E1]">DE SOPORTE Y MANTENIMIENTO</span>
                            </h4>
                            <div className="space-y-4 sm:space-y-5 relative z-10">
                                <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#059669] sm:shadow-[6px_6px_0px_0px_#059669] p-4 sm:p-5 rounded-xl flex flex-col justify-between transform transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#059669] sm:hover:shadow-[8px_8px_0px_0px_#059669]">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-bold text-sm sm:text-base md:text-lg uppercase w-1/2">Landing Page</span>
                                        <div className="flex items-end text-black relative bg-[#f4f4f5] px-2 sm:px-3 py-1 border-[2px] border-black rounded-lg shadow-sm">
                                            <span className="font-black text-xl sm:text-2xl md:text-3xl">$15</span>
                                            <span className="font-bold text-gray-500 mb-0.5 sm:mb-1 ml-1 text-[10px] sm:text-xs md:text-sm">/mes</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#E11D48] sm:shadow-[6px_6px_0px_0px_#E11D48] p-4 sm:p-5 rounded-xl flex flex-col justify-between transform transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#E11D48] sm:hover:shadow-[8px_8px_0px_0px_#E11D48]">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-bold text-sm sm:text-base md:text-lg uppercase w-1/2">Institucional</span>
                                        <div className="flex items-end text-black relative bg-[#f4f4f5] px-2 sm:px-3 py-1 border-[2px] border-black rounded-lg shadow-sm">
                                            <span className="font-black text-xl sm:text-2xl md:text-3xl">$25</span>
                                            <span className="font-bold text-gray-500 mb-0.5 sm:mb-1 ml-1 text-[10px] sm:text-xs md:text-sm">/mes</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#8523e1] sm:shadow-[6px_6px_0px_0px_#8523e1] p-4 sm:p-5 rounded-xl flex flex-col justify-between transform transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#8523e1] sm:hover:shadow-[8px_8px_0px_0px_#8523e1] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-accent-yellow text-black text-[9px] sm:text-[10px] font-black px-2 py-0.5 border-b-[2px] border-l-[2px] border-black shadow-[-2px_2px_0px_#000] rounded-bl-lg z-10 uppercase tracking-wider">
                                        Precio Base
                                    </div>
                                    <div className="flex justify-between items-center w-full mt-2">
                                        <span className="font-bold text-sm sm:text-base md:text-lg uppercase w-1/2">E-commerce</span>
                                        <div className="flex items-end text-black relative bg-[#f4f4f5] px-2 sm:px-3 py-1 border-[2px] border-black rounded-lg shadow-sm">
                                            <span className="font-black text-xl sm:text-2xl md:text-3xl">$35</span>
                                            <span className="font-bold text-gray-500 mb-0.5 sm:mb-1 ml-1 text-[10px] sm:text-xs md:text-sm">/mes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-10 flex w-full relative z-10">
                                <div className="flex-1 items-center justify-center gap-2 sm:gap-3 bg-hot-coral border-[3px] border-black px-4 py-3 sm:py-4 rounded-xl shadow-[4px_4px_0px_#000] flex flex-row hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-transform cursor-default">
                                    <span className="material-icons text-white text-xl sm:text-2xl font-black">lock_open</span>
                                    <p className="text-[11px] sm:text-sm md:text-base font-black text-white uppercase tracking-wider text-center">¡Sin ataduras! Cancelá cuando quieras.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Trust signals & Guarantee */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 flex flex-col items-center gap-4 relative z-10 w-full px-4"
                >
                    <div className="bg-white px-6 sm:px-8 py-3 sm:py-4 border-2 border-black shadow-[4px_4px_0px_#000] text-center w-full max-w-2xl transform rotate-1 hover:rotate-0 transition-transform cursor-default">
                        <p className="font-black text-sm sm:text-base uppercase tracking-wider text-black">
                            ⚠️ El precio del plan E-commerce es base y puede variar según tu proyecto
                        </p>
                    </div>
                    <div className="bg-[#00f090] px-6 sm:px-8 py-4 sm:py-5 border-2 border-black shadow-[4px_4px_0px_#000] text-center w-full max-w-3xl transform -rotate-1 hover:rotate-0 transition-transform flex flex-col sm:flex-row items-center justify-center gap-3 cursor-default">
                        <span className="material-icons text-black text-3xl">verified</span>
                        <p className="font-extrabold text-base sm:text-lg text-black leading-snug">
                            50% de seña para arrancar — garantía total si no te convence el diseño inicial.
                        </p>
                    </div>
                </motion.div>

                {/* CTA Banner */}
                <div className="mt-16 w-full bg-primary border-2 border-black rounded-lg shadow-neobrutalism p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase">
                            ¿Tenés dudas sobre cuál elegir?
                        </h3>
                        <p className="text-white/90 font-medium text-lg max-w-xl">
                            Escribinos por WhatsApp y te asesoramos gratis y sin compromiso para que tomes la mejor decisión.
                        </p>
                    </div>
                    <div className="relative z-10 w-full md:w-auto mt-4 md:mt-0">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex justify-center px-8 py-4 bg-[#25D366] text-white font-bold text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:translate-y-0 active:shadow-none transition-all items-center gap-3 group uppercase tracking-wide whitespace-nowrap">
                            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            <span>Escribinos</span>
                        </a>
                    </div>
                </div>
            </div >
        </section >
    );
}
