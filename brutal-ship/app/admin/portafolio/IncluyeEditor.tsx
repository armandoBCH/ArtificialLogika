"use client";

import { useCallback, useState } from "react";
import SortableGrid from "../components/SortableGrid";
import { DragHandle, MoveButtons } from "../components/SortControls";
import { arrayMove } from "../hooks/useReorderQueue";

/** Los primeros que muestra la tarjeta del catálogo (ProjectCard, variante "catalogo"). */
const EN_LA_TARJETA = 4;

const normalizar = (s: string) => s.trim().toLowerCase();

type Props = {
    /** `applied_features`: lo que se ve en "Qué incluye", en este orden. */
    items: string[];
    onChange: (items: string[]) => void;
    /** Características (no ocultas) de cada plan elegido, para sumar con un clic. */
    deLosPlanes: { plan: string; features: string[] }[];
    /** Lo que ya se cargó en otros proyectos. */
    deOtrosProyectos: string[];
};

/**
 * El "Qué incluye" de un proyecto. Antes eran solo casillas con las
 * características de los planes elegidos: lo que no estuviera en un plan no se
 * podía cargar, y el orden era el del clic. Ahora es una lista ordenable (el
 * orden es el del sitio) con ítems propios, y los planes y los otros proyectos
 * quedan como sugerencias.
 */
export default function IncluyeEditor({ items, onChange, deLosPlanes, deOtrosProyectos }: Props) {
    const [nuevo, setNuevo] = useState("");

    // El texto es la identidad de cada fila: no puede repetirse. Filas viejas
    // repetidas o vacías se limpian solas en el próximo cambio.
    const lista = items.filter((t, i) => t.trim() && items.indexOf(t) === i);
    const tiene = new Set(lista.map(normalizar));

    const agregar = (...textos: string[]) => {
        const sumados = lista.slice();
        const vistos = new Set(tiene);
        for (const t of textos) {
            const limpio = t.trim();
            const k = normalizar(limpio);
            if (!limpio || vistos.has(k)) continue;
            vistos.add(k);
            sumados.push(limpio);
        }
        if (sumados.length !== lista.length) onChange(sumados);
    };

    const enviar = () => {
        agregar(nuevo);
        setNuevo("");
    };

    const mover = (id: string, to: number) => {
        const from = lista.indexOf(id);
        const destino = Math.max(0, Math.min(lista.length - 1, to));
        if (from >= 0 && from !== destino) onChange(arrayMove(lista, from, destino));
    };

    const getId = useCallback((t: string) => t, []);

    const planes = deLosPlanes
        .map((p) => ({ plan: p.plan, faltan: p.features.filter((f) => !tiene.has(normalizar(f))) }))
        .filter((p) => p.faltan.length > 0);
    const enPlanes = new Set(deLosPlanes.flatMap((p) => p.features.map(normalizar)));
    const otros = deOtrosProyectos.filter((f) => !tiene.has(normalizar(f)) && !enPlanes.has(normalizar(f)));

    return (
        <div className="space-y-3">
            {lista.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 px-3 text-center border-2 border-dashed border-white/10 rounded-sm">
                    Todavía no hay nada. Escribí lo que se hizo o sumalo de las sugerencias de abajo.
                </p>
            ) : (
                <>
                    <p className="text-[10px] text-gray-500">
                        Arrastrá para el orden: así se ve en el sitio. Los primeros {EN_LA_TARJETA}{" "}
                        (número en violeta) también salen en la tarjeta del catálogo.
                    </p>
                    <SortableGrid items={lista} getId={getId} onReorder={onChange} className="flex flex-col gap-1.5">
                        {(t, ctx) => (
                            <div
                                className={`h-11 flex items-center gap-2 px-2 rounded-sm border-2 transition-colors ${
                                    ctx.isDragging
                                        ? "bg-[#2a1d40] border-primary shadow-neobrutalism-primary"
                                        : "bg-white/[0.06] border-white/10"
                                }`}
                            >
                                <DragHandle ctx={ctx} compact />
                                <span
                                    className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-sm text-[11px] font-black tabular-nums ${
                                        ctx.index < EN_LA_TARJETA ? "bg-primary text-white" : "bg-white/5 text-white/40"
                                    }`}
                                >
                                    {ctx.index + 1}
                                </span>
                                <span className="flex-1 min-w-0 truncate text-sm font-bold text-white" title={t}>
                                    {t}
                                </span>
                                <div className="hidden sm:block">
                                    <MoveButtons id={t} index={ctx.index} total={lista.length} onMove={mover} compact />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onChange(lista.filter((x) => x !== t))}
                                    title="Quitar"
                                    aria-label={`Quitar ${t}`}
                                    className="text-hot-coral hover:text-white w-7 h-7 flex items-center justify-center transition-colors shrink-0"
                                >
                                    <span aria-hidden="true" className="material-icons text-[16px]">close</span>
                                </button>
                            </div>
                        )}
                    </SortableGrid>
                </>
            )}

            <div className="flex gap-2">
                <input
                    className="admin-input flex-1 min-w-0 text-sm"
                    placeholder="Algo que se hizo, ej: Turnos online"
                    aria-label="Agregar algo que incluye el proyecto"
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            enviar();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={enviar}
                    disabled={!nuevo.trim()}
                    className="bg-mint text-black font-bold px-4 py-1.5 text-xs uppercase tracking-wider border-2 border-black rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shadow-neobrutalism-sm disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    + Agregar
                </button>
            </div>

            {planes.map(({ plan, faltan }) => (
                <Sugerencias
                    key={plan}
                    titulo={`Del plan ${plan}`}
                    icono="web"
                    textos={faltan}
                    onAgregar={agregar}
                    todas
                />
            ))}
            {otros.length > 0 && (
                <Sugerencias titulo="Usado en otros proyectos" icono="history" textos={otros} onAgregar={agregar} />
            )}
        </div>
    );
}

function Sugerencias({
    titulo,
    icono,
    textos,
    onAgregar,
    todas = false,
}: {
    titulo: string;
    icono: string;
    textos: string[];
    onAgregar: (...textos: string[]) => void;
    todas?: boolean;
}) {
    return (
        <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span aria-hidden="true" className="material-icons text-[12px]">{icono}</span>
                    {titulo} — clic para agregar:
                </p>
                {todas && textos.length > 1 && (
                    <button
                        type="button"
                        onClick={() => onAgregar(...textos)}
                        className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-white transition-colors"
                    >
                        + Agregar todas ({textos.length})
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-1.5">
                {textos.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => onAgregar(t)}
                        className="px-2 py-1 text-[11px] font-bold border rounded-sm bg-white/5 text-gray-300 border-white/10 hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-colors"
                    >
                        + {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
