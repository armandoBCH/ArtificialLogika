"use client";

import { useCallback, useState } from "react";
import SortableGrid from "../components/SortableGrid";
import { DragHandle, MoveButtons } from "../components/SortControls";
import IconPicker from "../components/IconPicker";
import { arrayMove } from "../hooks/useReorderQueue";
import { agrupar, agregarAlFinal, cambiarEstado, estadoDe, ubicarMovida, type Estado } from "./grupos";
import { estaEnVerMas } from "@/lib/precios";
import { FONDO_POR_DEFECTO, ICONO_POR_DEFECTO, textoSobreFondo } from "@/lib/iconos-plan";

export interface PlanFeature {
    text: string;
    icon: string;
    is_highlighted: boolean;
    icon_bg: string;
    /** Va dentro de "Ver las N restantes" en la tarjeta del sitio. */
    collapsed?: boolean;
    /** No sale en el sitio, ni en presupuestos, ni en portafolio. Queda guardada. */
    hidden?: boolean;
}

/**
 * Una caracteristica mientras se edita. `_key` solo existe en el formulario:
 * arrastrar necesita una identidad estable y el texto no sirve (se edita, y
 * puede repetirse). Se descarta al guardar, ver `sinClaves`.
 */
export type EditableFeature = PlanFeature & { _key: string; collapsed: boolean; hidden: boolean };

const OPCIONES: { e: Estado; icon: string; label: string; title: string; activo: string }[] = [
    { e: "vista", icon: "visibility", label: "Vista", title: "A la vista: se ve en la tarjeta del sitio", activo: "bg-secondary/20 text-secondary" },
    { e: "mas", icon: "unfold_more", label: "Ver más", title: "En “Ver las N restantes”: se ve al abrir la lista", activo: "bg-white/15 text-white" },
    { e: "oculta", icon: "visibility_off", label: "Oculta", title: "Oculta: no se muestra en el sitio, presupuestos ni portafolio. Queda guardada", activo: "bg-hot-coral/20 text-hot-coral" },
];

let contador = 0;
export function nuevaClave(): string {
    contador += 1;
    return `f${Date.now().toString(36)}${contador}`;
}

/**
 * Llamarla desde un handler (abrir el formulario), no en el primer render de algo
 * que se renderiza en el servidor: las claves salen de la hora, y servidor y
 * navegador generarian claves distintas al hidratar.
 */
export function conClaves(features: PlanFeature[] | null | undefined): EditableFeature[] {
    const lista = (features ?? []).map((f, i) => ({
        text: f.text ?? "",
        icon: f.icon || ICONO_POR_DEFECTO,
        is_highlighted: !!f.is_highlighted,
        icon_bg: f.icon_bg || FONDO_POR_DEFECTO,
        // Las cargadas antes de que existiera la opcion toman la regla vieja
        // (las primeras cuatro a la vista), asi el sitio no cambia al abrirlas.
        collapsed: estaEnVerMas(f, i),
        hidden: !!f.hidden,
        _key: nuevaClave(),
    }));
    return agrupar(lista);
}

export function sinClaves(features: EditableFeature[]): PlanFeature[] {
    return features.map(({ text, icon, is_highlighted, icon_bg, collapsed, hidden }) => ({
        text, icon, is_highlighted, icon_bg, collapsed, hidden,
    }));
}

/** La unica clave que cambio de lugar entre dos ordenes (un arrastre mueve una). */
function claveMovida(antes: string[], despues: string[]): string | null {
    for (const k of antes) {
        if (antes.indexOf(k) === despues.indexOf(k)) continue;
        const a = antes.filter((x) => x !== k);
        const d = despues.filter((x) => x !== k);
        if (a.every((x, i) => x === d[i])) return k;
    }
    return null;
}

type Props = {
    features: EditableFeature[];
    onChange: (features: EditableFeature[]) => void;
    /** Caracteristicas de los otros planes que este no tiene: se copian con un clic. */
    fromOtherPlans: PlanFeature[];
    /** Iconos usados en cualquier plan, para ofrecerlos primero en el selector. */
    usedIcons: string[];
};

