"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import SortableGrid, { type SortableRenderContext } from "../components/SortableGrid";

export interface BoardProject {
    id: string;
    title: string;
    category: string;
    categories?: string[];
    tags?: string[];
    image_url: string;
    image_alt: string;
    external_url: string | null;
    applied_services?: string[];
    display_order: number;
    is_active: boolean;
    is_sample: boolean;
    created_at?: string;
}

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "hidden" | "sample";
type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

type Props<T extends BoardProject> = {
    projects: T[];
    loading: boolean;
    onEdit: (p: T) => void;
    onDelete: (id: string) => void;
    /** Persiste el orden. Devuelve si se guardo bien. */
    onReorder: (orderedIds: string[]) => Promise<boolean>;
};

const VIEW_KEY = "admin:portafolio:view";
/** Margen entre el ultimo cambio y el guardado: absorbe rafagas de clics. */
const SAVE_DELAY = 600;

const COLS: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

/* ── Preferencia de vista ───────────────────────────────────────────────────
   Va por useSyncExternalStore y no por un efecto que llame setState: en el
   servidor no hay localStorage, y leerlo en el primer render romperia la
   hidratacion. Ademas se sincroniza sola entre pestañas.
   ───────────────────────────────────────────────────────────────────────── */

type ViewPrefs = { mode: ViewMode; cols: number };

const DEFAULT_VIEW: ViewPrefs = { mode: "grid", cols: 3 };

let viewCache: { raw: string | null; value: ViewPrefs } = { raw: null, value: DEFAULT_VIEW };
const viewListeners = new Set<() => void>();

function readView(): ViewPrefs {
    let raw: string | null = null;
    try {
        raw = localStorage.getItem(VIEW_KEY);
    } catch {
        /* modo privado o storage bloqueado */
    }
    // getSnapshot tiene que devolver la misma referencia si nada cambio, o
    // React entra en loop de renders.
    if (raw === viewCache.raw) return viewCache.value;

    let value = DEFAULT_VIEW;
    try {
        const parsed = raw ? (JSON.parse(raw) as Partial<ViewPrefs>) : null;
        if (parsed) {
            value = {
                mode: parsed.mode === "list" ? "list" : "grid",
                cols: parsed.cols && COLS[parsed.cols] ? parsed.cols : DEFAULT_VIEW.cols,
            };
        }
    } catch {
        /* json corrupto: volvemos al default */
    }
    viewCache = { raw, value };
    return value;
}

function writeView(next: ViewPrefs) {
    const raw = JSON.stringify(next);
    try {
        localStorage.setItem(VIEW_KEY, raw);
    } catch {
        /* sin persistencia, pero la sesion sigue funcionando */
    }
    viewCache = { raw, value: next };
    for (const listener of viewListeners) listener();
}

function subscribeView(onChange: () => void) {
    viewListeners.add(onChange);
    window.addEventListener("storage", onChange);
    return () => {
        viewListeners.delete(onChange);
        window.removeEventListener("storage", onChange);
    };
}

