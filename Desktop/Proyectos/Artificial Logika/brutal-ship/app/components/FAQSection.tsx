"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "¿Cuánto tarda en estar lista mi web?",
        answer:
            "Para una Landing Page o web sencilla, entre 1 y 2 semanas. Para sitios más completos con varias páginas, entre 3 y 5 semanas. Te damos un plazo concreto desde el día uno y siempre lo cumplimos.",
    },
    {
        question: "¿Tengo que saber de tecnología?",
        answer:
            "No, para nada. Nosotros nos encargamos de todo lo técnico: diseño, desarrollo, dominio, hosting, emails, certificado de seguridad. Vos solo nos decís qué querés y nosotros lo hacemos.",
    },
    {
        question: "¿Qué incluye el precio?",
        answer:
            "Incluye diseño personalizado, desarrollo responsive (tu web se adapta a celulares), configuración de SEO básico para que aparezcas en Google, formulario de contacto, integración con redes sociales y soporte post-entrega. Te ayudamos con dominio y hosting también.",
    },
    {
        question: "¿Tengo que pagar mantenimiento mensual?",
        answer:
            "No es obligatorio. Te entregamos la web terminada y funcionando. Si querés que nos encarguemos de actualizaciones y mantenimiento, tenemos planes opcionales accesibles.",
    },
    {
        question: "¿Para qué tipo de negocio trabajan?",
        answer:
            "Para todos. Peluquerías, restaurantes, clínicas, estudios de abogados, tiendas, profesionales independientes, PyMEs y emprendedores. Si tenés un negocio, te hacemos tu web.",
    },
    {
        question: "¿Cómo es la forma de pago?",
        answer:
            "Trabajamos con un 50% de seña para arrancar y el 50% restante al entregar. Aceptamos transferencia bancaria y podemos armar un plan de pago si lo necesitás.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative bg-background-light dark:bg-background-dark">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-5 z-0 bg-pattern-dots"></div>
            {/* Floating Triangles */}
            <div className="absolute top-20 left-10 w-16 h-16 bg-neutral-900 opacity-[0.03] triangle-shape rotate-12 z-0"></div>
            <div className="absolute bottom-40 right-20 w-24 h-24 bg-primary opacity-[0.1] triangle-shape -rotate-12 z-0"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-secondary-coral opacity-[0.05] triangle-shape rotate-45 z-0"></div>
            <main className="relative z-10 container mx-auto px-4 py-20 max-w-5xl">
                {/* Header */}
                <header className="text-center mb-16 relative">
                    <div className="relative inline-block">
                        <div className="absolute -top-4 -left-8 w-24 h-24 bg-secondary-coral rounded-full opacity-80 mix-blend-multiply dark:mix-blend-overlay z-0"></div>
                        <h1 className="relative z-10 text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase leading-none">
                            Preguntas<br />Frecuentes
                        </h1>
                    </div>
                    <p className="mt-6 text-xl text-neutral-900/70 dark:text-white/70 max-w-2xl mx-auto font-medium">
                        Todo lo que necesitás saber antes de arrancar. Sin letra chica, sin sorpresas.
                    </p>
                </header>
                {/* FAQ List */}
                <div className="space-y-6 max-w-3xl mx-auto">
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;
                        const hasAnswer = item.answer.length > 0;
                        return (
                            <article
                                key={index}
                                className={`group bg-white dark:bg-neutral-800 border-2 border-black rounded-lg shadow-neobrutalism transition-all ${hasAnswer && !isOpen
                                    ? "hover:shadow-neobrutalism-hover hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
                                    : isOpen
                                        ? "hover:-translate-y-1"
                                        : "hover:shadow-neobrutalism-hover hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
                                    }`}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center cursor-pointer select-none">
                                        <h3
                                            className={`text-xl font-bold ${isOpen
                                                ? "text-neutral-900 dark:text-primary"
                                                : "text-neutral-900 dark:text-white group-hover:text-primary transition-colors"
                                                }`}
                                        >
                                            {item.question}
                                        </h3>
                                        {isOpen ? (
                                            <span className="material-icons text-3xl font-bold transform rotate-45 transition-transform">
                                                add
                                            </span>
                                        ) : (
                                            <span className="material-icons text-3xl font-bold bg-neutral-100 dark:bg-neutral-700 rounded-full p-1 border-2 border-black">
                                                add
                                            </span>
                                        )}
                                    </div>
                                    {isOpen && hasAnswer && (
                                        <>
                                            <div className="h-0.5 bg-neutral-900/10 dark:bg-white/10 w-full my-4"></div>
                                            <div className="text-lg leading-relaxed text-neutral-900/80 dark:text-white/80">
                                                {item.answer}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
                {/* Reassurance Banner */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-neutral-800 border-2 border-black p-8 md:p-12 rounded-lg shadow-neobrutalism relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h4 className="text-2xl font-bold mb-2">¿Tenés otra pregunta?</h4>
                            <p className="text-neutral-600 dark:text-neutral-300">
                                No te quedes con la duda. Escribinos por WhatsApp y te respondemos al toque.
                            </p>
                        </div>
                        <a href="#contacto" className="relative z-10 bg-primary hover:bg-primary-dark text-neutral-900 font-bold text-lg px-8 py-4 rounded border-2 border-black shadow-neobrutalism active:shadow-neobrutalism-hover active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2 group">
                            <span>Escribinos Ahora</span>
                            <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </main>
        </section>
    );
}