export default function FeatureEditor({ features, onChange, fromOtherPlans, usedIcons }: Props) {
    const [pickerKey, setPickerKey] = useState<string | null>(null);

    const getKey = useCallback((f: EditableFeature) => f._key, []);

    const patch = (key: string, cambios: Partial<PlanFeature>) =>
        onChange(features.map((f) => (f._key === key ? { ...f, ...cambios } : f)));

    const reorder = (keys: string[]) => {
        const byKey = new Map(features.map((f) => [f._key, f]));
        const lista = keys.map((k) => byKey.get(k)).filter((f): f is EditableFeature => !!f);
        const movida = claveMovida(features.map((f) => f._key), keys);
        onChange(movida ? ubicarMovida(lista, movida) : lista);
    };

    const move = (key: string, to: number) => {
        const from = features.findIndex((f) => f._key === key);
        const clamped = Math.max(0, Math.min(features.length - 1, to));
        if (from < 0 || from === clamped) return;
        onChange(ubicarMovida(arrayMove(features, from, clamped), key));
    };

    const add = (base?: PlanFeature) =>
        onChange(agregarAlFinal(features, {
            text: base?.text ?? "",
            icon: base?.icon || ICONO_POR_DEFECTO,
            is_highlighted: base?.is_highlighted ?? false,
            icon_bg: base?.icon_bg || FONDO_POR_DEFECTO,
            collapsed: false,
            hidden: false,
            _key: nuevaClave(),
        }));

    const cuantas = (e: Estado) => features.filter((f) => estadoDe(f) === e).length;

    const editing = features.find((f) => f._key === pickerKey) ?? null;
    const closePicker = useCallback(() => setPickerKey(null), []);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[10px] text-gray-500 space-y-1">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        Elegí dónde va cada una:
                        <span className="inline-flex items-center gap-0.5 text-secondary"><span aria-hidden="true" className="material-icons text-[13px]">visibility</span>a la vista</span>
                        <span className="inline-flex items-center gap-0.5 text-gray-300"><span aria-hidden="true" className="material-icons text-[13px]">unfold_more</span>en &quot;ver más&quot;</span>
                        <span className="inline-flex items-center gap-0.5 text-hot-coral"><span aria-hidden="true" className="material-icons text-[13px]">visibility_off</span>oculta: no se muestra, queda guardada</span>
                    </p>
                    <p>
                        Arrastrá para el orden.
                        {features.length > 0 && (
                            <span className="font-bold text-gray-400">
                                {" "}{cuantas("vista")} a la vista · {cuantas("mas")} en ver más
                                {cuantas("oculta") > 0 && ` · ${cuantas("oculta")} oculta${cuantas("oculta") === 1 ? "" : "s"}`}
                            </span>
                        )}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => add()}
                    className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1"
                >
                    <span aria-hidden="true" className="material-icons text-sm">add_circle</span> Agregar
                </button>
            </div>

            {features.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center border-2 border-dashed border-white/10 rounded-sm">
                    No hay características. Agregá una o copiala de otro plan.
                </p>
            ) : (
                <SortableGrid
                    items={features}
                    getId={getKey}
                    onReorder={reorder}
                    className="flex flex-col gap-1.5"
                >
                    {(f, ctx) => {
                        const estado = estadoDe(f);
                        // Alto fijo por tamaño de pantalla (SortableGrid lo necesita): en el
                        // celular son dos renglones, el texto arriba y los controles abajo;
                        // en un renglon solo, el texto quedaba de tres letras de ancho.
                        return (
                            <div
                                className={`h-[5.5rem] sm:h-14 flex flex-wrap sm:flex-nowrap content-center items-center gap-x-2 gap-y-1.5 px-2 rounded-sm border-2 transition-colors ${
                                    ctx.isDragging
                                        ? "bg-[#2a1d40] border-primary shadow-neobrutalism-primary"
                                        : estado === "vista"
                                            ? "bg-white/[0.07] border-white/15"
                                            : estado === "mas"
                                                ? "bg-white/[0.03] border-white/10"
                                                : "bg-transparent border-dashed border-white/10"
                                }`}
                            >
                                <DragHandle ctx={ctx} compact />
                                <span className="hidden sm:inline w-5 text-center text-[11px] font-black text-white/40 tabular-nums shrink-0">
                                    {ctx.index + 1}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setPickerKey(f._key)}
                                    title="Cambiar ícono y color"
                                    aria-label={`Ícono: ${f.icon}. Cambiar ícono y color`}
                                    className="group relative shrink-0 rounded-sm p-1 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <span
                                        className={`w-8 h-8 ${f.icon_bg} ${textoSobreFondo(f.icon_bg)} border-2 border-black shadow-neobrutalism-sm flex items-center justify-center ${estado === "oculta" ? "opacity-40" : ""}`}
                                    >
                                        <span aria-hidden="true" className="material-icons text-[18px]">{f.icon}</span>
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="material-icons absolute -bottom-0.5 -right-0.5 text-[12px] bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center border border-black opacity-80 group-hover:opacity-100"
                                    >
                                        edit
                                    </span>
                                </button>

                                <input
                                    className={`admin-input flex-1 min-w-0 text-sm py-1.5 ${estado === "oculta" ? "text-gray-500" : ""}`}
                                    placeholder="Texto de la característica"
                                    value={f.text}
                                    onChange={(e) => patch(f._key, { text: e.target.value })}
                                />

                                <button
                                    type="button"
                                    onClick={() => onChange(features.filter((x) => x._key !== f._key))}
                                    title="Quitar característica"
                                    aria-label={`Quitar ${f.text || "característica"}`}
                                    className="sm:order-last text-hot-coral hover:text-white w-6 h-6 flex items-center justify-center transition-colors shrink-0"
                                >
                                    <span aria-hidden="true" className="material-icons text-[16px]">delete</span>
                                </button>

                                {/* En el celular, segundo renglon; desde tablet sus hijos se suman al de arriba. */}
                                <div className="w-full flex items-center gap-2 sm:contents">
                                    <div
                                        role="group"
                                        aria-label={`Dónde aparece ${f.text || "esta característica"}`}
                                        className="flex shrink-0 rounded-sm border border-white/15 overflow-hidden"
                                    >
                                        {OPCIONES.map((o) => {
                                            const activa = estado === o.e;
                                            return (
                                                <button
                                                    key={o.e}
                                                    type="button"
                                                    onClick={() => onChange(cambiarEstado(features, f._key, o.e))}
                                                    aria-pressed={activa}
                                                    title={o.title}
                                                    className={`h-7 px-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
                                                        activa ? o.activo : "text-gray-500 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    <span aria-hidden="true" className="material-icons text-[14px]">{o.icon}</span>
                                                    <span className="sm:hidden xl:inline">{o.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => patch(f._key, { is_highlighted: !f.is_highlighted })}
                                        aria-pressed={f.is_highlighted}
                                        aria-label="Destacada"
                                        title="Destacada: se ve en negrita y subrayada en coral"
                                        className={`h-7 px-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase border rounded-sm transition-all shrink-0 ${
                                            f.is_highlighted
                                                ? "bg-[#F2FA5A] text-black border-black"
                                                : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                                        }`}
                                    >
                                        <span aria-hidden="true" className="material-icons text-[14px]">
                                            {f.is_highlighted ? "star" : "star_border"}
                                        </span>
                                        <span className="hidden xl:inline">{f.is_highlighted ? "Destacada" : "Normal"}</span>
                                    </button>

                                    <div className="hidden md:block">
                                        <MoveButtons id={f._key} index={ctx.index} total={features.length} onMove={move} compact />
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </SortableGrid>
            )}

            {fromOtherPlans.length > 0 && (
                <div>
                    <p className="text-[10px] text-gray-500 mb-1.5 flex items-center gap-1">
                        <span aria-hidden="true" className="material-icons text-[12px]">content_copy</span>
                        De tus otros planes — clic para agregar con el mismo ícono:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {fromOtherPlans.map((f) => (
                            <button
                                key={f.text}
                                type="button"
                                onClick={() => add(f)}
                                className="flex items-center gap-1.5 pl-1 pr-2 py-1 text-[11px] font-bold border rounded-sm bg-white/5 text-gray-300 border-white/10 hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-colors"
                            >
                                <span
                                    className={`w-5 h-5 ${f.icon_bg || FONDO_POR_DEFECTO} ${textoSobreFondo(f.icon_bg || FONDO_POR_DEFECTO)} border border-black flex items-center justify-center`}
                                >
                                    <span aria-hidden="true" className="material-icons text-[12px]">
                                        {f.icon || ICONO_POR_DEFECTO}
                                    </span>
                                </span>
                                + {f.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {editing && (
                <IconPicker
                    icon={editing.icon}
                    bg={editing.icon_bg}
                    text={editing.text}
                    highlighted={editing.is_highlighted}
                    usados={usedIcons}
                    onChange={(cambios) => patch(editing._key, cambios)}
                    onClose={closePicker}
                />
            )}
        </div>
    );
}
