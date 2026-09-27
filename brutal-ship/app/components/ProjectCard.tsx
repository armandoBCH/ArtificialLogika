import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/types/database";
import { esMuestra, isRealStat } from "@/lib/data/portfolio";

/** Las categorías de un proyecto: `categories` si tiene, si no la `category` suelta. */
export function categoriasDe(p: Pick<PortfolioProject, "categories" | "category">): string[] {
    if (p.categories && p.categories.length > 0) return p.categories;
    return p.category ? [p.category] : [];
}

interface ProjectCardProps {
    project: PortfolioProject;
    /**
     * "home": horizontal en celular y vertical desde tablet, sobre fondo oscuro.
     * "catalogo": horizontal en todos los tamaños, como un listado de MercadoLibre, sobre fondo claro.
     */
    variante?: "home" | "catalogo";
}

/**
 * Una tarjeta de proyecto para escanear rápido.
 *
 * En celular es horizontal: la captura a la izquierda, a la derecha lo que se decide de un
 * vistazo (rubro, nombre, qué es) y abajo, a todo el ancho, la franja de datos. Tres
 * tarjetas verticales medían casi dos pantallas; así entran en poco más de media, y el ojo
 * baja por una columna de nombres en vez de deslizar un carrusel que esconde dos de tres.
 *
 * Toda la tarjeta lleva al caso (el link del título se estira sobre ella), como un
 * resultado de MercadoLibre: no hay que apuntarle a un botón chico. "Ver proyecto" es la
 * señal visual de eso, no un segundo link.
 *
 * La franja de datos nunca queda vacía: si hay métricas reales van ellas; si no, lo que
 * se hizo (servicios aplicados). No se inventa nada para llenar el hueco.
 */
export default function ProjectCard({ project, variante = "home" }: ProjectCardProps) {
    const lista = variante === "catalogo";
    const stats = (project.stats ?? []).filter(isRealStat);
    const muestra = esMuestra(project);
    const categorias = categoriasDe(project);
    const imagen = project.image_url || project.image_url_wide;
    const hechos = [...(project.applied_services ?? []), ...(project.applied_features ?? [])].slice(0, 2);

    return (
        <article
            className={`group relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-black bg-white transition-all duration-200 hover:-translate-y-0.5 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary ${lista
                ? "shadow-neobrutalism hover:shadow-neobrutalism-lg"
                : "shadow-neobrutalism-white"
                }`}
        >
            <div className={`flex flex-1 ${lista ? "" : "md:flex-col"}`}>
                {/* La captura llena su columna: se estira al alto de la tarjeta y se ancla
                    arriba, donde está el hero del sitio. En la versión vertical es 4:3 exacto,
                    el recorte que el panel prepara para esta imagen. */}
                <div
                    className={`relative shrink-0 overflow-hidden border-black bg-background-light ${lista
                        ? "w-[40%] min-h-[118px] border-r-2 sm:w-56 md:w-72 lg:w-80 sm:aspect-[4/3] sm:self-start"
                        : "w-[40%] min-h-[118px] border-r-2 md:w-full md:aspect-[4/3] md:min-h-0 md:border-r-0 md:border-b-2"
                        }`}
                >
                    {imagen ? (
                        <Image
                            src={imagen}
                            alt={project.image_alt || project.title}
                            fill
                            sizes={lista ? "(max-width: 639px) 40vw, 320px" : "(max-width: 767px) 40vw, (max-width: 1023px) 50vw, 400px"}
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-ink-black/60">Sin imagen</span>
                    )}
                    {muestra && (
                        <span className="sello absolute left-2 top-2 z-[1] bg-accent-yellow text-ink-black text-[10px] shadow-neobrutalism-sm">
                            Muestra
                        </span>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 md:p-5">
                    {categorias.length > 0 && (
                        <p className="truncate text-[11px] font-black uppercase tracking-[0.14em] text-ink-black/60">
                            {lista ? categorias.join(" · ") : categorias[0]}
                        </p>
                    )}
                    <h3 className={`mt-0.5 font-bold leading-tight text-ink-black line-clamp-2 ${lista ? "text-lg sm:text-xl md:text-2xl" : "text-lg md:text-2xl"}`}>
                        <Link
                            href={`/portafolio/${project.id}`}
                            className="after:absolute after:inset-0 after:z-[2] focus-visible:outline-none"
                        >
                            {project.title}
                        </Link>
                    </h3>
                    <p className={`mt-1 text-sm font-medium leading-snug text-ink-black/75 line-clamp-2 ${lista ? "sm:text-base md:line-clamp-3" : "md:text-base md:line-clamp-3"}`}>
                        {project.description}
                    </p>
                    {/* En el listado, desde tablet sobra alto al lado de la captura: va lo que se
                        construyó, que es lo que la persona compara entre un caso y otro. */}
                    {lista && (project.applied_features?.length ?? 0) > 0 && (
                        <ul className="mt-auto hidden flex-wrap gap-x-3 gap-y-1 pt-3 sm:flex">
                            {project.applied_features.slice(0, 4).map((f, i) => (
                                <li key={i} className="flex items-center gap-1 text-xs font-bold text-ink-black/70">
                                    <span aria-hidden="true" className="material-icons text-sm text-primary">check</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* La franja de datos: métricas reales, o qué se hizo. */}
            <div className="flex items-center gap-2 border-t-2 border-dashed border-black/15 px-3 py-2.5 sm:px-4 md:px-5 md:py-3">
                <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {stats.length > 0
                        ? stats.slice(0, 2).map((s, i) => (
                            <li key={i} className="inline-flex items-baseline gap-1 rounded-md border-2 border-black bg-accent-yellow px-2 py-0.5">
                                <span className="text-sm font-black tabular-nums text-ink-black md:text-base">{s.value}</span>
                                <span className="text-[11px] font-bold uppercase tracking-wide text-ink-black/80">{s.label}</span>
                            </li>
                        ))
                        : hechos.map((h, i) => (
                            <li key={i} className={`${i > 0 ? "hidden sm:block " : ""}max-w-full truncate rounded-md border-2 border-black/15 bg-background-light px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-black/75`}>
                                {h}
                            </li>
                        ))}
                </ul>
                {/* En celular, una flecha sola: la tarjeta entera ya es el link, y el texto
                    partía la franja en dos renglones. Desde tablet hay lugar para decirlo. */}
                <span aria-hidden="true" className="ml-auto inline-flex shrink-0 items-center gap-0.5 text-xs font-black uppercase tracking-wider text-ink-black transition-colors group-hover:text-primary">
                    <span className="hidden sm:inline">Ver proyecto</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black transition-transform group-hover:translate-x-0.5 sm:h-auto sm:w-auto sm:rounded-none sm:border-0">
                        <span className="material-icons text-lg sm:text-base">arrow_forward</span>
                    </span>
                </span>
            </div>
        </article>
    );
}
