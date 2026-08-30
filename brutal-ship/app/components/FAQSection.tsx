"use client";

import { useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import type { FAQ } from "@/lib/types/database";
import type { SiteConfigMap } from "@/lib/types/database";

interface FAQSectionProps {
    faqs: FAQ[];
    config: SiteConfigMap;
}

export default function FAQSection({ faqs, config }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const containerRef = useRef<HTMLElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola! Tengo una consulta sobre sus servicios web")}`;

    const containerVariants = {
        hidden: {},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        },
    };

    return (
        <section id="faq" ref={containerRef} aria-labelledby="faq-heading" className="relative bg-background-light">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-5 z-0 bg-pattern-dots"></div>
            {/* Floating Triangles */}
            <div className="absolute top-20 left-10 w-16 h-16 bg-ink-black opacity-[0.03] triangle-shape rotate-12 z-0"></div>
            <div className="absolute bottom-40 right-20 w-24 h-24 bg-primary opacity-[0.1] triangle-shape -rotate-12 z-0"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-hot-coral opacity-[0.05] triangle-shape rotate-45 z-0"></div>
            <div className="relative z-10 container mx-auto px-4 py-20 max-w-5xl">
                {/* Header */}
                <header className="text-center mb-16 relative">
                    <div className="relative inline-block">
                        <div className="absolute -top-4 -left-8 w-24 h-24 bg-hot-coral rounded-full opacity-80 mix-blend-multiply z-0"></div>
                        <h2 id="faq-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] relative z-10 text-ink-black">
                            Preguntas<br />Frecuentes
                        </h2>
                    </div>
                    <p className="mt-6 text-xl text-ink-black/70 max-w-2xl mx-auto font-medium">
                        Todo lo que necesitás saber antes de arrancar. Sin letra chica, sin sorpresas.
                    </p>
                </header>
                {/* FAQ List */}
                <motion.div
                    className="space-y-6 max-w-3xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {faqs.map((item, index) => {
                        const isOpen = openIndex === index;
                        const hasAnswer = item.answer.length > 0;
                        return (
                            <motion.article
                                variants={itemVariants}
                                key={item.id}
                                className={`group bg-white rounded-xl transition-all ${isOpen
                                    ? "border-4 border-black shadow-neobrutalism-lg"
                                    : "border-2 border-black shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px]"
                                    }`}
                            >
                                <div className="p-6">
                                    <h3>
                                        <button
                                            type="button"
                                            id={`faq-trigger-${item.id}`}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-panel-${item.id}`}
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                            className={`w-full flex min-h-11 justify-between items-center gap-4 text-left select-none text-xl font-bold ${isOpen
                                                ? "text-ink-black"
                                                : "text-ink-black group-hover:text-primary transition-colors"
                                                }`}
                                        >
                                            <span className="flex min-w-0 items-baseline gap-3 text-left">
                                                <span
                                                    aria-hidden="true"
                                                    className={`shrink-0 font-black tabular-nums text-sm tracking-wider transition-colors ${isOpen ? "text-primary" : "text-ink-black/35"}`}
                                                >
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                {item.question}
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className={`material-icons shrink-0 text-2xl sm:text-3xl font-bold rounded-full p-1 border-2 transition-all duration-300 ease-in-out transform ${isOpen
                                                    ? "rotate-45 bg-transparent border-transparent text-ink-black/70"
                                                    : "rotate-0 border-black bg-background-light text-ink-black"
                                                    }`}
                                            >
                                                add
                                            </span>
                                        </button>
                                    </h3>
                                    {/* `inert` saca el panel cerrado del árbol de accesibilidad y de
                                        buscar-en-página. Sin esto, aria-expanded="false" mentía: las 8
                                        respuestas se anunciaban igual. */}
                                    <div
                                        id={`faq-panel-${item.id}`}
                                        role="region"
                                        aria-labelledby={`faq-trigger-${item.id}`}
                                        inert={!isOpen}
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            {hasAnswer && (
                                                <>
                                                    <div className="h-0.5 bg-ink-black/10 w-full mb-4"></div>
                                                    <div className="text-lg leading-relaxed text-ink-black/80 pb-2">
                                                        {item.answer}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </motion.div>
                {/* Reassurance Banner */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <div className="bg-white border-2 border-black p-6 sm:p-8 md:p-12 rounded-xl shadow-neobrutalism relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="relative z-10 text-center md:text-left">
                            <h4 className="text-2xl font-bold mb-2">¿Tenés otra pregunta?</h4>
                            <p className="text-ink-black/70">
                                No te quedes con la duda. Escribinos por WhatsApp y te respondemos al toque.
                            </p>
                        </div>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-ink-black font-bold text-base sm:text-lg px-5 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-black shadow-neobrutalism active:shadow-neobrutalism-sm active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group sm:whitespace-nowrap">
                            <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            <span>Hablemos por WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
