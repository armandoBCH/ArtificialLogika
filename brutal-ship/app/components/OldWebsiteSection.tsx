"use client";

import { motion } from "framer-motion";

/**
 * La sección tiene un argumento propio y bueno: engancha a los dos públicos a la
 * vez —el que tiene una web vieja y el que no tiene ninguna— y sostiene que a los
 * dos les cuesta lo mismo. El problema era que ese argumento vivía sólo en un
 * párrafo; el layout no lo decía.
 *
 * Ahora lo dice la columna derecha: dos tarjetas del MISMO negocio, una sin el
 * sistema de diseño y otra con él. La de arriba tiene filete de 1px gris, sin
 * sombra, tipografía chica y "Contáctenos" en usted — el tell de un sitio de 2014.
 * La de abajo tiene filete negro grueso, sombra dura, y habla de vos.
 *
 * Es la página demostrando su propia tesis con sus propios materiales en vez de
 * afirmarla. No hace falta explicar cuál conviene.
 */

const PROBLEMAS = [
    {
        icono: "hourglass_empty",
        // Negro sobre coral son 5.70:1; blanco sobre coral, 3.05:1. El ícono pasa
        // igual como gráfico, pero no hay razón para quedarse en el mínimo.
        color: "bg-hot-coral text-ink-black",
        titulo: "Carga lenta",
        texto: "Si tarda en abrir, la gente se va antes de ver lo que ofrecés.",
    },
    {
        icono: "smartphone",
        color: "bg-accent-yellow text-ink-black",
        titulo: "No se adapta al celular",
        texto: "Casi todos te buscan desde el teléfono. Si hay que hacer zoom, no te escriben.",
    },
    {
        icono: "sentiment_dissatisfied",
        color: "bg-primary text-white",
        titulo: "Se ve poco seria",
        texto: "Un diseño anticuado transmite desconfianza antes de que digas una palabra.",
    },
];

