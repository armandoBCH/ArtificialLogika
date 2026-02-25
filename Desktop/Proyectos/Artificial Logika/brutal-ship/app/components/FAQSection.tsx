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
            "Para una Landing Page, entre 1 y 2 semanas. Para sitios institucionales o e-commerce, entre 2 y 4 semanas. Te damos un plazo concreto desde el día uno y siempre lo cumplimos.",
    },
    {
        question: "¿Tengo que saber de tecnología?",
        answer:
            "No, para nada. Nosotros nos encargamos de absolutamente todo: diseño, desarrollo, que funcione en celulares, que aparezca en Google, dominio, hosting y certificado de seguridad. Vos solo nos contás qué necesitás.",
    },
    {
        question: "¿El precio incluye dominio y hosting?",
        answer:
            "Te ayudamos a configurar todo: dominio (.com o .com.ar), hosting, emails profesionales y certificado de seguridad (el candadito verde). El costo del dominio y hosting es aparte (generalmente menos de $20 USD/año), pero nosotros lo tramitamos por vos.",
    },
    {
        question: "¿Qué pasa si necesito algo más complejo?",
        answer:
            "Los precios que ves son la base. Si tu proyecto necesita funciones extra (reservas online, sistema de turnos, integración con software, idiomas múltiples, etc.), te armamos un presupuesto personalizado. Siempre sabés el precio total antes de arrancar.",
    },
    {
        question: "¿Tengo que pagar mantenimiento mensual?",
        answer:
            "No es obligatorio. Te entregamos la web terminada y funcionando con 1 mes de soporte incluido. Si después querés que nos encarguemos de actualizaciones y cambios, tenemos planes opcionales muy accesibles.",
    },
    {
        question: "¿Para qué tipo de negocio trabajan?",
        answer:
            "Para todos. Peluquerías, restaurantes, clínicas, estudios contables, tiendas de ropa, profesionales independientes, PyMEs y emprendedores. Si tenés un negocio o proyecto, te hacemos tu web.",
    },
    {
        question: "¿Cómo es la forma de pago?",
        answer:
            "Trabajamos con un 50% de seña para arrancar y el 50% restante al entregar. Si no te gusta el diseño inicial, te devolvemos la seña. Aceptamos transferencia bancaria y podemos armar un plan de pago si lo necesitás.",
    },
    {
        question: "¿Mi web va a aparecer en Google?",
        answer:
            "Sí. Todas nuestras webs están configuradas para que Google las encuentre y las muestre cuando alguien busque tu tipo de negocio. Esto se llama SEO y viene incluido en todos los planes.",
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
                        <a href="https://wa.me/5491112345678?text=Hola!%20Tengo%20una%20consulta%20sobre%20sus%20servicios%20web" target="_blank" rel="noopener noreferrer" className="relative z-10 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded border-2 border-black shadow-neobrutalism active:shadow-neobrutalism-hover active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2 group whitespace-nowrap">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            <span>Escribinos Ahora</span>
                        </a>
                    </div>
                </div>
            </main>
        </section>
    );
}
