"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PortfolioProject } from "@/lib/types/database";
import ProjectCard, { categoriasDe } from "@/app/components/ProjectCard";
import { esMuestra, isRealStat } from "@/lib/data/portfolio";

interface CatalogGridProps {
    initialProjects: PortfolioProject[];
}

type Tipo = "todos" | "reales" | "muestras";
type Orden = "destacados" | "resultados" | "recientes";

// Los rubros y etiquetas se cargan a mano en el panel, con mayúsculas y tildes mezcladas
// ("PELUQUERIA", "Peluquería"). Para comparar se pasa todo a minúsculas sin tildes.
// NFD separa cada letra de su tilde (0x300–0x36F son las marcas que se combinan); se descartan.
const clave = (texto: string) =>
    [...texto.trim().toLocaleLowerCase("es").normalize("NFD")]
        .filter((c) => c.charCodeAt(0) < 0x300 || c.charCodeAt(0) > 0x36f)
        .join("");

/**
 * Los rubros del panel son texto libre y casi cada proyecto tiene uno propio ("Pesca",
 * "Cortinas", "Sublimación"): filtrar por ellos daba 20 botones de "1". Acá se agrupan en
 * rubros amplios, que es como piensa el cliente ("tengo un comercio", "hago oficios").
 *
 * Gana la primera categoría del proyecto que encaje en algún rubro: Lotus es "Peluquería ·
 * Café" y va a Belleza, no a Gastronomía. Un rubro nuevo que no encaje cae en "Otros"
 * hasta que se sume su palabra acá.
 */
const RUBROS: { id: string; nombre: string; palabras: RegExp }[] = [
    { id: "gastronomia", nombre: "Gastronomía", palabras: /restaurant|parrilla|helad|\bcafe|\bbar\b|cervec|panader|pizz|comida|gastronom|rotiser|catering/ },
    { id: "belleza", nombre: "Belleza y estética", palabras: /peluquer|barber|estetica|\bspa\b|unas|maquilla|belleza/ },
    { id: "comercios", nombre: "Tiendas y comercios", palabras: /optica|montana|tabaquer|mascota|pet shop|pesca|deporte|sublimac|personalizad|almacen|alimento|indumentaria|ropa|tienda|kiosco|librer|ferreter|vivero|jugueter/ },
    { id: "salud", nombre: "Salud y profesionales", palabras: /salud|gerontolog|medic|odontolog|kinesio|psicolog|abogad|bufete|contador|consultor|inmobiliar|veterinar/ },
    { id: "autos", nombre: "Autos", palabras: /concesionar|automot|automotriz|lubricentro|taller|repuesto|neumatic|\bmoto/ },
    { id: "oficios", nombre: "Oficios y construcción", palabras: /construcc|techo|telecomunicac|altura|cortina|hogar|plomer|electric|herrer|carpinter|pintur|limpieza|zinguer/ },
    { id: "eventos", nombre: "Eventos y fotografía", palabras: /evento|boda|casamiento|fotograf|salon de fiesta|productora/ },
    { id: "cultura", nombre: "Arte y cultura", palabras: /musica|editorial|blog|literar|\barte\b|teatro|danza/ },
];
const OTROS = { id: "otros", nombre: "Otros rubros" };

const rubroDe = (p: PortfolioProject) => {
    for (const categoria of categoriasDe(p)) {
        const r = RUBROS.find((r) => r.palabras.test(clave(categoria)));
        if (r) return r.id;
    }
    return OTROS.id;
};

/**
 * Lo que la persona necesita resolver con su web, sacado de las etiquetas y funciones que
 * se cargan en el panel. Es el segundo filtro porque muchos no buscan "algo de mi rubro"
 * sino "una web donde me saquen turno". "Botón de WhatsApp" no está: lo tienen casi todos
 * y no separaría nada.
 */
const NECESIDADES: { id: string; nombre: string; palabras: RegExp }[] = [
    { id: "vender", nombre: "Vender online", palabras: /tienda online|carrito|ventas online|mercadopago/ },
    { id: "turnos", nombre: "Turnos y reservas", palabras: /turno|reserva/ },
    // "Historial de pedidos" o "panel de pedidos" son de tiendas online, no de pedir por WhatsApp.
    { id: "pedidos", nombre: "Pedidos por WhatsApp", palabras: /whatsapp pedidos|\| pedidos \|/ },
    { id: "catalogo", nombre: "Mostrar un catálogo", palabras: /catalogo|menu digital/ },
    // En plural: "Presupuesto sin cargo" figura en casi todos y es la oferta de Logika, no algo de la web.
    { id: "presupuestos", nombre: "Recibir presupuestos", palabras: /presupuestos/ },
    { id: "autogestion", nombre: "Actualizarla yo mismo", palabras: /gestionable/ },
];

