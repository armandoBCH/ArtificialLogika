"use client";

import { useCallback, useState } from "react";
import SortableGrid from "../components/SortableGrid";
import { DragHandle, MoveButtons } from "../components/SortControls";
import IconPicker from "../components/IconPicker";
import { arrayMove } from "../hooks/useReorderQueue";
import { CARACTERISTICAS_A_LA_VISTA } from "@/lib/precios";
import { FONDO_POR_DEFECTO, ICONO_POR_DEFECTO, textoSobreFondo } from "@/lib/iconos-plan";

export interface PlanFeature {
    text: string;
    icon: string;
    is_highlighted: boolean;
    icon_bg: string;
}

/**
 * Una caracteristica mientras se edita. `_key` solo existe en el formulario:
 * arrastrar necesita una identidad estable y el texto no sirve (se edita, y
 * puede repetirse). Se descarta al guardar, ver `sinClaves`.
 */
export type EditableFeature = PlanFeature & { _key: string };

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
    return (features ?? []).map((f) => ({
        text: f.text ?? "",
        icon: f.icon || ICONO_POR_DEFECTO,
        is_highlighted: !!f.is_highlighted,
        icon_bg: f.icon_bg || FONDO_POR_DEFECTO,
        _key: nuevaClave(),
    }));
}

export function sinClaves(features: EditableFeature[]): PlanFeature[] {
    return features.map(({ text, icon, is_highlighted, icon_bg }) => ({ text, icon, is_highlighted, icon_bg }));
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
        onChange(keys.map((k) => byKey.get(k)).filter((f): f is EditableFeature => !!f));
    };

    const move = (key: string, to: number) => {
        const from = features.findIndex((f) => f._key === key);
        const clamped = Math.max(0, Math.min(features.length - 1, to));
        if (from < 0 || from === clamped) return;
        onChange(arrayMove(features, from, clamped));
    };

    const add = (base?: PlanFeature) => {
        const nueva: EditableFeature = {
            text: base?.text ?? "",
            icon: base?.icon || ICONO_POR_DEFECTO,
            is_highlighted: base?.is_highlighted ?? false,
            icon_bg: base?.icon_bg || FONDO_POR_DEFECTO,
            _key: nuevaClave(),
        };
        onChange([...features, nueva]);
    };

    const editing = features.find((f) => f._key === pickerKey) ?? null;
    const closePicker = useCallback(() => setPickerKey(null), []);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                    <span aria-hidden="true" className="material-icons text-[13px] text-secondary">visibility</span>
                    Las primeras {CARACTERISTICAS_A_LA_VISTA} se ven en la tarjeta; el resto queda en
                    &quot;Ver las N restantes&quot;. Arrastrá para decidir cuáles van arriba.
                </p>
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
                        const aLaVista = ctx.index < CARACTERISTICAS_A_LA_VISTA;
                        return (
                            <div
                                className={`h-14 flex items-center gap-2 px-2 rounded-sm border-2 transition-colors ${
                                    ctx.isDragging
                                        ? "bg-[#2a1d40] border-primary shadow-neobrutalism-primary"
                                        : aLaVista
                                            ? "bg-white/[0.07] border-white/15"
                                            : "bg-white/[0.03] border-white/10"
                                }`}
                            >
                                <DragHandle ctx={ctx} compact />
                                <span className="w-5 text-center text-[11px] font-black text-white/40 tabular-nums shrink-0">
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
                                        className={`w-8 h-8 ${f.icon_bg} ${textoSobreFondo(f.icon_bg)} border-2 border-black shadow-neobrutalism-sm flex items-center justify-center`}
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
                                    className="admin-input flex-1 min-w-0 text-sm py-1.5"
                                    placeholder="Texto de la característica"
                                    value={f.text}
                                    onChange={(e) => patch(f._key, { text: e.target.value })}
                                />

                                <span
                                    className={`hidden lg:inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm border shrink-0 ${
                                        aLaVista
                                            ? "text-secondary border-secondary/30 bg-secondary/10"
                                            : "text-gray-500 border-white/10"
                                    }`}
                                >
                                    <span aria-hidden="true" className="material-icons text-[11px]">
                                        {aLaVista ? "visibility" : "unfold_more"}
                                    </span>
                                    {aLaVista ? "A la vista" : "En ver más"}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => patch(f._key, { is_highlighted: !f.is_highlighted })}
                                    aria-pressed={f.is_highlighted}
                                    title="Destacada: se ve en negrita y subrayada en coral"
                                    className={`px-2 py-1 text-[9px] font-bold uppercase border rounded-sm transition-all shrink-0 ${
                                        f.is_highlighted
                                            ? "bg-[#F2FA5A] text-black border-black"
                                            : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                                    }`}
                                >
                                    {f.is_highlighted ? "⭐ Destacada" : "Normal"}
                                </button>

                                <div className="hidden sm:block">
                                    <MoveButtons id={f._key} index={ctx.index} total={features.length} onMove={move} compact />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onChange(features.filter((x) => x._key !== f._key))}
                                    title="Quitar característica"
                                    aria-label={`Quitar ${f.text || "característica"}`}
                                    className="text-hot-coral hover:text-white w-6 h-6 flex items-center justify-center transition-colors shrink-0"
                                >
                                    <span aria-hidden="true" className="material-icons text-[16px]">delete</span>
                                </button>
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
