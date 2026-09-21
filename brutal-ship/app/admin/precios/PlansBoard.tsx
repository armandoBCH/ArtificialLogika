"use client";

import { useCallback } from "react";
import SortableGrid, { type SortableRenderContext } from "../components/SortableGrid";
import {
    DragHandle,
    MoveButtons,
    PresetButton,
    SaveBadge,
    UndoButton,
    ViewSwitcher,
} from "../components/SortControls";
import { useReorderQueue } from "../hooks/useReorderQueue";
import { COLS_CLASS, useViewPrefs } from "../hooks/useViewPrefs";
import { cuotaMensual, formatearPesos, formatearPrecio, separarCaracteristicas } from "@/lib/precios";
import { FONDO_POR_DEFECTO, ICONO_POR_DEFECTO, textoSobreFondo } from "@/lib/iconos-plan";
import type { PlanFeature } from "./FeatureEditor";

export interface BoardPlan {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    original_price: number | null;
    currency: string;
    payment_type: string;
    features: PlanFeature[];
    is_featured: boolean;
    featured_label: string | null;
    monthly_price?: number | null;
    display_order: number;
    is_active: boolean;
}

type Preset = "cheap" | "expensive" | "featured-center" | "reverse";

type Props<T extends BoardPlan> = {
    plans: T[];
    loading: boolean;
    onEdit: (p: T) => void;
    onDelete: (id: string) => void;
    onToggleActive: (p: T) => void;
    /** Persiste el orden. Devuelve si se guardo bien. */
    onReorder: (orderedIds: string[]) => Promise<boolean>;
};

export default function PlansBoard<T extends BoardPlan>({
    plans,
    loading,
    onEdit,
    onDelete,
    onToggleActive,
    onReorder,
}: Props<T>) {
    const { mode, cols, setMode, setCols } = useViewPrefs("admin:precios:view");
    const { ordered, positionById, saveState, canUndo, undo, applyVisibleOrder, moveWithin } =
        useReorderQueue(plans, onReorder);

    const ids = ordered.map((p) => p.id);
    const featured = ordered.find((p) => p.is_featured && p.is_active);

    const move = useCallback(
        (id: string, to: number) => moveWithin(ordered.map((p) => p.id), id, to),
        [ordered, moveWithin]
    );

    const applyPreset = (preset: Preset) => {
        // Los presets acomodan lo que se ve en el sitio; los ocultos quedan al
        // final. Si no, "recomendado al centro" contaba un plan oculto y en el
        // sitio el recomendado terminaba primero.
        const visibles = ordered.filter((p) => p.is_active);
        const ocultos = ordered.filter((p) => !p.is_active);
        const byPrice = (a: T, b: T) => (a.price ?? 0) - (b.price ?? 0);
        let list = visibles.slice();
        switch (preset) {
            case "cheap":
                list.sort(byPrice);
                break;
            case "expensive":
                list.sort((a, b) => byPrice(b, a));
                break;
            case "featured-center": {
                // El patron clasico de una pagina de precios: el recomendado en
                // el medio, flanqueado por el mas barato y el mas caro.
                const destacado = visibles.find((p) => p.is_featured);
                if (!destacado) return;
                list = visibles.filter((p) => p.id !== destacado.id).sort(byPrice);
                list.splice(Math.floor(list.length / 2), 0, destacado);
                break;
            }
            case "reverse":
                list.reverse();
                break;
        }
        applyVisibleOrder([...list, ...ocultos].map((p) => p.id));
    };

    const getId = useCallback((p: T) => p.id, []);

    const gridClass =
        mode === "list" ? "flex flex-col gap-2" : `grid ${COLS_CLASS[cols]} gap-4 items-start`;

    return (
        <div className="space-y-4">
            <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-3 flex flex-wrap items-center gap-2 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#1e1530]/95">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">Ordenar</span>
                <PresetButton label="Más barato primero" icon="trending_up" onClick={() => applyPreset("cheap")} />
                <PresetButton label="Más caro primero" icon="trending_down" onClick={() => applyPreset("expensive")} />
                {featured && (
                    <PresetButton
                        label="Recomendado al centro"
                        icon="vertical_align_center"
                        onClick={() => applyPreset("featured-center")}
                    />
                )}
                <PresetButton label="Invertir" icon="swap_vert" onClick={() => applyPreset("reverse")} />
                <UndoButton canUndo={canUndo} onUndo={undo} />

                <div className="ml-auto flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 font-mono">{plans.length} planes</span>
                    <SaveBadge state={saveState} />
                    <ViewSwitcher mode={mode} cols={cols} setMode={setMode} setCols={setCols} />
                </div>
            </div>

            {/* Solo la primera carga muestra "Cargando": los refetch despues de
                editar dejan la grilla quieta en vez de hacerla parpadear. */}
            {loading && plans.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : plans.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                    <p className="text-gray-500">No hay planes creados aún.</p>
                </div>
            ) : (
                <SortableGrid key={mode} items={ordered} getId={getId} onReorder={applyVisibleOrder} className={gridClass}>
                    {(plan, ctx) => {
                        const props = {
                            plan,
                            ctx,
                            position: positionById.get(plan.id) ?? 0,
                            total: ids.length,
                            onMove: move,
                            onEdit,
                            onDelete,
                            onToggleActive,
                        };
                        return mode === "list" ? <PlanRow {...props} /> : <PlanCard {...props} />;
                    }}
                </SortableGrid>
            )}
        </div>
    );
}