const textoDe = (p: PortfolioProject) =>
    clave(`| ${[...categoriasDe(p), ...(p.tags ?? []), ...(p.applied_features ?? []), ...(p.applied_services ?? [])].join(" | ")} |`);
const textoBusqueda = (p: PortfolioProject) => clave(`${p.title} ${p.description ?? ""} ${textoDe(p)}`);

const ORDENES: { valor: Orden; etiqueta: string }[] = [
    { valor: "destacados", etiqueta: "Destacados" },
    { valor: "resultados", etiqueta: "Con resultados medidos" },
    { valor: "recientes", etiqueta: "Más recientes" },
];

interface Filtros {
    rubro: string | null;
    necesidad: string | null;
    tipo: Tipo;
    q: string;
}
const SIN_FILTROS: Filtros = { rubro: null, necesidad: null, tipo: "todos", q: "" };

/**
 * El catálogo, armado como un listado de MercadoLibre: la persona llega a comparar, no a
 * mirar una galería. Cada resultado es una fila, cada filtro dice cuántos hay si lo tocás
 * (contando los otros filtros ya elegidos) y siempre se ve cuántos quedan.
 *
 * Los filtros viajan en la URL (?rubro=gastronomia&necesito=turnos) para poder mandarle
 * a un cliente por WhatsApp los trabajos de su rubro.
 *
 * "Destacados" es el mismo criterio de la home: primero el trabajo real, después las
 * muestras. Un proyecto de muestra nunca le gana el lugar a uno de un cliente.
 */