function arrayMove<T>(list: T[], from: number, to: number): T[] {
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

export default function ProjectsBoard<T extends BoardProject>({
    projects,
    loading,
    onEdit,
    onDelete,
    onReorder,
}: Props<T>) {
    const view = useSyncExternalStore(subscribeView, readView, () => DEFAULT_VIEW);
    const { mode, cols } = view;
    const setMode = useCallback((next: ViewMode) => writeView({ ...readView(), mode: next }), []);
    const setCols = useCallback((next: number) => writeView({ mode: "grid", cols: next }), []);

    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [category, setCategory] = useState("all");

    // Orden optimista mientras el guardado esta en vuelo. Null = mandan los datos
    // del servidor.
    const [localOrder, setLocalOrder] = useState<string[] | null>(null);
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [undoStack, setUndoStack] = useState<string[][]>([]);

    const pending = useRef<string[] | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Orden efectivo y lista visible ─────────────────────────────────────
    const ordered = useMemo(() => {
        if (!localOrder) return projects;
        const byId = new Map(projects.map((p) => [p.id, p]));
        const mapped = localOrder.map((id) => byId.get(id)).filter((p): p is T => !!p);
        // Si llego un proyecto nuevo mientras habia un orden local, lo colgamos
        // al final en vez de hacerlo desaparecer.
        const seen = new Set(localOrder);
        return [...mapped, ...projects.filter((p) => !seen.has(p.id))];
    }, [projects, localOrder]);

    const allCategories = useMemo(() => {
        const set = new Set<string>();
        for (const p of projects) {
            for (const c of p.categories?.length ? p.categories : [p.category]) {
                if (c) set.add(c);
            }
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
    }, [projects]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return ordered.filter((p) => {
            if (status === "active" && !p.is_active) return false;
            if (status === "hidden" && p.is_active) return false;
            if (status === "sample" && !p.is_sample) return false;
            if (category !== "all") {
                const cats = p.categories?.length ? p.categories : [p.category];
                if (!cats.includes(category)) return false;
            }
            if (!q) return true;
            const haystack = [p.title, p.category, ...(p.categories || []), ...(p.tags || [])]
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [ordered, query, status, category]);

    const positionById = useMemo(() => {
        const map = new Map<string, number>();
        ordered.forEach((p, i) => map.set(p.id, i + 1));
        return map;
    }, [ordered]);

    const isFiltered = query.trim() !== "" || status !== "all" || category !== "all";

    // ── Guardado con debounce ──────────────────────────────────────────────
    // `onReorder` cambia de identidad con cada refetch. Si `flush` dependiera de
    // el, el efecto de limpieza se re-ejecutaria a cada rato y mandaria el orden
    // antes de tiempo, justo lo que el debounce viene a evitar.
    const onReorderRef = useRef(onReorder);
    useEffect(() => {
        onReorderRef.current = onReorder;
    });

    const flush = useCallback(async () => {
        const next = pending.current;
        if (!next) return;
        pending.current = null;
        setSaveState("saving");
        const ok = await onReorderRef.current(next);
        setLocalOrder(null);
        setSaveState(ok ? "saved" : "error");
        if (ok) {
            if (savedTimer.current) clearTimeout(savedTimer.current);
            savedTimer.current = setTimeout(() => setSaveState("idle"), 2200);
        }
    }, []);

    const commit = useCallback(
        (nextIds: string[], record = true) => {
            if (record) {
                const before = ordered.map((p) => p.id);
                setUndoStack((stack) => [...stack.slice(-19), before]);
            }
            setLocalOrder(nextIds);
            setSaveState("pending");
            pending.current = nextIds;
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(flush, SAVE_DELAY);
        },
        [ordered, flush]
    );

    // Si se va de la pagina con un orden sin mandar, lo mandamos ya.
    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
            if (savedTimer.current) clearTimeout(savedTimer.current);
            if (pending.current) void flush();
        };
    }, [flush]);

    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => {
            if (!pending.current) return;
            e.preventDefault();
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, []);

    /**
     * Traduce un orden de la lista visible al orden global.
     *
     * Con un filtro puesto, los proyectos visibles ocupan un conjunto de
     * posiciones globales. Reordenarlos entre si permuta esas posiciones y deja
     * todo lo filtrado donde estaba. Asi arrastrar sigue teniendo sentido aunque
     * haya una busqueda activa.
     */
    const applyVisibleOrder = useCallback(
        (visibleIds: string[]) => {
            const globalIds = ordered.map((p) => p.id);
            const inView = new Set(visibleIds);
            const slots: number[] = [];
            globalIds.forEach((id, i) => {
                if (inView.has(id)) slots.push(i);
            });
            const next = globalIds.slice();
            slots.forEach((slot, i) => {
                next[slot] = visibleIds[i];
            });
            commit(next);
        },
        [ordered, commit]
    );

    const moveVisible = useCallback(
        (id: string, to: number) => {
            const visibleIds = visible.map((p) => p.id);
            const from = visibleIds.indexOf(id);
            const clamped = Math.max(0, Math.min(visibleIds.length - 1, to));
            if (from < 0 || from === clamped) return;
            applyVisibleOrder(arrayMove(visibleIds, from, clamped));
        },
        [visible, applyVisibleOrder]
    );

    const applyPreset = useCallback(
        (preset: "az" | "za" | "category" | "active" | "newest" | "reverse") => {
            const list = visible.slice();
            const byTitle = (a: T, b: T) =>
                a.title.localeCompare(b.title, "es", { sensitivity: "base" });

            switch (preset) {
                case "az":
                    list.sort(byTitle);
                    break;
                case "za":
                    list.sort((a, b) => byTitle(b, a));
                    break;
                case "category":
                    list.sort((a, b) => a.category.localeCompare(b.category, "es") || byTitle(a, b));
                    break;
                case "active":
                    list.sort((a, b) => Number(b.is_active) - Number(a.is_active));
                    break;
                case "newest":
                    list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
                    break;
                case "reverse":
                    list.reverse();
                    break;
            }
            applyVisibleOrder(list.map((p) => p.id));
        },
        [visible, applyVisibleOrder]
    );

    const undo = useCallback(() => {
        const prev = undoStack[undoStack.length - 1];
        if (!prev) return;
        setUndoStack((stack) => stack.slice(0, -1));
        commit(prev, false);
    }, [undoStack, commit]);

    const getId = useCallback((p: T) => p.id, []);

    const clearFilters = () => {
        setQuery("");
        setStatus("all");
        setCategory("all");
    };

    // ── Render ─────────────────────────────────────────────────────────────
    const gridClass =
        mode === "list"
            ? "flex flex-col gap-2"
            : `grid ${COLS[cols]} gap-4 items-start`;

    return (
        <div className="space-y-4">
            <Toolbar
                mode={mode}
                setMode={setMode}
                cols={cols}
                setCols={setCols}
                query={query}
                setQuery={setQuery}
                status={status}
                setStatus={setStatus}
                category={category}
                setCategory={setCategory}
                categories={allCategories}
                counts={{ visible: visible.length, total: projects.length }}
                saveState={saveState}
                canUndo={undoStack.length > 0}
                onUndo={undo}
                onPreset={applyPreset}
                isFiltered={isFiltered}
                onClearFilters={clearFilters}
            />

            {loading ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : visible.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                    <p className="text-gray-500">
                        {projects.length === 0
                            ? "No hay proyectos en el portafolio aún."
                            : "Ningún proyecto coincide con el filtro."}
                    </p>
                    {isFiltered && projects.length > 0 && (
                        <button
                            onClick={clearFilters}
                            className="mt-3 text-primary font-bold text-sm hover:text-white transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            ) : (
                <SortableGrid
                    // Remonta al cambiar de vista: sin esto, framer-motion anima
                    // la transicion entre tarjeta y fila, que son formas muy
                    // distintas, y el cambio se ve como un amasijo. El cambio de
                    // columnas si conserva la animacion, que ahi ayuda a leerlo.
                    key={mode}
                    items={visible}
                    getId={getId}
                    onReorder={applyVisibleOrder}
                    className={gridClass}
                >
                    {(p, ctx) =>
                        mode === "list" ? (
                            <ListRow
                                p={p}
                                ctx={ctx}
                                position={positionById.get(p.id) ?? 0}
                                total={visible.length}
                                onMove={moveVisible}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ) : (
                            <GridCard
                                p={p}
                                ctx={ctx}
                                position={positionById.get(p.id) ?? 0}
                                total={visible.length}
                                onMove={moveVisible}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        )
                    }
                </SortableGrid>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Toolbar
   ═══════════════════════════════════════════════════════════════════════════ */

const PRESETS: { key: "az" | "za" | "category" | "active" | "newest" | "reverse"; label: string; icon: string }[] = [
    { key: "az", label: "A → Z", icon: "sort_by_alpha" },
    { key: "za", label: "Z → A", icon: "sort_by_alpha" },
    { key: "category", label: "Por categoría", icon: "category" },
    { key: "active", label: "Activos primero", icon: "visibility" },
    { key: "newest", label: "Más nuevos", icon: "schedule" },
    { key: "reverse", label: "Invertir", icon: "swap_vert" },
];

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Activos" },
    { key: "hidden", label: "Ocultos" },
    { key: "sample", label: "Muestras" },
];

function Toolbar(props: {
    mode: ViewMode;
    setMode: (m: ViewMode) => void;
    cols: number;
    setCols: (c: number) => void;
    query: string;
    setQuery: (q: string) => void;
    status: StatusFilter;
    setStatus: (s: StatusFilter) => void;
    category: string;
    setCategory: (c: string) => void;
    categories: string[];
    counts: { visible: number; total: number };
    saveState: SaveState;
    canUndo: boolean;
    onUndo: () => void;
    onPreset: (p: "az" | "za" | "category" | "active" | "newest" | "reverse") => void;
    isFiltered: boolean;
    onClearFilters: () => void;
}) {
    const {
        mode, setMode, cols, setCols, query, setQuery, status, setStatus,
        category, setCategory, categories, counts, saveState, canUndo, onUndo,
        onPreset, isFiltered, onClearFilters,
    } = props;

    return (
        <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-3 space-y-3 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#1e1530]/95">
            {/* Fila 1 — buscar, estado, densidad */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                    <span
                        aria-hidden="true"
                        className="material-icons absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-[18px]"
                    >
                        search
                    </span>
                    <input
                        className="admin-input admin-input-search w-full"
                        placeholder="Buscar por título, categoría o tag..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            aria-label="Limpiar búsqueda"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                        >
                            <span aria-hidden="true" className="material-icons text-[18px]">close</span>
                        </button>
                    )}
                </div>

                <div className="flex rounded-sm border-2 border-white/10 overflow-hidden">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatus(tab.key)}
                            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                                status === tab.key
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {categories.length > 1 && (
                    <select
                        className="admin-input py-2"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        aria-label="Filtrar por categoría"
                    >
                        <option value="all">Todas las categorías</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                )}

                {/* Densidad de la grilla */}
                <div className="flex rounded-sm border-2 border-white/10 overflow-hidden ml-auto">
                    {[2, 3, 4].map((n) => (
                        <button
                            key={n}
                            onClick={() => setCols(n)}
                            title={`${n} columnas`}
                            aria-label={`Ver en ${n} columnas`}
                            aria-pressed={mode === "grid" && cols === n}
                            className={`px-2.5 py-2 text-xs font-black transition-colors ${
                                mode === "grid" && cols === n
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <span className="flex items-center gap-1">
                                <span aria-hidden="true" className="material-icons text-[16px]">grid_view</span>
                                {n}
                            </span>
                        </button>
                    ))}
                    <button
                        onClick={() => setMode("list")}
                        title="Vista de lista compacta"
                        aria-label="Vista de lista compacta"
                        aria-pressed={mode === "list"}
                        className={`px-2.5 py-2 transition-colors ${
                            mode === "list"
                                ? "bg-primary text-white"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                        <span aria-hidden="true" className="material-icons text-[16px]">view_list</span>
                    </button>
                </div>
            </div>

            {/* Fila 2 — presets, contador, estado del guardado */}
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">
                    Ordenar
                </span>
                {PRESETS.map((preset) => (
                    <button
                        key={preset.key}
                        onClick={() => onPreset(preset.key)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-white/5 border border-white/10 rounded-sm hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-colors"
                    >
                        <span
                            aria-hidden="true"
                            className={`material-icons text-[14px] ${preset.key === "za" ? "scale-y-[-1]" : ""}`}
                        >
                            {preset.icon}
                        </span>
                        {preset.label}
                    </button>
                ))}

                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                >
                    <span aria-hidden="true" className="material-icons text-[14px]">undo</span>
                    Deshacer
                </button>

                <div className="ml-auto flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 font-mono">
                        {isFiltered ? `${counts.visible} de ${counts.total}` : `${counts.total} proyectos`}
                    </span>
                    {isFiltered && (
                        <button
                            onClick={onClearFilters}
                            className="text-[11px] font-bold text-gray-400 hover:text-white transition-colors underline underline-offset-2"
                        >
                            Limpiar filtros
                        </button>
                    )}
                    <SaveBadge state={saveState} />
                </div>
            </div>

            {isFiltered && (
                <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                    <span aria-hidden="true" className="material-icons text-[13px] text-primary">info</span>
                    Con filtro activo reordenás solo entre los proyectos visibles; el resto queda en su lugar.
                </p>
            )}
        </div>
    );
}

function SaveBadge({ state }: { state: SaveState }) {
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

/* ═══════════════════════════════════════════════════════════════════════════
   Botonera de movimiento rapido
   ═══════════════════════════════════════════════════════════════════════════ */

function MoveButtons({
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
        <div className="flex items-center gap-1">
            {btn("Mover al principio", "keyboard_double_arrow_up", 0, first)}
            {btn("Subir una posición", "keyboard_arrow_up", index - 1, first)}
            {btn("Bajar una posición", "keyboard_arrow_down", index + 1, last)}
            {btn("Mover al final", "keyboard_double_arrow_down", total - 1, last)}
        </div>
    );
}

function DragHandle({ ctx, compact = false }: { ctx: SortableRenderContext; compact?: boolean }) {
    return (
        <span
            {...ctx.handleProps}
            className={`flex items-center justify-center rounded-sm border-2 border-black bg-white/90 text-black shadow-neobrutalism-sm hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                compact ? "w-6 h-7" : "w-7 h-7"
            }`}
        >
            <span aria-hidden="true" className="material-icons text-[18px]">drag_indicator</span>
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tarjeta de grilla — alto fijo: SortableGrid mide los casilleros una sola vez
   y eso solo es valido si todas las tarjetas miden igual.
   ═══════════════════════════════════════════════════════════════════════════ */

type CardProps<T extends BoardProject> = {
    p: T;
    ctx: SortableRenderContext;
    position: number;
    total: number;
    onMove: (id: string, to: number) => void;
    onEdit: (p: T) => void;
    onDelete: (id: string) => void;
};

function GridCard<T extends BoardProject>({ p, ctx, position, total, onMove, onEdit, onDelete }: CardProps<T>) {
    return (
        <div
            className={`h-[19.5rem] bg-[#1e1530] border-2 rounded-sm overflow-hidden flex flex-col transition-colors ${
                ctx.isDragging
                    ? "border-primary shadow-neobrutalism-primary"
                    : "border-white/10 hover:border-primary/40"
            }`}
        >
            {/* Imagen + chrome de orden */}
            <div className="relative h-36 shrink-0 bg-black/40 border-b border-white/5">
                {p.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element --
                       Igual que en el resto del admin: image_url es texto libre y
                       next/image tira la pagina abajo si el host no esta en
                       remotePatterns. Vista detras de login, sin LCP que cuidar. */
                    <img
                        src={p.image_url}
                        alt={p.image_alt || p.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <span className="text-gray-500 font-mono text-xs">Sin imagen</span>
                    </div>
                )}

                {!p.is_active && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-hot-coral text-white font-bold px-3 py-1 rounded text-xs shadow-neobrutalism-sm">
                            OCULTO
                        </span>
                    </div>
                )}

                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <DragHandle ctx={ctx} />
                    <span className="bg-black/70 text-white font-black text-[11px] px-2 py-1 rounded-sm border border-white/20 tabular-nums">
                        #{position}
                    </span>
                </div>

                {p.is_sample && (
                    <span className="absolute top-2 right-2 z-10 bg-[#F2FA5A] text-black font-black px-2 py-0.5 rounded-sm text-[10px] shadow-neobrutalism-sm border border-black rotate-3">
                        MUESTRA
                    </span>
                )}
            </div>

            {/* Cuerpo */}
            <div className="p-3 flex-1 flex flex-col min-h-0">
                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">{p.title}</h3>
                <p className="text-primary text-[10px] font-bold uppercase tracking-wider mt-1 truncate">
                    {(p.categories?.length ? p.categories : [p.category]).filter(Boolean).join(" · ") || "Sin categoría"}
                </p>

                <div className="flex gap-1 flex-wrap mt-2 overflow-hidden max-h-[1.5rem]">
                    {(p.tags || []).slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="bg-white/5 border border-white/10 text-gray-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                    {(p.tags?.length || 0) > 3 && (
                        <span className="text-[9px] text-gray-600 font-bold px-1 py-0.5">
                            +{(p.tags?.length || 0) - 3}
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <MoveButtons id={p.id} index={ctx.index} total={total} onMove={onMove} compact />
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onEdit(p)}
                            className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-sm text-xs font-bold transition-colors"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(p.id)}
                            title="Eliminar"
                            aria-label={`Eliminar ${p.title}`}
                            className="text-hot-coral hover:text-white w-6 h-6 flex items-center justify-center transition-colors"
                        >
                            <span aria-hidden="true" className="material-icons text-[16px]">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Fila de lista compacta — para acomodar muchos de una sentada
   ═══════════════════════════════════════════════════════════════════════════ */

function ListRow<T extends BoardProject>({ p, ctx, position, total, onMove, onEdit, onDelete }: CardProps<T>) {
    return (
        <div
            className={`h-16 bg-[#1e1530] border-2 rounded-sm flex items-center gap-3 px-3 transition-colors ${
                ctx.isDragging
                    ? "border-primary shadow-neobrutalism-primary"
                    : "border-white/10 hover:border-primary/40"
            }`}
        >
            <DragHandle ctx={ctx} compact />
            <span className="text-white/50 font-black text-xs tabular-nums w-8 shrink-0">#{position}</span>

            <div className="w-16 h-11 shrink-0 bg-black/40 rounded-sm overflow-hidden border border-white/10 relative">
                {p.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- ver nota en GridCard */
                    <img
                        src={p.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span aria-hidden="true" className="material-icons text-white/20 text-[16px]">image</span>
                    </div>
                )}
                {!p.is_active && <div className="absolute inset-0 bg-black/70" />}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-sm truncate">{p.title}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
                    {(p.categories?.length ? p.categories : [p.category]).filter(Boolean).join(" · ") || "Sin categoría"}
                </p>
            </div>

            <div className="hidden md:flex items-center gap-1.5 shrink-0">
                {!p.is_active && (
                    <span className="bg-hot-coral/20 text-hot-coral border border-hot-coral/30 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                        Oculto
                    </span>
                )}
                {p.is_sample && (
                    <span className="bg-[#F2FA5A]/20 text-[#F2FA5A] border border-[#F2FA5A]/30 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                        Muestra
                    </span>
                )}
                {p.external_url && (
                    <span
                        aria-hidden="true"
                        title="Tiene sitio vinculado"
                        className="material-icons text-secondary text-[14px]"
                    >
                        language
                    </span>
                )}
            </div>

            <MoveButtons id={p.id} index={ctx.index} total={total} onMove={onMove} compact />

            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={() => onEdit(p)}
                    className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-sm text-xs font-bold transition-colors"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(p.id)}
                    title="Eliminar"
                    aria-label={`Eliminar ${p.title}`}
                    className="text-hot-coral hover:text-white w-6 h-6 flex items-center justify-center transition-colors"
                >
                    <span aria-hidden="true" className="material-icons text-[16px]">delete</span>
                </button>
            </div>
        </div>
    );
}
