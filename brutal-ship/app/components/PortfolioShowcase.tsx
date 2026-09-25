import Link from "next/link";
import PortfolioViewer from "./PortfolioViewer";
import BlockReveal from "./BlockReveal";
import TestimonialQuotes from "./TestimonialQuotes";
import type { PortfolioProject, Testimonial } from "@/lib/types/database";
import { esMuestra, isRealStat } from "@/lib/data/portfolio";

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
 * tarjetas son compactas y en grilla, al estilo de los índices de trabajo de las
 * agencias de referencia: captura, rubro, nombre, una descripción corta y la salida al
 * caso completo. El detalle (etiquetas, descripción larga) vive en /portafolio/[id].
 *
 * Lo que no se resigna: las métricas reales van a la vista, porque RAGO es la única
 * prueba medida del sitio, y el sello "Proyecto de Muestra" sigue saliendo solo.
 */

// El color de acento de cada proyecto (se elige en el admin) es el de la cortina que
// descubre la captura al entrar en pantalla.
const FONDO_DE_ACENTO: Record<string, string> = {
    primary: "bg-primary",
    mint: "bg-mint",
    coral: "bg-hot-coral",
};

function ProjectCard({ project }: { project: PortfolioProject }) {
    const fondo = FONDO_DE_ACENTO[project.accent_color] ?? FONDO_DE_ACENTO.primary;
    const realStats = (project.stats ?? []).filter(isRealStat);
    const showSampleBadge = esMuestra(project);
    const categoria = project.categories?.[0] ?? project.category;

    return (
        <article className="relative flex flex-col bg-white border-2 border-black rounded-xl shadow-neobrutalism-white transition-transform duration-300 hover:-translate-y-1">
            {showSampleBadge && (
                <div className="absolute -top-3 -right-2 z-30 animate-float">
                    <p className="sello sello-derecha bg-accent-yellow text-ink-black text-xs shadow-neobrutalism-sm whitespace-nowrap">
                        Proyecto de Muestra
                    </p>
                </div>
            )}

            {/* La captura llena la parte de arriba de la tarjeta, de borde a borde. Es la imagen
                que el panel recorta en 4:3 ("Detalle + Inicio"), así que el contenedor es 4:3 en
                todos los tamaños: entra entera, sin márgenes ni recorte. Antes iba dentro de una
                franja de color con margen y una barra de navegador, y en celular se recortaba
                a 16:10.
                Tampoco lleva el gris que tenían las capturas de acento menta hasta el hover:
                en un teléfono no hay hover y el trabajo quedaba gris para siempre.
                El borde va en el envoltorio y no en la caja 4:3: con box-sizing border-box, un
                borde adentro le come 2px de alto al área de la imagen y deja de ser 4:3. */}
            <div className="overflow-hidden rounded-t-[10px] border-b-2 border-black">
                <div className="relative aspect-[4/3] bg-background-light">
                    <BlockReveal bgColor={fondo}>
                        {project.image_url ? (
                            <PortfolioViewer
                                src={project.image_url}
                                alt={project.image_alt}
                                titulo={project.title}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-ink-black/60 text-sm">Sin imagen</span>
                            </div>
                        )}
                    </BlockReveal>
                </div>
            </div>

            <div className="flex flex-col p-5 md:p-6">
                {categoria && (
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-ink-black/60">{categoria}</p>
                )}
                <h3 className="mt-1 text-2xl font-bold leading-tight text-ink-black">{project.title}</h3>
                <p className="mt-2 font-medium leading-snug text-ink-black/75 line-clamp-2 md:line-clamp-3">{project.description}</p>

                {realStats.length > 0 && (
                    <ul className="mt-4 grid grid-cols-2 gap-3">
                        {realStats.map((stat, i) => (
                            <li key={i} className="rounded-lg border-2 border-black bg-accent-yellow px-3 py-2 text-center">
                                <p className="text-2xl font-black leading-none tabular-nums text-ink-black">{stat.value}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-black/80">{stat.label}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="pt-4">
                    <Link
                        href={`/portafolio/${project.id}`}
                        className="cta inline-flex min-h-11 items-center gap-2 font-bold uppercase text-sm tracking-wider text-ink-black hover:text-primary transition-colors"
                    >
                        <span className="underline decoration-2 underline-offset-4">Ver proyecto</span>
                        <span className="sr-only">{project.title}</span>
                        <span aria-hidden="true" className="material-icons text-lg">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

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

                {/* En celular, fila horizontal con snap: cada tarjeta ocupa el 82% del ancho y la
                    siguiente asoma, que es lo que dice "hay más, deslizá". Apiladas medían casi dos
                    pantallas. Desde tablet vuelve a ser grilla. `items-start` para que cada tarjeta
                    mida lo suyo: estirarlas a la más alta dejaba un hueco donde otra tenía métricas. */}
                <ul className="mt-10 md:mt-12 -mx-4 sm:-mx-6 flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 px-4 sm:px-6 pt-3 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pt-0 md:pb-0 lg:grid-cols-3">
                    {featuredProjects.map((project) => (
                        <li key={project.id} className="w-[82%] shrink-0 snap-start md:w-auto">
                            <ProjectCard project={project} />
                        </li>
                    ))}
                </ul>
                {featuredProjects.length > 1 && (
                    <p className="md:hidden mt-1 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white/70">
                        Deslizá para ver más
                        <span aria-hidden="true" className="material-icons text-base">arrow_forward</span>
                    </p>
                )}

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