export default function CatalogGrid({ initialProjects }: CatalogGridProps) {
    const proyectos = useMemo(
        () => initialProjects
            .filter((p) => p.is_active)
            .map((p) => ({
                p,
                rubro: rubroDe(p),
                necesidades: NECESIDADES.filter((n) => n.palabras.test(textoDe(p))).map((n) => n.id),
                busqueda: textoBusqueda(p),
                muestra: esMuestra(p),
            })),
        [initialProjects],
    );
    const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);
    const [orden, setOrden] = useState<Orden>("destacados");
    const cambiar = (cambio: Partial<Filtros>) => setFiltros((f) => ({ ...f, ...cambio }));
    const [urlLeida, setUrlLeida] = useState(false);

    // La URL se lee al montar (no con useSearchParams, que sacaría la página del render estático).
    // Hasta leerla no se escribe: si no, el primer render la pisaba con los filtros vacíos.
    useEffect(() => {
        const u = new URLSearchParams(window.location.search);
        const tipo = u.get("tipo");
        setFiltros({
            rubro: u.get("rubro"),
            necesidad: u.get("necesito"),
            tipo: tipo === "reales" || tipo === "muestras" ? tipo : "todos",
            q: u.get("q") ?? "",
        });
        setUrlLeida(true);
    }, []);
    useEffect(() => {
        if (!urlLeida) return;
        const u = new URLSearchParams();
        if (filtros.rubro) u.set("rubro", filtros.rubro);
        if (filtros.necesidad) u.set("necesito", filtros.necesidad);
        if (filtros.tipo !== "todos") u.set("tipo", filtros.tipo);
        if (filtros.q.trim()) u.set("q", filtros.q.trim());
        const qs = u.toString();
        window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, [filtros, urlLeida]);

    const pasa = (x: (typeof proyectos)[number], f: Filtros) => {
        const palabras = clave(f.q).split(/\s+/).filter(Boolean);
        return (!f.rubro || x.rubro === f.rubro)
            && (!f.necesidad || x.necesidades.includes(f.necesidad))
            && (f.tipo === "todos" || (f.tipo === "reales" ? !x.muestra : x.muestra))
            && palabras.every((w) => x.busqueda.includes(w));
    };
    // Cuántos quedarían si se elige esa opción, con el resto de los filtros como están.
    const cuantos = (cambio: Partial<Filtros>) => proyectos.filter((x) => pasa(x, { ...filtros, ...cambio })).length;

    const rubros = [...RUBROS, OTROS].filter((r) => proyectos.some((x) => x.rubro === r.id));
    const necesidades = NECESIDADES.filter((n) => proyectos.some((x) => x.necesidades.includes(n.id)));
    const hayDemos = proyectos.some((x) => x.muestra) && proyectos.some((x) => !x.muestra);

    const resultados = useMemo(() => {
        const tieneResultados = (p: PortfolioProject) => (p.stats ?? []).some(isRealStat);
        return proyectos
            .filter((x) => pasa(x, filtros))
            .map((x) => x.p)
            .sort((a, b) => {
                if (orden === "recientes") return (b.created_at || "").localeCompare(a.created_at || "");
                if (orden === "resultados" && tieneResultados(a) !== tieneResultados(b)) return tieneResultados(a) ? -1 : 1;
                if (esMuestra(a) !== esMuestra(b)) return esMuestra(a) ? 1 : -1;
                return (a.display_order ?? 0) - (b.display_order ?? 0);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proyectos, filtros, orden]);

    const hayFiltros = filtros.rubro !== null || filtros.necesidad !== null || filtros.tipo !== "todos" || filtros.q.trim() !== "";
    const limpiar = () => setFiltros(SIN_FILTROS);
    const nombreRubro = rubros.find((r) => r.id === filtros.rubro)?.nombre;
    const nombreNecesidad = necesidades.find((n) => n.id === filtros.necesidad)?.nombre;

    const opcion = (activa: boolean) =>
        `flex w-full min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-left text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${activa
            ? "bg-ink-black text-white"
            : "text-ink-black hover:bg-background-light disabled:hover:bg-transparent"}`;
    const chip = (activo: boolean) =>
        `inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-black px-4 text-sm font-bold transition-all disabled:opacity-35 ${activo
            ? "bg-ink-black text-white"
            : "bg-white text-ink-black shadow-neobrutalism-sm active:translate-y-[1px] active:shadow-none"}`;

    // Un grupo de opciones de una sola elección: tocar la elegida la suelta.
    const grupo = (
        titulo: string,
        opciones: { id: string; nombre: string }[],
        actual: string | null,
        campo: "rubro" | "necesidad",
        movil: boolean,
    ) => {
        const items = [{ id: null as string | null, nombre: "Todos" }, ...opciones];
        if (movil) {
            return (
                <div role="group" aria-label={titulo}>
                    <p className="etiqueta mb-1.5 text-ink-black/70">{titulo}</p>
                    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
                        {items.map((o) => {
                            const n = cuantos({ [campo]: o.id });
                            const activa = actual === o.id;
                            return (
                                <button key={o.id ?? "todos"} type="button" aria-pressed={activa} disabled={!activa && n === 0}
                                    onClick={() => cambiar({ [campo]: activa || o.id === null ? null : o.id })} className={chip(activa)}>
                                    {o.nombre} {o.id && <span className="tabular-nums opacity-70">{n}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <h2 className="etiqueta mb-2 text-ink-black/70">{titulo}</h2>
                <ul className="space-y-1">
                    {items.map((o) => {
                        const n = cuantos({ [campo]: o.id });
                        const activa = actual === o.id;
                        return (
                            <li key={o.id ?? "todos"}>
                                <button type="button" aria-pressed={activa} disabled={!activa && n === 0}
                                    onClick={() => cambiar({ [campo]: activa || o.id === null ? null : o.id })} className={opcion(activa)}>
                                    {o.nombre} <span className="tabular-nums opacity-70">{n}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const buscador = (
        <label className="relative block">
            <span className="sr-only">Buscar proyectos</span>
            <span aria-hidden="true" className="material-icons pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-ink-black/50">search</span>
            <input
                type="search"
                value={filtros.q}
                onChange={(e) => cambiar({ q: e.target.value })}
                placeholder="Buscá tu rubro: pizzería, gimnasio…"
                className="min-h-11 w-full rounded-lg border-2 border-black bg-white pl-10 pr-3 text-base font-medium text-ink-black placeholder:text-ink-black/45 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
        </label>
    );

    const TIPOS = [["todos", "Todos"], ["reales", "Clientes reales"], ["muestras", "Demos"]] as const;

    return (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
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
                    {proyectos.length} webs entre negocios reales y demos que construimos para mostrar lo que se puede hacer.
                    Filtrá por rubro o por lo que necesitás que haga tu web.
                </p>
            </header>

            <div className="mt-6 lg:mt-10 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
                {/* Filtros de escritorio */}
                <aside aria-label="Filtros" className="hidden lg:block">
                    <div className="sticky top-32 max-h-[calc(100vh-9rem)] space-y-7 overflow-y-auto pb-4 pr-1">
                        {buscador}
                        {grupo("Rubro", rubros, filtros.rubro, "rubro", false)}
                        {necesidades.length > 0 && grupo("Qué necesitás", necesidades, filtros.necesidad, "necesidad", false)}
                        {hayDemos && (
                            <div>
                                <h2 className="etiqueta mb-2 text-ink-black/70">Tipo</h2>
                                <ul className="space-y-1">
                                    {TIPOS.map(([valor, etiqueta]) => {
                                        const n = cuantos({ tipo: valor });
                                        return (
                                            <li key={valor}>
                                                <button type="button" aria-pressed={filtros.tipo === valor} disabled={filtros.tipo !== valor && n === 0}
                                                    onClick={() => cambiar({ tipo: valor })} className={opcion(filtros.tipo === valor)}>
                                                    {etiqueta} <span className="tabular-nums opacity-70">{n}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </aside>

                <div className="min-w-0">
                    {/* Filtros de celular: buscador y filas de chips que se deslizan. */}
                    <div className="space-y-4 pb-4 lg:hidden">
                        {buscador}
                        {grupo("Rubro", rubros, filtros.rubro, "rubro", true)}
                        {necesidades.length > 0 && grupo("Qué necesitás", necesidades, filtros.necesidad, "necesidad", true)}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
                        <p role="status" className="text-sm font-bold text-ink-black/70">
                            <span className="tabular-nums text-ink-black">{resultados.length}</span>{" "}
                            {resultados.length === 1 ? "proyecto" : "proyectos"}
                            {nombreRubro && <> en <span className="text-ink-black">{nombreRubro}</span></>}
                            {nombreNecesidad && <> para <span className="text-ink-black">{nombreNecesidad.toLocaleLowerCase("es")}</span></>}
                            {hayFiltros && (
                                <button type="button" onClick={limpiar} className="ml-3 py-3 font-bold text-primary underline decoration-2 underline-offset-4">
                                    Limpiar filtros
                                </button>
                            )}
                        </p>
                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
                            {hayDemos && (
                                <label className="min-w-0 lg:hidden">
                                    <span className="sr-only">Tipo de proyecto</span>
                                    <select
                                        value={filtros.tipo}
                                        onChange={(e) => cambiar({ tipo: e.target.value as Tipo })}
                                        className="min-h-11 w-full rounded-lg border-2 border-black bg-white px-3 text-sm font-bold text-ink-black"
                                    >
                                        {TIPOS.map(([valor, etiqueta]) => <option key={valor} value={valor}>{etiqueta}</option>)}
                                    </select>
                                </label>
                            )}
                            <label className="flex min-w-0 items-center gap-2 text-sm font-bold text-ink-black/70">
                                <span className="sr-only sm:not-sr-only">Ordenar por</span>
                                <select
                                    value={orden}
                                    onChange={(e) => setOrden(e.target.value as Orden)}
                                    className="min-h-11 w-full rounded-lg border-2 border-black bg-white px-3 text-sm font-bold text-ink-black sm:w-auto sm:text-base"
                                >
                                    {ORDENES.map((o) => <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}
                                </select>
                            </label>
                        </div>
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
                            <p className="text-xl font-bold">
                                {filtros.q.trim() ? `Todavía no hicimos una web para “${filtros.q.trim()}”.` : "No hay proyectos con esos filtros."}
                            </p>
                            <p className="mt-2 font-medium text-ink-black/70">Igual te mostramos un diseño previo de la tuya, sin cargo.</p>
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                                <Link href="/#contacto" className="boton boton-primario">
                                    Quiero ver la mía
                                    <span aria-hidden="true" className="flecha material-icons text-lg">arrow_forward</span>
                                </Link>
                                <button type="button" onClick={limpiar} className="inline-flex min-h-11 items-center font-bold text-primary underline decoration-2 underline-offset-4">
                                    Ver todos los proyectos
                                </button>
                            </div>
                        </div>
                    )}

                    {/* El cierre: si no encontró algo parecido a su negocio, que no se vaya. */}
                    {resultados.length > 0 && (
                        <div className="mt-8 flex flex-col gap-4 rounded-xl border-2 border-black bg-accent-yellow p-5 shadow-neobrutalism sm:flex-row sm:items-center sm:justify-between md:p-6">
                            <div>
                                <h2 className="text-2xl font-bold uppercase leading-tight">¿No ves tu rubro?</h2>
                                <p className="mt-1 font-medium text-ink-black/80">
                                    Hacemos webs para todo tipo de negocio. Te mostramos un diseño previo de la tuya, sin cargo.
                                </p>
                            </div>
                            <Link href="/#contacto" className="boton boton-primario shrink-0">
                                Quiero mi web
                                <span aria-hidden="true" className="flecha material-icons text-lg">arrow_forward</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
