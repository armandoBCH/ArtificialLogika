"use client";

import type { SortableRenderContext } from "./SortableGrid";
import type { SaveState } from "../hooks/useReorderQueue";
import { COLUMN_CHOICES, type ViewMode } from "../hooks/useViewPrefs";

/* Piezas de interfaz que comparten los listados reordenables del admin
   (portafolio y precios), para que se vean y se comporten igual. */

export function DragHandle({ ctx, compact = false }: { ctx: SortableRenderContext; compact?: boolean }) {
    return (
        <span
            {...ctx.handleProps}
            className={`flex items-center justify-center rounded-sm border-2 border-black bg-white/90 text-black shadow-neobrutalism-sm hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors shrink-0 ${
                compact ? "w-6 h-7" : "w-7 h-7"
            }`}
        >
            <span aria-hidden="true" className="material-icons text-[18px]">drag_indicator</span>
        </span>
    );
}

export function MoveButtons({
    id,
    index,
    total,
    onMove,
    compact = false,
}: {
    id: string;
    index: number;
    total: number;
    onMove: (id: string, to: number) => void;
    compact?: boolean;
}) {
    const first = index === 0;
    const last = index === total - 1;
    const size = compact ? "w-6 h-6 text-[14px]" : "w-7 h-7 text-[16px]";

    const btn = (label: string, icon: string, to: number, disabled: boolean) => (
        <button
            type="button"
            onClick={() => onMove(id, to)}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={`${size} flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-gray-300 disabled:hover:border-white/10`}
        >
            <span aria-hidden="true" className="material-icons" style={{ fontSize: "inherit" }}>
                {icon}
            </span>
        </button>
    );

    return (
        <div className="flex items-center gap-1 shrink-0">
            {btn("Mover al principio", "keyboard_double_arrow_up", 0, first)}
            {btn("Subir una posición", "keyboard_arrow_up", index - 1, first)}
            {btn("Bajar una posición", "keyboard_arrow_down", index + 1, last)}
            {btn("Mover al final", "keyboard_double_arrow_down", total - 1, last)}
        </div>
    );
}

export function SaveBadge({ state }: { state: SaveState }) {
    if (state === "idle") {
        return (
            <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                <span aria-hidden="true" className="material-icons text-[14px]">drag_indicator</span>
                Arrastrá para ordenar
            </span>
        );
    }

    const map: Record<Exclude<SaveState, "idle">, { icon: string; text: string; cls: string }> = {
        pending: { icon: "more_horiz", text: "Cambios sin guardar", cls: "text-[#FDE047]" },
        saving: { icon: "sync", text: "Guardando orden...", cls: "text-[#FDE047]" },
        saved: { icon: "check_circle", text: "Orden guardado", cls: "text-secondary" },
        error: { icon: "error", text: "No se pudo guardar", cls: "text-hot-coral" },
    };
    const s = map[state];

    return (
        <span
            role="status"
            aria-live="polite"
            className={`text-[11px] font-bold flex items-center gap-1 ${s.cls}`}
        >
            <span
                aria-hidden="true"
                className={`material-icons text-[14px] ${state === "saving" ? "animate-spin" : ""}`}
            >
                {s.icon}
            </span>
            {s.text}
        </span>
    );
}

export function UndoButton({ canUndo, onUndo }: { canUndo: boolean; onUndo: () => void }) {
    return (
        <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
            <span aria-hidden="true" className="material-icons text-[14px]">undo</span>
            Deshacer
        </button>
    );
}

export function PresetButton({
    label,
    icon,
    onClick,
    flipIcon = false,
}: {
    label: string;
    icon: string;
    onClick: () => void;
    flipIcon?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-white/5 border border-white/10 rounded-sm hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-colors"
        >
            <span aria-hidden="true" className={`material-icons text-[14px] ${flipIcon ? "scale-y-[-1]" : ""}`}>
                {icon}
            </span>
            {label}
        </button>
    );
}

/** Botones de 2 / 3 / 4 columnas y lista compacta. */
export function ViewSwitcher({
    mode,
    cols,
    setMode,
    setCols,
}: {
    mode: ViewMode;
    cols: number;
    setMode: (m: ViewMode) => void;
    setCols: (c: number) => void;
}) {
    const cls = (active: boolean) =>
        `px-2.5 py-2 text-xs font-black transition-colors ${
            active ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`;

    return (
        <div className="flex rounded-sm border-2 border-white/10 overflow-hidden">
            {COLUMN_CHOICES.map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => setCols(n)}
                    title={`${n} columnas`}
                    aria-label={`Ver en ${n} columnas`}
                    aria-pressed={mode === "grid" && cols === n}
                    className={cls(mode === "grid" && cols === n)}
                >
                    <span className="flex items-center gap-1">
                        <span aria-hidden="true" className="material-icons text-[16px]">grid_view</span>
                        {n}
                    </span>
                </button>
            ))}
            <button
                type="button"
                onClick={() => setMode("list")}
                title="Vista de lista compacta"
                aria-label="Vista de lista compacta"
                aria-pressed={mode === "list"}
                className={cls(mode === "list")}
            >
                <span aria-hidden="true" className="material-icons text-[16px]">view_list</span>
            </button>
        </div>
    );
}
