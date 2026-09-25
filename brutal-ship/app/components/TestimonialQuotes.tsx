import Image from "next/image";
import type { Testimonial } from "@/lib/types/database";

/**
 * Las citas vivían en su propia sección, 2,5 pantallas debajo del portafolio. Pero son
 * los MISMOS clientes: Rago, el blog de Rosario y la boda de Carlos y Jenlys aparecían
 * primero como proyecto y después como testimonio, y la persona tenía que unir las dos
 * cosas de memoria. Ahora van debajo de los trabajos, dentro de la misma sección.
 *
 * Todavía no van adentro de cada tarjeta porque en la base no hay vínculo entre un
 * testimonio y su proyecto. Cuando exista (un `project_id` en `testimonials`), cada cita
 * se puede mudar a su tarjeta.
 *
 * Se mantiene la regla de la sección anterior: cuanta menos prueba real hay, menos
 * finge el diseño. Con una sola cita el titular habla en singular; nunca se rellena.
 * La sección vieja también cargaba tres promesas (48hs, 24/7, 0 riesgo) que repetían la
 * garantía y el contacto: se quedaron allá.
 */

const MAXIMO = 3;

/**
 * El badge tomaba `badge_color` de la base y lo metía crudo en className: un valor mal
 * escrito rompía el estilo sin avisar. La base elige un nombre corto y el componente
 * decide las clases; un valor desconocido cae en el violeta de la marca.
 */
const COLORES_DE_BADGE: Record<string, string> = {
    violeta: "bg-primary/20 text-primary",
    verde: "bg-secondary/25 text-ink-black",
    amarillo: "bg-accent-yellow/40 text-ink-black",
    coral: "bg-hot-coral/25 text-ink-black",
    negro: "bg-ink-black text-white",
};

function colorDeBadge(valor?: string | null): string {
    return COLORES_DE_BADGE[(valor ?? "").trim().toLowerCase()] ?? COLORES_DE_BADGE.violeta;
}

function Cita({ t }: { t: Testimonial }) {
    return (
        <figure className="relative flex h-full flex-col bg-white border-2 border-black rounded-xl p-5 md:p-6 shadow-neobrutalism-primary">
            <span
                aria-hidden="true"
                className="absolute -top-5 right-3 font-serif text-8xl leading-none select-none pointer-events-none text-primary/15"
            >
                ❝
            </span>
            <blockquote className="relative z-10 flex-1 text-base md:text-lg font-medium leading-relaxed text-ink-black">
                &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="relative z-10 mt-4 pt-3 md:mt-5 md:pt-4 border-t-2 border-black/15 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-primary border-2 border-black overflow-hidden shrink-0">
                        {/* Sin foto no se rompe la tarjeta: van las iniciales, como en el equipo. */}
                        {t.avatar_url ? (
                            <Image
                                alt={`Foto de ${t.name}`}
                                className="w-full h-full object-cover"
                                src={t.avatar_url}
                                width={40}
                                height={40}
                                loading="lazy"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-sm font-black text-white">
                                {t.name.trim().charAt(0).toUpperCase()}
                            </span>
                        )}
                    </span>
                    <span>
                        <span className="block font-bold leading-tight text-ink-black">{t.name}</span>
                        <span className="block text-sm text-ink-black/70">{t.role}</span>
                    </span>
                </span>
                {t.badge_text && (
                    <span className={`px-3 py-1 rounded-full ${colorDeBadge(t.badge_color)} border-2 border-black text-xs font-bold uppercase tracking-wider whitespace-nowrap`}>
                        {t.badge_text}
                    </span>
                )}
            </figcaption>
        </figure>
    );
}

export default function TestimonialQuotes({ testimonials }: { testimonials: Testimonial[] }) {
    if (testimonials.length === 0) return null;

    const visibles = testimonials.slice(0, MAXIMO);
    const columnas = visibles.length === 1 ? "" : visibles.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

    return (
        // #clientes era el id de la sección de testimonios: los links viejos caen acá.
        <div id="clientes">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                {visibles.length === 1 ? "Lo que dice un cliente" : "Lo que dicen los clientes"}
            </h3>
            {visibles.length === 1 ? (
                <ul className="mt-8 max-w-2xl">
                    <li><Cita t={visibles[0]} /></li>
                </ul>
            ) : (
                // En celular, la misma fila horizontal que los trabajos: tres citas apiladas medían
                // más de una pantalla. El padding de abajo deja ver la sombra violeta, que el
                // overflow del carrusel si no recortaría.
                <ul className={`mt-8 -mx-4 sm:-mx-6 flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 px-4 sm:px-6 pt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:items-stretch md:gap-6 md:overflow-visible md:px-0 md:pt-0 md:pb-0 ${columnas}`}>
                    {visibles.map((t) => (
                        <li key={t.id} className="w-[85%] shrink-0 snap-start md:w-auto">
                            <Cita t={t} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
