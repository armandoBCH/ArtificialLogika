import Image from "next/image";
import BlockReveal from "./BlockReveal";
import type { PortfolioProject } from "@/lib/types/database";

interface PortfolioShowcaseProps {
    projects: PortfolioProject[];
}

const accentColors: Record<string, { bg: string; textColor: string; borderColor: string; ctaHover: string; tagBg: string; tagText: string }> = {
    primary: {
        bg: "bg-primary",
        textColor: "text-white",
        borderColor: "border-black dark:border-white",
        ctaHover: "group-hover:bg-mint",
        tagBg: "bg-white/20",
        tagText: "text-white",
    },
    mint: {
        bg: "bg-mint",
        textColor: "text-black",
        borderColor: "border-black dark:border-white",
        ctaHover: "hover:bg-white hover:text-black hover:border-black",
        tagBg: "bg-white/40",
        tagText: "text-black",
    },
    coral: {
        bg: "bg-coral",
        textColor: "text-white",
        borderColor: "border-black dark:border-white",
        ctaHover: "group-hover:bg-primary group-hover:text-white group-hover:border-white",
        tagBg: "bg-white/20",
        tagText: "text-white",
    },
};

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
    const colors = accentColors[project.accent_color] || accentColors.primary;
    const isEven = index % 2 === 0;

    return (
        <article className="group relative bg-white dark:bg-gray-800 border-2 border-black dark:border-white shadow-hard hover:shadow-hard-lg transition-all duration-300 transform hover:-translate-y-1 hover:-rotate-1 hover:scale-[1.01]">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Content side */}
                <div className={`order-2 ${isEven ? 'lg:order-1 lg:border-r-2 lg:border-b-0' : 'lg:order-2'} ${colors.bg} p-6 md:p-12 flex flex-col justify-between ${colors.borderColor} relative overflow-hidden`}>
                    {project.accent_color === 'primary' && (
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    )}
                    {project.accent_color === 'mint' && (
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 -mr-16 -mt-16 rotate-45 border-4 border-black"></div>
                    )}
                    {project.accent_color === 'coral' && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border-[20px] border-white opacity-10 rounded-full scale-150"></div>
                    )}
                    <div className="relative z-10">
                        {project.is_sample && (
                            <div className="absolute -top-3 -right-3 md:-top-6 md:-right-6 z-20 transform rotate-[10deg] animate-float">
                                <div className="bg-[#F2FA5A] text-black font-black text-[10px] md:text-sm px-3 md:px-4 py-1 md:py-1.5 uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                                    Proyecto de Muestra
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mb-5 md:mb-6">
                            {(project.categories && project.categories.length > 0
                                ? project.categories
                                : project.category ? [project.category] : []
                            ).map((cat, i) => (
                                <span key={`cat-${i}`} className="px-2 py-0.5 md:px-3 md:py-1 bg-black text-white text-[10px] md:text-xs font-bold uppercase tracking-wider border border-white/20">
                                    {cat}
                                </span>
                            ))}
                            {project.tags.map((tag, i) => (
                                <span key={`tag-${i}`} className={`px-2 py-0.5 md:px-3 md:py-1 ${colors.tagBg} ${colors.tagText} text-[10px] md:text-xs font-bold uppercase tracking-wider border border-white/20`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${colors.textColor} mb-3 md:mb-4 leading-tight`}>{project.title}</h2>
                        <p className={`${colors.textColor === 'text-white' ? 'text-white/90' : 'text-black/80'} text-base md:text-lg mb-6 md:mb-8 ${colors.textColor === 'text-white' ? 'font-light' : 'font-medium'} max-w-md`}>
                            {project.description}
                        </p>
                    </div>
                    <div className={`relative z-10 border-t ${colors.textColor === 'text-white' ? 'border-white/20' : 'border-black/20'} pt-6 md:pt-8 mt-auto`}>
                        <div className="flex flex-row justify-between items-center md:grid md:grid-cols-2 gap-2 md:gap-8 mb-6 md:mb-8 bg-black/10 dark:bg-white/10 md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none">
                            {project.stats.map((stat, i) => (
                                <div key={i} className="text-center md:text-left flex-1 md:flex-none">
                                    <p className={`text-xl sm:text-2xl md:text-3xl font-black leading-none mb-1 ${colors.textColor}`}>{stat.value}</p>
                                    <p className={`text-[10px] md:text-sm ${colors.textColor === 'text-white' ? 'text-white/80' : 'text-black/80'} tracking-widest uppercase font-bold`}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <a className={`inline-flex items-center justify-center w-full sm:w-auto px-4 md:px-6 py-3 md:py-4 ${colors.textColor === 'text-white' ? 'bg-white text-black' : 'bg-black text-white'} font-bold text-sm md:text-lg uppercase border-2 ${colors.textColor === 'text-white' ? 'border-black' : 'border-transparent'} shadow-hard-sm hover:shadow-hard hover:translate-x-1 hover:-translate-y-1 transition-all duration-200 ${colors.ctaHover}`} href="#contacto">
                                Quiero Algo Así
                                <span className="material-icons ml-2 text-base md:text-xl">arrow_forward</span>
                            </a>
                            <a className={`inline-flex items-center justify-center w-full sm:w-auto px-4 md:px-6 py-3 md:py-4 bg-transparent ${colors.textColor} font-bold text-sm md:text-lg uppercase border-2 ${colors.textColor === 'text-white' ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'} shadow-none hover:shadow-hard hover:translate-x-1 hover:-translate-y-1 transition-all duration-200`} href={`/portafolio/${project.id}`}>
                                Ver Proyecto
                            </a>
                        </div>
                    </div>
                </div>
                {/* Image side */}
                <div className={`order-1 ${isEven ? 'lg:order-2' : 'lg:order-1 lg:border-r-2'} bg-gray-100 dark:bg-gray-900 px-4 pt-8 pb-4 md:p-12 flex items-center md:items-end justify-center relative overflow-hidden border-b-2 lg:border-b-0 border-black dark:border-white`}>
                    <div className="w-full max-w-lg transform group-hover:scale-105 transition-transform duration-500 ease-out">
                        <div className="bg-white rounded-t-lg border-2 border-black shadow-hard overflow-hidden">
                            <div className="bg-gray-200 border-b-2 border-black p-2 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-black"></div>
                                <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                            </div>
                            <div className="aspect-[4/3] bg-gray-50 relative">
                                <BlockReveal bgColor={`${colors.bg}`}>
                                    {project.image_url ? (
                                        <Image
                                            alt={project.image_alt}
                                            className={`w-full h-full object-cover ${project.accent_color === 'mint' ? 'grayscale group-hover:grayscale-0 transition-all duration-500' : ''}`}
                                            src={project.image_url}
                                            width={800}
                                            height={600}
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">Sin imagen</span>
                                        </div>
                                    )}
                                </BlockReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function PortfolioShowcase({ projects }: PortfolioShowcaseProps) {
    const featuredProjects = projects.slice(0, 3);

    return (
        <section id="portafolio" className="relative w-full bg-dot-pattern pb-20">
            {/* Decorative Top Bar */}
            <div className="w-full h-4 bg-black dark:bg-primary"></div>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-8 md:pb-12">
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 border-b-4 border-black dark:border-white pb-6 md:pb-8">
                    {/* Star Icon */}
                    <div className="text-mint shrink-0 transform hover:rotate-12 transition-transform duration-300">
                        <svg
                            className="drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] w-14 h-14 md:w-20 md:h-20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                stroke="black"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-black dark:text-white drop-shadow-sm leading-none">
                            Nuestro <span className="text-primary dark:text-primary">Trabajo</span>
                        </h2>
                        <p className="mt-3 md:mt-4 text-base md:text-2xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl border-l-4 border-black dark:border-white pl-3 md:pl-4 md:ml-1">
                            Explorá proyectos entregados y demos que construimos para que veas nuestro nivel.
                        </p>
                    </div>
                </div>
            </div>
            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-16">
                {featuredProjects.map((project, index) => (
                    <div key={project.id}>
                        <ProjectCard project={project} index={index} />
                        {index < featuredProjects.length - 1 && (
                            <div className="w-full h-0 border-t-4 border-dashed border-black dark:border-white/20 opacity-30 mt-10 md:mt-16"></div>
                        )}
                    </div>
                ))}
            </div>
            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 text-center">
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6 font-medium">Estos son solo algunos ejemplos. Tenemos más proyectos para mostrarte.</p>
                <a className="inline-block w-full sm:w-auto px-6 py-4 md:px-12 md:py-6 bg-black text-white text-sm md:text-xl font-bold uppercase tracking-widest border-2 border-transparent hover:bg-white hover:text-black hover:border-black shadow-hard hover:shadow-hard-lg transition-all duration-300 transform hover:-translate-y-1" href="/portafolio">
                    Ver Catálogo Completo
                </a>
            </div>
        </section>
    );
}