type CardProps<T extends BoardPlan> = {
    plan: T;
    ctx: SortableRenderContext;
    position: number;
    total: number;
    onMove: (id: string, to: number) => void;
    onEdit: (p: T) => void;
    onDelete: (id: string) => void;
    onToggleActive: (p: T) => void;
};

function FeatureChip({ f }: { f: PlanFeature }) {
    const bg = f.icon_bg || FONDO_POR_DEFECTO;
    return (
        <div className="flex items-center gap-2 min-w-0">
            <span
                className={`w-5 h-5 ${bg} ${textoSobreFondo(bg)} border border-black flex items-center justify-center shrink-0`}
            >
                <span aria-hidden="true" className="material-icons text-[12px]">{f.icon || ICONO_POR_DEFECTO}</span>
            </span>
            <span className={`text-xs truncate ${f.is_highlighted ? "text-white font-bold" : "text-gray-300"}`}>
                {f.text}
            </span>
        </div>
    );
}

function ActiveToggle<T extends BoardPlan>({ plan, onToggleActive }: { plan: T; onToggleActive: (p: T) => void }) {
    return (
        <button
            type="button"
            onClick={() => onToggleActive(plan)}
            title={plan.is_active ? "Visible en el sitio — clic para ocultar" : "Oculto — clic para mostrar"}
            aria-label={plan.is_active ? `Ocultar ${plan.name} del sitio` : `Mostrar ${plan.name} en el sitio`}
            aria-pressed={plan.is_active}
            className={`w-7 h-7 flex items-center justify-center rounded-sm border transition-colors ${
                plan.is_active
                    ? "text-secondary border-secondary/30 bg-secondary/10 hover:bg-secondary/20"
                    : "text-hot-coral border-hot-coral/30 bg-hot-coral/10 hover:bg-hot-coral/20"
            }`}
        >
            <span aria-hidden="true" className="material-icons text-[16px]">
                {plan.is_active ? "visibility" : "visibility_off"}
            </span>
        </button>
    );
}

/* Alto fijo: SortableGrid mide los casilleros una sola vez al empezar el
   arrastre y eso solo vale si todas las tarjetas miden lo mismo. */
