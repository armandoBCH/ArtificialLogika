"use client";

import Link from "next/link";
import Image from "next/image";
import type { Testimonial } from "@/lib/types/database";

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

/**
 * La sección se adapta a cuánta prueba real hay, en tres modos:
 *
 *   1 testimonio  → columna: la cita al frente, las garantías al costado.
 *                   Con una sola cita no se puede fingir pluralidad, así que el
 *                   titular lo dice y las garantías sostienen el resto del peso.
 *   2–3           → grilla pareja. Ya hay coro: las citas se reparten y las
 *                   garantías bajan a una fila horizontal debajo.
 *   4 o más       → muro. Columnas tipo masonry, las garantías salen de la vista
 *                   principal (ya no hacen falta: la prueba habla sola) y aparece
 *                   el enlace al catálogo completo.
 *
 * La regla es una sola: cuanta más evidencia real hay, menos tiene que compensar
 * el diseño. Nunca al revés — la sección no crece de volumen para tapar que hay poco.
 */

const GARANTIAS = [
    {
        valor: "48hs",
        titulo: "Te respondemos",
        texto: "Con presupuesto y un mockup de tu web. Sin compromiso.",
        sombra: "shadow-neobrutalism-primary",
    },
    {
        valor: "24/7",
        titulo: "Tu web atiende",
        texto: "De noche, domingos y feriados. Vos no tenés que estar.",
        sombra: "shadow-neobrutalism-mint",
    },
    {
        valor: "0",
        titulo: "Riesgo al empezar",
        texto: "Si no te gusta el primer diseño, te devolvemos la seña completa.",
        sombra: "shadow-neobrutalism",
    },
];

function Cita({ t, destacada }: { t: Testimonial; destacada: boolean }) {
    return (
        <figure
            className={`relative bg-white rounded-xl overflow-hidden break-inside-avoid ${destacada
                ? "border-4 border-black p-7 md:p-10 shadow-neobrutalism-lg"
                : "border-2 border-black p-6 shadow-neobrutalism"
                }`}
        >
            <span
                aria-hidden="true"
                className={`absolute -top-6 -right-2 font-serif leading-none select-none pointer-events-none text-primary/15 ${destacada ? "text-9xl" : "text-8xl"
                    }`}
            >
                ❝
            </span>
            <blockquote
                className={`relative z-10 font-medium leading-relaxed text-ink-black ${destacada ? "text-xl md:text-2xl" : "text-lg"
                    }`}
            >
                &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="relative z-10 mt-6 pt-5 border-t-2 border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-background-light border-2 border-black overflow-hidden shrink-0">
                        <Image
                            alt={`Foto de ${t.name}`}
                            className="w-full h-full object-cover"
                            src={t.avatar_url}
                            width={44}
                            height={44}
                            loading="lazy"
                        />
                    </span>
                    <span>
                        <span className="block font-bold leading-tight">{t.name}</span>
                        <span className="block text-sm text-ink-black/70">{t.role}</span>
                    </span>
                </div>
                {t.badge_text && (
                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full ${t.badge_color || "bg-primary/20 text-primary"} border-2 border-black text-xs font-bold uppercase tracking-wider shadow-neobrutalism-sm whitespace-nowrap`}>
                        {t.badge_text}
                    </span>
                )}
            </figcaption>
        </figure>
    );
}

function Garantias({ horizontal }: { horizontal: boolean }) {
    return (
        <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink-black/70">Lo que te garantizamos</p>
            <ul className={`mt-6 gap-4 ${horizontal ? "grid grid-cols-1 sm:grid-cols-3" : "flex flex-col"}`}>
                {GARANTIAS.map((g) => (
                    <li
                        key={g.titulo}
                        className={`bg-white border-2 border-black rounded-xl p-5 ${g.sombra} flex items-start gap-4`}
                    >
                        <span className="shrink-0 text-3xl md:text-4xl font-black text-ink-black tabular-nums leading-none pt-0.5">
                            {g.valor}
                        </span>
                        <span>
                            <span className="block font-bold text-lg leading-tight">{g.titulo}</span>
                            <span className="block mt-1 text-base font-medium text-ink-black/70 leading-snug">
                                {g.texto}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    if (testimonials.length === 0) return null;

    const cantidad = testimonials.length;
    const modo = cantidad === 1 ? "unico" : cantidad <= 3 ? "grilla" : "muro";
    const visibles = modo === "muro" ? testimonials.slice(0, 6) : testimonials;

    const titulo =
        modo === "unico" ? (
            <>
                Un cliente,<br />
                <span className="text-primary">un resultado medido.</span>
            </>
        ) : (
            <>
                Lo que dicen<br />
                <span className="text-primary">los que ya tienen su web.</span>
            </>
        );

    const bajada =
        modo === "unico"
            ? "Somos nuevos y lo decimos: por ahora tenemos un caso con números propios. Preferimos mostrarte ese antes que inventar diez."
            : modo === "grilla"
                ? "Negocios reales que hoy tienen su web publicada y andando."
                : `${cantidad} negocios que ya pasaron por acá. Estas son sus palabras, no las nuestras.`;

    return (
        <section
            id="clientes"
            aria-labelledby="clientes-heading"
            className="relative z-10 w-full bg-background-light border-b-2 border-black py-16 md:py-24"
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10"
            >
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-4 border-primary animate-float"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 border-4 border-hot-coral rounded-full animate-float opacity-50"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                <h2
                    id="clientes-heading"
                    className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-ink-black max-w-3xl"
                >
                    {titulo}
                </h2>
                <p className="mt-6 text-lg md:text-xl font-medium max-w-xl text-ink-black/70">{bajada}</p>

                {modo === "unico" && (
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <Cita t={testimonials[0]} destacada />
                        </div>
                        <div className="lg:col-span-5">
                            <Garantias horizontal={false} />
                        </div>
                    </div>
                )}

                {modo === "grilla" && (
                    <>
                        <div className={`mt-12 grid grid-cols-1 gap-6 ${cantidad === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                            {visibles.map((t) => (
                                <Cita key={t.id} t={t} destacada={false} />
                            ))}
                        </div>
                        <div className="mt-14">
                            <Garantias horizontal />
                        </div>
                    </>
                )}

                {modo === "muro" && (
                    <>
                        {/* Muro tipo masonry: con cuatro o más citas, dejarlas correr a su
                            alto natural se lee mejor que forzarlas a una grilla pareja. */}
                        <div className="mt-12 columns-1 md:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
                            {visibles.map((t) => (
                                <Cita key={t.id} t={t} destacada={false} />
                            ))}
                        </div>
                        {cantidad > 6 && (
                            <p className="mt-8 text-center font-bold text-ink-black/70">
                                Y {cantidad - 6} más.
                            </p>
                        )}
                        <div className="mt-10 flex justify-center">
                            <Link
                                href="/portafolio"
                                className="inline-flex items-center gap-2 min-h-11 bg-white hover:bg-accent-yellow text-ink-black font-bold py-3 px-7 rounded-lg border-2 border-black shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-y-[2px] transition-all"
                            >
                                Ver todos los trabajos
                                <span aria-hidden="true" className="material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
