"use client";

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-black dark:border-white pb-8 mb-12">
                <div className="flex flex-col max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-black dark:text-white drop-shadow-sm leading-none">
                        Catálogo de <span className="text-primary dark:text-primary">Proyectos</span>
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 border-l-4 border-black dark:border-white pl-4 ml-1">
                        Explorá nuestro historial de trabajos reales y proyectos de demostración. Filtrá por rubro para ver lo que podemos hacer por tu negocio.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 md:justify-end">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${activeCategory === cat
                                ? "bg-primary text-white scale-105"
                                : "bg-white text-black hover:bg-gray-100"
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
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow group flex flex-col h-full rounded-sm overflow-hidden relative"
                        >
                            {/* Sample Badge */}
                            {project.is_sample && (
                                <div className="absolute top-2 right-2 z-20 transform rotate-[10deg]">
                                    <div className="bg-[#F2FA5A] text-black font-black text-xs px-2 py-1 uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                                        Muestra
                                    </div>
                                </div>
                            )}

                            {/* Image */}
                            <div className="aspect-video w-full bg-gray-100 border-b-2 border-black relative overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={project.image_url}
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
                                        <span key={ci} className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider border border-transparent">
                                            {cat}
                                        </span>
                                    ))}
                                    {project.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-black dark:text-white text-[10px] font-bold uppercase tracking-wider border border-black dark:border-white/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2 leading-tight uppercase tracking-tight">
                                    {project.title}
                                </h3>
                                <p className="text-base text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 md:line-clamp-4 font-medium">
                                    {project.description}
                                </p>

                                <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={`/portafolio/${project.id}`}
                                        className="flex-1 w-full inline-flex items-center justify-center py-3 md:py-2.5 px-4 bg-transparent text-gray-800 dark:text-gray-200 font-bold uppercase text-xs sm:text-sm tracking-wider border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-center"
                                    >
                                        Ver Detalles
                                    </a>
                                    <a
                                        href="/#contacto"
                                        className="flex-1 w-full inline-flex items-center justify-center gap-2 py-3 md:py-2.5 px-4 bg-white text-black font-black uppercase text-xs sm:text-sm tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-center"
                                    >
                                        Quiero algo así
                                        <span className="material-icons text-sm md:text-base">arrow_forward</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* CTA Card (Tu Proyecto Aquí) */}
                    <motion.a
                        layout
                        key="add-project-cta"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        href="/#contacto"
                        className="bg-gray-50 dark:bg-gray-800/50 border-4 border-dashed border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-gray-800 transition-all group flex flex-col items-center justify-center p-6 text-center min-h-[300px] rounded-sm"
                    >
                        <div className="w-16 h-16 bg-[#9b51e0] border-2 border-black font-black flex items-center justify-center text-3xl text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl mb-4 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                            +
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-black dark:text-white uppercase tracking-tight mb-1">
                            Tu Proyecto Aquí
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Empecemos
                        </p>
                    </motion.a>
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 border-4 border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-xl font-bold text-gray-500">No hay proyectos en esta categoría.</p>
                </div>
            )}

            {/* Commercial Bottom CTA */}
            <div className="mt-16 md:mt-24 border-4 border-black dark:border-white bg-[#F2FA5A] dark:bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#ffffff] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 transform hover:-translate-y-1 transition-transform duration-300 relative">

                {/* Free Badge */}
                <div className="absolute -top-4 -right-2 md:-top-5 md:-right-5 bg-[#9b51e0] text-white font-black text-sm md:text-lg px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[10deg] z-10">
                    ¡100% GRATIS!
                </div>

                <div className="flex-1 w-full max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-black text-black uppercase leading-none tracking-tight mb-4">
                        ¿Todavía no tenés página web?
                    </h2>
                    <p className="text-base md:text-lg text-black font-medium mb-6">
                        Dejá de perder clientes que te buscan en Google y se van con la competencia. Contanos tu idea, sacate las dudas y te armamos un plan.
                    </p>

                    <ul className="space-y-2 mb-6 text-black font-bold text-sm md:text-base">
                        <li className="flex items-center gap-2">
                            <span className="material-icons text-xl text-[#9b51e0]">check_circle</span>
                            Te asesoramos sobre lo que realmente necesita tu negocio
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="material-icons text-xl text-[#9b51e0]">check_circle</span>
                            Armamos una propuesta y mockup visual sin compromiso
                        </li>
                    </ul>
                </div>

                <div className="shrink-0 w-full lg:w-auto flex flex-col items-center">
                    <a
                        href="/#contacto"
                        className="w-full lg:w-auto bg-black text-white px-6 py-4 text-lg font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-center group"
                    >
                        Pedir Presupuesto
                        <span className="block text-xs text-gray-400 group-hover:text-gray-600 mt-0.5 uppercase tracking-wider">
                            Sin Cargo Adicional
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
