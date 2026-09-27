"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioProject } from "@/lib/types/database";
import ProjectCard, { categoriasDe } from "@/app/components/ProjectCard";
import { esMuestra, isRealStat } from "@/lib/data/portfolio";

interface CatalogGridProps {
    initialProjects: PortfolioProject[];
}

type Tipo = "todos" | "reales" | "muestras";

// Los rubros se cargan a mano en el panel y llegan con mayúsculas mezcladas ("BLOG
// LITERARIO", "Barbería"). Se agrupan sin distinguirlas y se muestran parejos.
const clave = (rubro: string) => rubro.trim().toLocaleLowerCase("es");
const etiqueta = (rubro: string) => {
    const t = clave(rubro);
    return t.charAt(0).toLocaleUpperCase("es") + t.slice(1);
};
const rubrosDe = (p: PortfolioProject) => [...new Set(categoriasDe(p).map(clave))];
type Orden = "destacados" | "resultados" | "recientes";

const ORDENES: { valor: Orden; etiqueta: string }[] = [
    { valor: "destacados", etiqueta: "Destacados" },
    { valor: "resultados", etiqueta: "Con resultados medidos" },
    { valor: "recientes", etiqueta: "Más recientes" },
];

/**
 * El catálogo, armado como un listado de MercadoLibre: la persona llega a comparar, no a
 * mirar una galería. Por eso cada resultado es una fila (captura a la izquierda, datos a
 * la derecha), los filtros dicen cuántos hay antes de tocarlos, y siempre se ve cuántos
 * resultados quedan.
 *
 * En escritorio los filtros van en una columna fija a la izquierda; en celular, como una
 * fila de chips arriba de la lista, que es donde el pulgar los encuentra.
 *
 * "Destacados" es el mismo criterio de la home: primero el trabajo real, después las
 * muestras. Un proyecto de muestra nunca le gana el lugar a uno de un cliente.
 */
