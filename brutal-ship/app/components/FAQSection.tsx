"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/types/database";
import type { SiteConfigMap } from "@/lib/types/database";

interface FAQSectionProps {
    faqs: FAQ[];
    config: SiteConfigMap;
}

/**
 * Era la sección con más texto de la home (373 palabras, 2,5 pantallas de celular):
 * cada pregunta en su propia tarjeta con sombra, 24px de aire entre tarjetas, la primera
 * abierta de entrada y un banner de WhatsApp al pie.
 *
 * Las respuestas repiten cosas que la página ya dijo más arriba, así que su trabajo acá
 * es otro: que quien salta directo a sus dudas encuentre la suya de un vistazo. Por eso
 * todas arrancan cerradas y la lista es un solo bloque con separadores, como el FAQ de
 * los estudios de referencia. Se leen las ocho preguntas sin scrollear en escritorio.
 * Las respuestas siguen completas: también alimentan el JSON-LD (FAQJsonLd).
 */
export default function FAQSection({ faqs, config }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola! Tengo una consulta sobre sus servicios web")}`;

    return (
        <section id="faq" aria-labelledby="faq-heading" className="relative bg-background-light border-b-2 border-black">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-5 z-0 bg-pattern-dots"></div>

            <div className="relative z-10 mx-auto max-w-3xl px-4 py-20">
                <h2 id="faq-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-ink-black">
                    Preguntas<br />frecuentes
                </h2>

                <div className="mt-10 bg-white border-2 border-black rounded-xl shadow-neobrutalism divide-y-2 divide-ink-black/10 overflow-hidden">
                    {faqs.map((item, index) => {
                        const isOpen = openIndex === index;
                        const hasAnswer = item.answer.length > 0;
                        return (
                            <div key={item.id} className={isOpen ? "bg-accent-yellow/15" : ""}>
                                <h3>
                                    <button
                                        type="button"
                                        id={`faq-trigger-${item.id}`}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-panel-${item.id}`}
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="group w-full flex min-h-11 items-center justify-between gap-4 px-5 py-4 md:px-6 text-left text-lg font-bold text-ink-black hover:bg-background-light transition-colors"
                                    >
                                        <span className="flex min-w-0 items-baseline gap-3">
                                            <span
                                                aria-hidden="true"
                                                className={`shrink-0 font-black tabular-nums text-sm tracking-wider transition-colors ${isOpen ? "text-primary" : "text-ink-black/50"}`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="group-hover:text-primary transition-colors">{item.question}</span>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={`material-icons shrink-0 text-2xl rounded-full border-2 border-black transition-transform duration-300 ${isOpen ? "rotate-45 bg-accent-yellow" : "bg-background-light"}`}
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
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                >
                                    <div className="overflow-hidden">
                                        {hasAnswer && (
                                            <p className="px-5 pb-5 md:px-6 md:pl-14 text-base md:text-lg leading-relaxed text-ink-black/80">
                                                {item.answer}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Era un banner con botón verde, casi igual al que cerraba los precios. */}
                <p className="mt-8 text-lg font-medium text-ink-black/80">
                    ¿Tenés otra pregunta?{" "}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 font-bold text-ink-black underline decoration-2 underline-offset-4 hover:text-primary transition-colors"
                    >
                        Escribinos por WhatsApp
                    </a>{" "}
                    y te respondemos al toque.
                </p>
            </div>
        </section>
    );
}
