"use client";

import CountUp from "react-countup";
import type { Testimonial } from "@/lib/types/database";

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    // Don't render the section at all if there are no testimonials
    if (testimonials.length === 0) return null;

    const isSingle = testimonials.length === 1;

    return (
        <section id="clientes" aria-labelledby="clientes-heading" className="relative z-10 w-full max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-8 bg-background-light dark:bg-background-dark">
            {/* Floating Background Shapes */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-4 border-primary animate-float"></div>
                <div className="absolute top-1/2 right-10 w-24 h-24 bg-mint rounded-lg animate-float-delayed rotate-12"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 border-4 border-hot-coral rounded-full animate-float opacity-50"></div>
            </div>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-12">
                <h2 id="clientes-heading" className="text-6xl md:text-8xl font-bold tracking-tighter leading-none relative z-10 text-black dark:text-white">
                    CLIENTES<br />
                    FELICES
                </h2>
                <div className="relative w-16 h-16 md:w-24 md:h-24 md:mb-4 animate-bounce">
                    <svg className="w-full h-full text-hot-coral drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z" stroke="black" strokeLinejoin="round" strokeWidth="1.5"></path>
                    </svg>
                </div>
            </div>
            {/* Marquee Ticker */}
            <div className="w-screen relative left-[calc(-50vw+50%)] bg-primary border-y-2 border-black mb-16 overflow-hidden group">
                <div className="animate-marquee group-hover:[animation-play-state:paused] py-4 whitespace-nowrap flex items-center gap-8">
                    <span className="text-3xl md:text-4xl font-bold text-white flex items-center gap-8">
                        RESULTADOS REALES <span className="material-icons text-3xl">star</span>
                        DISEÑO INCREÍBLE <span className="material-icons text-3xl">star</span>
                        CLIENTES SATISFECHOS <span className="material-icons text-3xl">star</span>
                        PROCESO SIMPLE <span className="material-icons text-3xl">star</span>
                        CERO COMPLICACIONES <span className="material-icons text-3xl">star</span>
                        RESULTADOS REALES <span className="material-icons text-3xl">star</span>
                        DISEÑO INCREÍBLE <span className="material-icons text-3xl">star</span>
                        CLIENTES SATISFECHOS <span className="material-icons text-3xl">star</span>
                        PROCESO SIMPLE <span className="material-icons text-3xl">star</span>
                        CERO COMPLICACIONES <span className="material-icons text-3xl">star</span>
                    </span>
                </div>
            </div>
            {/* Content Grid */}
            <div className={`grid grid-cols-1 ${isSingle ? "lg:grid-cols-2" : "lg:grid-cols-12"} gap-12 items-start`}>
                {/* Left Column: Testimonials */}
                <div className={isSingle ? "" : "lg:col-span-8"}>
                    <div className={`flex flex-col gap-6 md:gap-8 ${isSingle ? "max-w-2xl" : ""}`}>
                        {testimonials.map((t) => (
                            <div key={t.id} className="group bg-white dark:bg-gray-800 border-2 border-black rounded-xl p-6 md:p-8 shadow-neobrutalism hover:-translate-y-1 hover:shadow-neobrutalism-sm transition-all relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 text-9xl text-primary opacity-10 md:opacity-20 font-serif leading-none select-none pointer-events-none">❝</div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <p className="text-lg md:text-xl md:text-2xl font-medium mb-6 leading-relaxed text-gray-800 dark:text-gray-200">
                                        &quot;{t.quote}&quot;
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t-2 border-gray-100 dark:border-gray-700 pt-4 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 border border-black overflow-hidden flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img alt={`Retrato de ${t.name}`} className="w-full h-full object-cover" src={t.avatar_url} loading="lazy" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg leading-tight">{t.name}</h4>
                                                <span className="text-sm text-gray-500">{t.role}</span>
                                            </div>
                                        </div>
                                        {t.badge_text && (
                                            <span className={`self-start sm:self-auto px-4 py-1 rounded-full ${t.badge_color || "bg-primary/20 text-primary"} border-2 border-black text-xs font-bold shadow-[2px_2px_0px_#000]`}>
                                                {t.badge_text}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Show "ver más" only with 3+ testimonials */}
                        {testimonials.length >= 3 && (
                            <div className="flex justify-center mt-8">
                                <button className="bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-3 px-6 rounded-lg border-2 border-black shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-y-[2px] transition-all flex items-center gap-2">
                                    Ver más casos de éxito <span className="material-icons">expand_more</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Right Column: Stats */}
                <div className={`${isSingle ? "" : "lg:col-span-4"} flex flex-col gap-6 ${isSingle ? "" : "lg:pl-8"} justify-center`}>
                    <div className="bg-white dark:bg-gray-800 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_#00f090] flex flex-col items-center justify-center text-center group transition-colors duration-300 transform hover:-translate-y-1">
                        <span className="text-5xl md:text-6xl font-bold text-primary mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"><CountUp end={10} enableScrollSpy scrollSpyOnce />x</span>
                        <span className="text-lg font-bold uppercase tracking-wider bg-black text-white px-3 py-1 -rotate-1 transform mb-3 shadow-[2px_2px_0px_#000]">Más Visible</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300 leading-snug">Un negocio con web profesional recibe hasta 10 veces más consultas que uno sin presencia online.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_#fffb00] flex flex-col items-center justify-center text-center group transition-colors duration-300 transform hover:-translate-y-1">
                        <span className="text-5xl md:text-6xl font-bold text-mint mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"><CountUp end={24} enableScrollSpy scrollSpyOnce />hs</span>
                        <span className="text-lg font-bold uppercase tracking-wider bg-black text-white px-3 py-1 rotate-1 transform mb-3 shadow-[2px_2px_0px_#000]">Respuesta</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300 leading-snug">Te respondemos con un presupuesto personalizado y mockup gratis en menos de 24 horas.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_#E11D48] flex flex-col items-center justify-center text-center group transition-colors duration-300 transform hover:-translate-y-1">
                        <span className="text-5xl md:text-6xl font-bold text-hot-coral mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"><CountUp end={100} enableScrollSpy scrollSpyOnce />%</span>
                        <span className="text-lg font-bold uppercase tracking-wider bg-black text-white px-3 py-1 -rotate-2 transform mb-3 shadow-[2px_2px_0px_#000]">A Tiempo</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300 leading-snug">Cumplimos siempre con los plazos acordados. Si no, te incluimos funciones extra sin cargo.</p>
                    </div>
                </div>
            </div>
            {/* CTA Button */}
            <div className="mt-16 flex justify-center">
                <a href="#contacto" className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-12 rounded-full border-2 border-black shadow-neobrutalist hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-y-[4px] active:shadow-none transition-all text-xl flex items-center gap-2">
                    Quiero Mi Web
                    <span className="material-icons">arrow_forward</span>
                </a>
            </div>
        </section>
    );
}
