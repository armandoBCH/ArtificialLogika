import Link from "next/link";
import ProjectCard from "./ProjectCard";
import TestimonialQuotes from "./TestimonialQuotes";
import type { PortfolioProject, Testimonial } from "@/lib/types/database";
import { esMuestra } from "@/lib/data/portfolio";

interface PortfolioShowcaseProps {
    projects: PortfolioProject[];
    testimonials?: Testimonial[];
}

/**
 * Trabajos y clientes, en una sola sección.
 *
 * Antes cada proyecto era un bloque partido a media pantalla —texto sobre color de un
 * lado, captura del otro— y los tres juntos medían 3,75 pantallas de celular. Después,
 * 2,5 pantallas más abajo, los mismos clientes volvían como testimonios. Ahora las
 * tarjetas son compactas (ProjectCard): horizontales en celular, para bajar por una
 * columna de nombres de un vistazo, y en grilla desde tablet. Hubo un carrusel en su
 * lugar; escondía dos de tres trabajos detrás de un gesto. El detalle vive en
 * /portafolio/[id].
 *
 * Lo que no se resigna: las métricas reales van a la vista, porque RAGO es la única
 * prueba medida del sitio, y el sello "Proyecto de Muestra" sigue saliendo solo.
 */

/**
 * Elige los tres que van en la home.
 *
 * Antes era `projects.slice(0, 3)`: los tres primeros que llegaran. Como todos
 * los proyectos activos comparten display_order 0, eso dejaba la seleccion al
 * azar, y el resultado era que RAGO AUTOMOTORES  el unico caso con metricas
 * reales  no aparecia, mientras si entraba una Barberia que esta marcada como
 * muestra.
 *
 * La regla ahora: el trabajo real va primero. Las muestras solo rellenan lo que
 * sobra. Dentro de cada grupo se respeta el orden que definis en el panel.
 *
 * Se autolimita: a medida que cargues clientes reales, las muestras se caen
 * solas de la home sin que haya que tocar nada.
 */
function elegirDestacados(proyectos: PortfolioProject[], cuantos = 3): PortfolioProject[] {
    const reales = proyectos.filter((p) => !p.is_sample);
    const muestras = proyectos.filter((p) => p.is_sample);
    return [...reales, ...muestras].slice(0, cuantos);
}

export default function PortfolioShowcase({ projects, testimonials = [] }: PortfolioShowcaseProps) {
    const featuredProjects = elegirDestacados(projects);
    // La bajada no puede prometer "negocios reales" si entra una muestra a rellenar.
    const hayMuestras = featuredProjects.some(esMuestra);

    return (
        <section id="portafolio" aria-labelledby="portafolio-heading" className="relative w-full bg-ink-black pb-20">
            <div aria-hidden="true" className="w-full h-4 bg-accent-yellow border-b-4 border-black"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 border-b-4 border-white/25 pb-6 md:pb-8">
                    <div aria-hidden="true" className="text-secondary shrink-0">
                        <svg
                            className="drop-shadow-neobrutalism w-14 h-14 md:w-20 md:h-20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                stroke="white"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h2 id="portafolio-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-white">
                            Nuestro <span className="text-accent-yellow">Trabajo</span>
                        </h2>
                        <p className="mt-3 md:mt-4 text-base md:text-xl font-medium text-white/75 max-w-xl">
                            {hayMuestras
                                ? "Proyectos entregados y demos que construimos para que veas nuestro nivel."
                                : "Negocios reales, con su web publicada y andando."}
                        </p>
                    </div>
                </div>

                <ul className="mt-10 md:mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {featuredProjects.map((project) => (
                        <li key={project.id}>
                            <ProjectCard project={project} />
                        </li>
                    ))}
                </ul>

                <div className="mt-10 text-center">
                    <Link
                        className="cta inline-block w-full sm:w-auto px-6 py-4 md:px-10 bg-accent-yellow text-ink-black text-sm md:text-lg font-bold uppercase tracking-widest border-2 border-transparent hover:bg-white hover:border-black shadow-neobrutalism-white transition-all duration-300 hover:-translate-y-1"
                        href="/portafolio"
                    >
                        Ver todos los trabajos
                    </Link>
                </div>

                {testimonials.length > 0 && (
                    <div className="mt-12 md:mt-20 border-t-4 border-white/25 pt-10 md:pt-16">
                        <TestimonialQuotes testimonials={testimonials} />
                    </div>
                )}
            </div>
        </section>
    );
}
