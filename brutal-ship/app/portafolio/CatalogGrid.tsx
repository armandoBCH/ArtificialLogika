"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioProject } from "@/lib/types/database";

interface CatalogGridProps {
    initialProjects: PortfolioProject[];
}

export default function CatalogGrid({ initialProjects }: CatalogGridProps) {
    const [activeCategory, setActiveCategory] = useState<string>("Todos");

    // Extract unique categories from active projects
    const categories = useMemo(() => {
        const cats = new Set<string>();
        initialProjects.filter(p => p.is_active).forEach(p => {
            const projectCats = p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []);
            projectCats.forEach(c => cats.add(c));
        });
        return ["Todos", ...Array.from(cats).sort()];
    }, [initialProjects]);

    // Filter projects
    const filteredProjects = useMemo(() => {
        const active = initialProjects.filter(p => p.is_active);
        if (activeCategory === "Todos") return active;
        return active.filter(p => {
            const projectCats = p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []);
            return projectCats.includes(activeCategory);
        });
    }, [initialProjects, activeCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-black pb-8 mb-12">
                <div className="flex flex-col max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-black drop-shadow-neobrutalism-sm leading-none">
                        Catálogo de <span className="text-primary">Proyectos</span>
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl font-medium text-ink-black/70 border-l-4 border-black pl-4 ml-1">
                        Explorá nuestro historial de trabajos reales y proyectos de demostración. Filtrá por rubro para ver lo que podemos hacer por tu negocio.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 md:justify-end">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`inline-flex items-center min-h-11 px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-neobrutalism-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${activeCategory === cat
                                ? "bg-primary text-white scale-105"
                                : "bg-white text-black hover:bg-background-light"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            key={project.id}
                            initial={{ scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white border-2 border-black shadow-neobrutalism hover:shadow-neobrutalism-lg transition-shadow group flex flex-col h-full rounded-xl overflow-hidden relative"
                        >
                            {/* Sample Badge */}
                            {/* El sello es el dispositivo propio de Logika y ya marca las
                                muestras en la home. Aca habia un badge distinto, con otra
                                tipografia y otro borde, para decir exactamente lo mismo. */}
                            {project.is_sample && (
                                <div className="absolute top-3 right-3 z-20">
                                    <span className="sello bg-accent-yellow text-ink-black text-[10px] shadow-neobrutalism-sm whitespace-nowrap">
                                        Muestra
                                    </span>
                                </div>
                            )}

                            {/* Image */}
                            <div className="aspect-video w-full bg-background-light border-b-2 border-black relative overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={project.image_url_wide || project.image_url}
                                    alt={project.image_alt || project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4 md:p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                    {(project.categories && project.categories.length > 0
                                        ? project.categories
                                        : project.category ? [project.category] : []
                                    ).map((cat, ci) => (
                                        <span key={ci} className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                                            {cat}
                                        </span>
                                    ))}
                                    {project.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-background-light text-black text-[10px] font-bold uppercase tracking-wider border-2 border-black">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-black mb-2 leading-tight uppercase tracking-tight">
                                    {project.title}
                                </h2>
                                <p className="text-base text-ink-black/70 mb-5 line-clamp-3 md:line-clamp-4 font-medium">
                                    {project.description}
                                </p>

                                {/* Habia dos botones compitiendo: "Ver Detalles" y "Quiero algo
                                    asi". En una tarjeta de catalogo la segunda llega antes de
                                    tiempo, la persona todavia esta mirando. Y "Quiero algo asi" es
                                    la misma intencion que el "Quiero mi web" del resto del sitio,
                                    con otra etiqueta. Queda la accion que corresponde a este
                                    momento; la de contacto espera en la pagina del proyecto. */}
                                <div className="mt-auto pt-2">
                                    <a
                                        href={`/portafolio/${project.id}`}
                                        className="cta w-full inline-flex min-h-11 items-center justify-center gap-2 py-3 px-4 bg-white text-ink-black font-bold uppercase text-xs sm:text-sm tracking-wider border-2 border-black shadow-neobrutalism hover:bg-black hover:text-white transition-all text-center"
                                    >
                                        Ver proyecto
                                        <span aria-hidden="true" className="material-icons text-base">arrow_forward</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* CTA Card (Tu Proyecto Aquí) */}
                    <motion.a
                        layout
                        key="add-project-cta"
                        initial={{ scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        href="/#contacto"
                        className="bg-background-light border-4 border-dashed border-black/20 hover:border-black hover:bg-white transition-all group flex flex-col items-center justify-center p-6 text-center min-h-[300px] rounded-xl"
                    >
                        <div className="w-16 h-16 bg-primary border-2 border-black font-black flex items-center justify-center text-3xl text-white shadow-neobrutalism-sm rounded-xl mb-4 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-neobrutalism-sm transition-all">
                            +
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight mb-1">
                            Tu Proyecto Aquí
                        </h2>
                        <p className="text-xs font-bold text-ink-black/70 uppercase tracking-widest">
                            Empecemos
                        </p>
                    </motion.a>
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 border-4 border-dashed border-black/20">
                    <p className="text-xl font-bold text-ink-black/70">No hay proyectos en esta categoría.</p>
                </div>
            )}

            {/* Commercial Bottom CTA */}
            <div className="mt-16 md:mt-24 border-4 border-black bg-accent-yellow shadow-neobrutalism-lg p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 transform hover:-translate-y-1 transition-transform duration-300 relative">

                {/* Aca habia un sticker rotado que gritaba "¡100% GRATIS!". La oferta es
                    buena de verdad, y por eso no necesita gritarse: dicha en voz baja, dentro
                    del texto, se lee como una condicion del trabajo en lugar de como un
                    cartel de liquidacion. */}

                <div className="flex-1 w-full max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-black text-black uppercase leading-none tracking-tight mb-4">
                        ¿Todavía no tenés página web?
                    </h2>
                    <p className="text-base md:text-lg text-black font-medium mb-6">
                        Dejá de perder clientes que te buscan en Google y se van con la competencia. Contanos tu idea, sacate las dudas y te armamos un plan.
                    </p>

                    <ul className="space-y-2 mb-6 text-black font-bold text-sm md:text-base">
                        <li className="flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-xl text-primary">check_circle</span>
                            Te asesoramos sobre lo que realmente necesita tu negocio
                        </li>
                        <li className="flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-xl text-primary">check_circle</span>
                            Armamos una propuesta y un mockup visual, sin cargo
                        </li>
                        <li className="flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-xl text-primary">check_circle</span>
                            Si el diseño no te convence, no seguís y no pagás nada
                        </li>
                    </ul>
                </div>

                <div className="shrink-0 w-full lg:w-auto flex flex-col items-center">
                    <Link
                        href="/#contacto"
                        className="cta w-full lg:w-auto bg-black text-white px-6 py-4 text-lg font-black uppercase tracking-widest border-2 border-black shadow-neobrutalism-white hover:bg-white hover:text-black hover:border-black hover:shadow-neobrutalism hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-center group"
                    >
                        Quiero mi web
                        <span className="block text-xs text-white/70 group-hover:text-ink-black/70 mt-0.5 uppercase tracking-wider">
                            Presupuesto sin cargo
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
