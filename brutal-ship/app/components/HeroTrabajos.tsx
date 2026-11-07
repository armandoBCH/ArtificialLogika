import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/types/database";
import { esMuestra, isRealStat, rutaProyecto } from "@/lib/data/portfolio";
import { categoriasDe } from "./ProjectCard";

/**
 * El hero muestra trabajo real en vez de una web inventada: la pregunta "¿son reales?"
 * se contesta en la primera pantalla y no en la cuarta. Va quieto (nada en loop).
 *
 * Adelante, el primer cliente real con su captura y sus métricas medidas; atrás asoman
 * los dos siguientes. Las métricas salen de la base y solo si son reales (isRealStat).
 */
export default function HeroTrabajos({ projects }: { projects: PortfolioProject[] }) {
    const reales = projects.filter((p) => !esMuestra(p) && (p.image_url || p.image_url_wide)).slice(0, 3);
    // ponytail: sin clientes reales con captura (pasa si Supabase falla y entran los datos de
    // respaldo, que son muestras) no se muestra nada y en escritorio la mitad derecha queda
    // vacía hasta la próxima regeneración (60 s). Si eso molesta, sumar un respaldo propio.
    if (reales.length === 0) return null;
    const [principal, ...atras] = reales;
    const stats = (principal.stats ?? []).filter(isRealStat).slice(0, 2);
    const rubro = categoriasDe(principal)[0];

    return (
        <figure className="relative mx-auto w-full max-w-md pt-10 lg:max-w-lg">
            {atras.map((p, i) => (
                <div
                    key={p.id}
                    aria-hidden="true"
                    className={`absolute top-0 aspect-[4/3] w-[62%] overflow-hidden rounded-xl border-2 border-black bg-white shadow-neobrutalism ${i === 0 ? "left-4 -rotate-6" : "right-4 rotate-6"}`}
                >
                    <Image
                        src={p.image_url || p.image_url_wide}
                        alt=""
                        fill
                        sizes="(max-width: 1023px) 60vw, 340px"
                        className="object-cover object-top"
                    />
                </div>
            ))}

            <Link
                href={rutaProyecto(principal)}
                className="group relative block overflow-hidden rounded-xl border-2 border-black bg-white shadow-neobrutalism-lg transition-transform duration-200 hover:-translate-y-0.5"
            >
                <span className="relative block aspect-[4/3] border-b-2 border-black bg-background-light">
                    <Image
                        src={principal.image_url || principal.image_url_wide}
                        // El título del enlace ya nombra el caso: con alt el lector lo repetía.
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 1023px) 90vw, 512px"
                        className="object-cover object-top"
                    />
                </span>
                <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-3 sm:p-4">
                    <span className="min-w-0">
                        {rubro && <span className="etiqueta block text-ink-black/70">{rubro}</span>}
                        <span className="block font-bold leading-tight text-ink-black group-hover:text-primary">{principal.title}</span>
                    </span>
                    {stats.length > 0 && (
                        <span className="flex flex-wrap gap-1.5">
                            {stats.map((s, i) => (
                                <span key={i} className="inline-flex items-baseline gap-1 rounded-md border-2 border-black bg-accent-yellow px-2 py-0.5">
                                    <span className="text-sm font-black tabular-nums text-ink-black">{s.value}</span>
                                    <span className="etiqueta text-ink-black/80">{s.label}</span>
                                </span>
                            ))}
                        </span>
                    )}
                </span>
            </Link>

            {/* El sello va dentro de una caja posicionada: `.sello` fija position: relative
                fuera de capa y le gana a la utilidad `absolute`. */}
            <figcaption className="absolute -bottom-4 right-4">
                <span className="sello sello-derecha bg-primary text-white text-xs shadow-neobrutalism-sm">Hecho por Logika</span>
            </figcaption>
        </figure>
    );
}