export default function OldWebsiteSection() {
    return (
        <section
            id="rediseno"
            aria-labelledby="rediseno-heading"
            className="relative overflow-hidden border-y-4 border-black bg-hot-coral py-24"
        >
            {/* Antes había dos blobs con blur-3xl. El desenfoque gaussiano es lo
                contrario del sistema: acá todo tiene filo. Van geometría dura y la
                trama de puntos que usa el resto de la página. */}
            <div aria-hidden="true" className="pattern-dots pointer-events-none absolute inset-0 opacity-[0.07]"></div>
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-12 hidden h-48 w-48 rotate-12 border-4 border-black/15 lg:block"></div>
            <div aria-hidden="true" className="pointer-events-none absolute -left-10 bottom-16 hidden h-32 w-32 -rotate-6 border-4 border-black/15 lg:block"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

                    {/* Columna izquierda: el argumento */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Chip negro, no sello: el sello es un veredicto y ya hay varios
                            en la home. Éste es una etiqueta de sección. */}
                        <p className="mb-6 inline-flex items-center gap-2 rounded border-2 border-black bg-ink-black px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-neobrutalism-sm">
                            <span aria-hidden="true" className="material-icons text-sm">handyman</span>
                            Rediseño web
                        </p>

                        <h2
                            id="rediseno-heading"
                            className="mb-6 text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-ink-black sm:text-5xl md:text-6xl"
                        >
                            ¿Tu web es vieja?
                            <span className="block text-white drop-shadow-neobrutalism-sm">¿O todavía no tenés?</span>
                        </h2>

                        <p className="mb-8 max-w-lg text-xl font-medium text-ink-black">
                            Las dos cosas cuestan lo mismo: clientes que te buscan, no te
                            encuentran, y le compran al de al lado. Una web lenta o que se ve mal
                            en el celular espanta igual que no tener ninguna.
                        </p>

                        <ul className="mb-10 w-full max-w-md space-y-6">
                            {PROBLEMAS.map((p) => (
                                <li
                                    key={p.titulo}
                                    className="ficha flex items-start gap-4 rounded-xl bg-white p-5 pt-7 shadow-neobrutalism transition-transform hover:-translate-y-1"
                                >
                                    <span className="ficha-etiqueta text-ink-black">{p.titulo}</span>
                                    <span
                                        aria-hidden="true"
                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-black ${p.color}`}
                                    >
                                        <span className="material-icons">{p.icono}</span>
                                    </span>
                                    <span className="text-sm font-medium leading-snug text-ink-black/70">
                                        {p.texto}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#contacto"
                            className="cta inline-flex items-center gap-3 rounded-lg border-2 border-black bg-primary px-8 py-4 text-lg font-bold uppercase text-white shadow-neobrutalism transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neobrutalism-sm"
                        >
                            Quiero mi web
                            <span aria-hidden="true" className="material-icons">arrow_forward</span>
                        </a>
                    </motion.div>

                    {/* Columna derecha: la demostración */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    >
                        <p className="sr-only">
                            Comparación entre un sitio anticuado y el mismo negocio rediseñado por
                            Logika.
                        </p>

                        {/* ANTES: el mismo negocio, sin sistema. Filete finito, gris, sin
                            sombra, apretado, y en usted. */}
                        <div aria-hidden="true" className="relative -rotate-1 rounded-sm border border-muted-charcoal/50 bg-[#EDEDED] p-5">
                            <span className="absolute -top-3 left-5 border border-muted-charcoal/50 bg-[#EDEDED] px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-charcoal">
                                Antes
                            </span>
                            <div className="mb-3 flex items-center justify-between border-b border-muted-charcoal/30 pb-2">
                                <span className="text-sm font-bold text-muted-charcoal">TuNegocio S.R.L.</span>
                                <span className="text-[11px] text-muted-charcoal">Inicio | Empresa | Contáctenos</span>
                            </div>
                            <p className="text-xs leading-tight text-muted-charcoal">
                                Bienvenidos a nuestro sitio web. Somos una empresa líder en el rubro
                                con más de 20 años de trayectoria en el mercado nacional.
                            </p>
                            <p className="mt-3 inline-block border border-muted-charcoal/50 px-2 py-1 text-[11px] text-muted-charcoal">
                                Contáctenos
                            </p>
                            <p className="mt-3 text-[10px] text-muted-charcoal/80">
                                Copyright 2014 · Todos los derechos reservados
                            </p>
                        </div>

                        {/* El único gesto de movimiento de la sección, justo entre las dos. */}
                        <div aria-hidden="true" className="relative z-10 -my-3 flex justify-center">
                            <span className="flex items-center gap-2 rounded border-2 border-black bg-ink-black px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-neobrutalism-sm">
                                <span className="material-icons text-sm">arrow_downward</span>
                                Rediseño
                            </span>
                        </div>

                        {/* DESPUÉS: el mismo negocio, con el sistema puesto. */}
                        <div aria-hidden="true" className="relative rounded-xl border-4 border-black bg-white p-6 pt-7 shadow-neobrutalism-lg">
                            {/* Mismo mecanismo de etiqueta que la tarjeta de arriba: lo único
                                que cambia entre las dos es el tratamiento, que es el punto. */}
                            <span className="absolute -top-3 left-5 rounded border-2 border-black bg-accent-yellow px-2 py-0.5 text-[11px] font-black uppercase tracking-widest text-ink-black shadow-neobrutalism-sm">
                                Después
                            </span>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xl font-black uppercase tracking-tighter text-ink-black">
                                    TuNegocio<span className="text-primary">.</span>
                                </span>
                                <span className="rounded border-2 border-black bg-secondary px-2 py-0.5 text-[11px] font-black uppercase text-ink-black">
                                    Abierto
                                </span>
                            </div>
                            <p className="text-2xl font-bold uppercase leading-[0.95] tracking-tighter text-ink-black">
                                Hacemos que tu marca{" "}
                                <span className="inline-block -rotate-1 border-2 border-black bg-mint px-1">destaque</span>
                            </p>
                            <p className="mt-3 text-sm font-medium leading-snug text-ink-black/70">
                                Todo lo que ofrecés, claro y a mano. Se ve igual de bien en la compu
                                que en el celular.
                            </p>
                            <span className="mt-5 inline-flex items-center gap-2 rounded border-2 border-black bg-[#25D366] px-4 py-2 text-sm font-black uppercase text-ink-black shadow-neobrutalism-sm">
                                <span className="material-icons text-base">chat</span>
                                Escribinos
                            </span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