export default function CatalogGrid({ initialProjects }: CatalogGridProps) {
    const activos = useMemo(() => initialProjects.filter((p) => p.is_active), [initialProjects]);
    const [rubro, setRubro] = useState<string | null>(null);
    const [tipo, setTipo] = useState<Tipo>("todos");
    const [orden, setOrden] = useState<Orden>("destacados");

    const rubros = useMemo(() => {
        const cuenta = new Map<string, number>();
        activos.forEach((p) => rubrosDe(p).forEach((c) => cuenta.set(c, (cuenta.get(c) ?? 0) + 1)));
        return [...cuenta.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }, [activos]);

    const cantidadReales = activos.filter((p) => !esMuestra(p)).length;
    const cantidadMuestras = activos.length - cantidadReales;

    const resultados = useMemo(() => {
        const filtrados = activos.filter((p) =>
            (!rubro || rubrosDe(p).includes(rubro))
            && (tipo === "todos" || (tipo === "reales" ? !esMuestra(p) : esMuestra(p))));
        const tieneResultados = (p: PortfolioProject) => (p.stats ?? []).some(isRealStat);
        return [...filtrados].sort((a, b) => {
            if (orden === "recientes") return (b.created_at || "").localeCompare(a.created_at || "");
            if (orden === "resultados" && tieneResultados(a) !== tieneResultados(b)) return tieneResultados(a) ? -1 : 1;
            if (esMuestra(a) !== esMuestra(b)) return esMuestra(a) ? 1 : -1;
            return (a.display_order ?? 0) - (b.display_order ?? 0);
        });
    }, [activos, rubro, tipo, orden]);

    const hayFiltros = rubro !== null || tipo !== "todos";
    const limpiar = () => { setRubro(null); setTipo("todos"); };

    const opcion = (activa: boolean) =>
        `flex w-full min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-left text-sm font-bold transition-colors ${activa
            ? "bg-ink-black text-white"
            : "text-ink-black hover:bg-background-light"}`;
    const chip = (activo: boolean) =>
        `inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-black px-4 text-sm font-bold transition-all ${activo
            ? "bg-ink-black text-white"
            : "bg-white text-ink-black shadow-neobrutalism-sm active:translate-y-[1px] active:shadow-none"}`;

    return (
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12 lg:px-8">
            <nav aria-label="Ruta" className="text-sm font-bold text-ink-black/60">
                <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">Inicio</Link>
                <span aria-hidden="true" className="mx-2">/</span>
                <span aria-current="page" className="text-ink-black">Portafolio</span>
            </nav>

            <header className="mt-2 border-b-4 border-black pb-6 md:pb-8">
                <h1 className="text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
                    Nuestros <span className="text-primary">proyectos</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium text-ink-black/75 sm:text-lg md:text-xl">
                    Webs que hicimos para negocios reales y demos que construimos para mostrar lo que se puede hacer. Filtrá por rubro para ver algo parecido al tuyo.
                </p>
            </header>

            <div className="mt-6 lg:mt-10 lg:grid lg:grid-cols-[250px_1fr] lg:gap-10">
                {/* Filtros de escritorio */}
                <aside aria-label="Filtros" className="hidden lg:block">
                    <div className="sticky top-32 space-y-8">
                        <div>
                            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-ink-black/60">Rubro</h2>
                            <ul className="space-y-1">
                                <li>
                                    <button type="button" aria-pressed={rubro === null} onClick={() => setRubro(null)} className={opcion(rubro === null)}>
                                        Todos <span className="tabular-nums opacity-70">{activos.length}</span>
                                    </button>
                                </li>
                                {rubros.map(([nombre, n]) => (
                                    <li key={nombre}>
                                        <button type="button" aria-pressed={rubro === nombre} onClick={() => setRubro(rubro === nombre ? null : nombre)} className={opcion(rubro === nombre)}>
                                            {etiqueta(nombre)} <span className="tabular-nums opacity-70">{n}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {cantidadMuestras > 0 && cantidadReales > 0 && (
                            <div>
                                <h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-ink-black/60">Tipo</h2>
                                <ul className="space-y-1">
                                    {([["todos", "Todos", activos.length], ["reales", "Clientes reales", cantidadReales], ["muestras", "Demos", cantidadMuestras]] as const).map(([valor, etiqueta, n]) => (
                                        <li key={valor}>
                                            <button type="button" aria-pressed={tipo === valor} onClick={() => setTipo(valor)} className={opcion(tipo === valor)}>
                                                {etiqueta} <span className="tabular-nums opacity-70">{n}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </aside>

                <div className="min-w-0">
                    {/* Filtros de celular: una fila de chips que se desliza. */}
                    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden">
                        <button type="button" aria-pressed={rubro === null} onClick={() => setRubro(null)} className={chip(rubro === null)}>
                            Todos
                        </button>
                        {rubros.map(([nombre, n]) => (
                            <button key={nombre} type="button" aria-pressed={rubro === nombre} onClick={() => setRubro(rubro === nombre ? null : nombre)} className={chip(rubro === nombre)}>
                                {etiqueta(nombre)} <span className="tabular-nums opacity-60">{n}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
                        <p role="status" className="text-sm font-bold text-ink-black/70">
                            <span className="tabular-nums text-ink-black">{resultados.length}</span>{" "}
                            {resultados.length === 1 ? "proyecto" : "proyectos"}
                            {hayFiltros && (
                                <button type="button" onClick={limpiar} className="ml-3 py-3 font-bold text-primary underline decoration-2 underline-offset-4">
                                    Limpiar filtros
                                </button>
                            )}
                        </p>
                        <label className="flex items-center gap-2 text-sm font-bold text-ink-black/70">
                            <span className="sr-only sm:not-sr-only">Ordenar por</span>
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value as Orden)}
                                className="min-h-11 rounded-lg border-2 border-black bg-white px-3 font-bold text-ink-black"
                            >
                                {ORDENES.map((o) => <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}
                            </select>
                        </label>
                    </div>

                    {resultados.length > 0 ? (
                        <ul className="mt-5 grid grid-cols-1 gap-4 md:gap-6">
                            {resultados.map((p) => (
                                <li key={p.id}>
                                    <ProjectCard project={p} variante="catalogo" />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-5 rounded-xl border-2 border-dashed border-black/25 px-6 py-16 text-center">
                            <p className="text-xl font-bold">No hay proyectos con esos filtros.</p>
                            <button type="button" onClick={limpiar} className="mt-4 inline-flex min-h-11 items-center font-bold text-primary underline decoration-2 underline-offset-4">
                                Ver todos
                            </button>
                        </div>
                    )}

                    {/* El cierre: si no encontró algo parecido a su negocio, que no se vaya. */}
                    <div className="mt-8 flex flex-col gap-4 rounded-xl border-2 border-black bg-accent-yellow p-5 shadow-neobrutalism sm:flex-row sm:items-center sm:justify-between md:p-6">
                        <div>
                            <h2 className="text-2xl font-bold uppercase leading-tight">¿No ves tu rubro?</h2>
                            <p className="mt-1 font-medium text-ink-black/80">
                                Hacemos webs para todo tipo de negocio. Te mostramos un diseño previo de la tuya, sin cargo.
                            </p>
                        </div>
                        <Link
                            href="/#contacto"
                            className="cta inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-black bg-primary px-6 font-bold uppercase text-white shadow-neobrutalism-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        >
                            Quiero mi web
                            <span aria-hidden="true" className="material-icons text-lg">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