function PlanCard<T extends BoardPlan>({ plan, ctx, position, total, onMove, onEdit, onDelete, onToggleActive }: CardProps<T>) {
    const features = plan.features ?? [];
    const { aLaVista, enVerMas } = separarCaracteristicas(features);
    // La tarjeta tiene alto fijo: entran cuatro filas, el resto se cuenta.
    const PREVIA = 4;
    const visiblesSinLugar = Math.max(0, aLaVista.length - PREVIA);

    return (
        <div
            className={`h-[19rem] bg-[#1e1530] border-2 rounded-sm overflow-hidden flex flex-col transition-colors ${
                ctx.isDragging
                    ? "border-primary shadow-neobrutalism-primary"
                    : plan.is_featured
                        ? "border-[#F2FA5A]/40 hover:border-[#F2FA5A]/70"
                        : "border-white/10 hover:border-primary/40"
            } ${plan.is_active ? "" : "opacity-60"}`}
        >
            <div className={`p-3 border-b border-white/10 shrink-0 ${plan.is_featured ? "bg-[#F2FA5A]/10" : ""}`}>
                <div className="flex items-center gap-2">
                    <DragHandle ctx={ctx} />
                    <span className="bg-black/70 text-white font-black text-[11px] px-2 py-1 rounded-sm border border-white/20 tabular-nums">
                        #{position}
                    </span>
                    <h3 className="text-white font-black text-base truncate flex-1">{plan.name}</h3>
                    {!plan.is_active && (
                        <span className="bg-hot-coral text-white font-black text-[9px] px-1.5 py-0.5 rounded-sm uppercase">Oculto</span>
                    )}
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                    {plan.original_price ? (
                        <span className="text-gray-500 text-xs line-through font-mono">
                            {formatearPrecio(plan.original_price, plan.currency)}
                        </span>
                    ) : null}
                    <span className="text-white text-xl font-black">{formatearPrecio(plan.price ?? 0, plan.currency)}</span>
                    <span className="text-gray-400 text-[10px] font-bold truncate">
                        {cuotaMensual(plan) ? `+ ${formatearPesos(cuotaMensual(plan)!)}/mes` : plan.payment_type}
                    </span>
                    {plan.is_featured && (
                        <span className="ml-auto bg-[#F2FA5A]/20 text-[#F2FA5A] text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider border border-[#F2FA5A]/30 truncate max-w-[45%]">
                            {plan.featured_label || "Destacado"}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-3 flex-1 min-h-0 space-y-1.5 overflow-hidden">
                {aLaVista.slice(0, PREVIA).map((f, i) => (
                    <FeatureChip key={i} f={f} />
                ))}
                {features.length === 0 && <p className="text-xs text-gray-500 italic">Sin características</p>}
                {(visiblesSinLugar > 0 || enVerMas.length > 0) && (
                    <p className="text-[10px] text-gray-500 font-bold pl-7">
                        {[
                            visiblesSinLugar > 0 && `+${visiblesSinLugar} a la vista`,
                            enVerMas.length > 0 && `${enVerMas.length} en "ver más"`,
                        ].filter(Boolean).join(" · ")}
                    </p>
                )}
            </div>

            <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
                <MoveButtons id={plan.id} index={ctx.index} total={total} onMove={onMove} compact />
                <div className="flex items-center gap-1.5">
                    <ActiveToggle plan={plan} onToggleActive={onToggleActive} />
                    <button
                        type="button"
                        onClick={() => onEdit(plan)}
                        className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-sm text-xs font-bold transition-colors"
                    >
                        Editar
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(plan.id)}
                        title="Eliminar"
                        aria-label={`Eliminar ${plan.name}`}
                        className="text-hot-coral hover:text-white w-6 h-6 flex items-center justify-center transition-colors"
                    >
                        <span aria-hidden="true" className="material-icons text-[16px]">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function PlanRow<T extends BoardPlan>({ plan, ctx, position, total, onMove, onEdit, onDelete, onToggleActive }: CardProps<T>) {
    return (
        <div
            className={`h-16 bg-[#1e1530] border-2 rounded-sm flex items-center gap-3 px-3 transition-colors ${
                ctx.isDragging
                    ? "border-primary shadow-neobrutalism-primary"
                    : plan.is_featured
                        ? "border-[#F2FA5A]/40"
                        : "border-white/10 hover:border-primary/40"
            } ${plan.is_active ? "" : "opacity-60"}`}
        >
            <DragHandle ctx={ctx} compact />
            <span className="text-white/50 font-black text-xs tabular-nums w-8 shrink-0">#{position}</span>

            <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-sm truncate">{plan.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{plan.subtitle}</p>
            </div>

            <span className="text-white font-black text-sm tabular-nums shrink-0 text-right leading-tight">
                {formatearPrecio(plan.price ?? 0, plan.currency)}
                {cuotaMensual(plan) && (
                    <span className="block text-[10px] font-bold text-gray-400">
                        + {formatearPesos(cuotaMensual(plan)!)}/mes
                    </span>
                )}
            </span>

            <div className="hidden md:flex items-center gap-1.5 shrink-0">
                {plan.is_featured && (
                    <span className="bg-[#F2FA5A]/20 text-[#F2FA5A] border border-[#F2FA5A]/30 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                        {plan.featured_label || "Destacado"}
                    </span>
                )}
                <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                    <span aria-hidden="true" className="material-icons text-[13px]">checklist</span>
                    {plan.features?.length ?? 0}
                </span>
            </div>

            <MoveButtons id={plan.id} index={ctx.index} total={total} onMove={onMove} compact />

            <div className="flex items-center gap-1.5 shrink-0">
                <ActiveToggle plan={plan} onToggleActive={onToggleActive} />
                <button
                    type="button"
                    onClick={() => onEdit(plan)}
                    className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-sm text-xs font-bold transition-colors"
                >
                    Editar
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(plan.id)}
                    title="Eliminar"
                    aria-label={`Eliminar ${plan.name}`}
                    className="text-hot-coral hover:text-white w-6 h-6 flex items-center justify-center transition-colors"
                >
                    <span aria-hidden="true" className="material-icons text-[16px]">delete</span>
                </button>
            </div>
        </div>
    );
}
