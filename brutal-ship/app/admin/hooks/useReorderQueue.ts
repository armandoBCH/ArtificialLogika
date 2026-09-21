"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

/** Margen entre el ultimo cambio y el guardado: absorbe rafagas de clics. */
const SAVE_DELAY = 600;
const UNDO_LIMIT = 20;

export function arrayMove<T>(list: T[], from: number, to: number): T[] {
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

/**
 * La mecanica de reordenar un listado del admin, sin la parte visual.
 *
 * Mantiene un orden optimista mientras el guardado esta en vuelo, junta los
 * cambios seguidos en un solo request (el rate limit del admin es de 30 por
 * minuto), lleva el historial para deshacer y avisa si te vas de la pagina con
 * algo sin mandar. Lo usan el portafolio y los precios.
 */
export function useReorderQueue<T extends { id: string }>(
    items: T[],
    onReorder: (orderedIds: string[]) => Promise<boolean>
) {
    // Null = mandan los datos del servidor.
    const [localOrder, setLocalOrder] = useState<string[] | null>(null);
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [undoStack, setUndoStack] = useState<string[][]>([]);

    const pending = useRef<string[] | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const ordered = useMemo(() => {
        if (!localOrder) return items;
        const byId = new Map(items.map((item) => [item.id, item]));
        const mapped = localOrder.map((id) => byId.get(id)).filter((item): item is T => !!item);
        // Si llego un item nuevo mientras habia un orden local, lo colgamos al
        // final en vez de hacerlo desaparecer.
        const seen = new Set(localOrder);
        return [...mapped, ...items.filter((item) => !seen.has(item.id))];
    }, [items, localOrder]);

    const positionById = useMemo(() => {
        const map = new Map<string, number>();
        ordered.forEach((item, i) => map.set(item.id, i + 1));
        return map;
    }, [ordered]);

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
                const before = ordered.map((item) => item.id);
                setUndoStack((stack) => [...stack.slice(-(UNDO_LIMIT - 1)), before]);
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
     * Con un filtro puesto, los items visibles ocupan un conjunto de posiciones
     * globales. Reordenarlos entre si permuta esas posiciones y deja todo lo
     * filtrado donde estaba. Sin filtro, visible y global son lo mismo.
     */
    const applyVisibleOrder = useCallback(
        (visibleIds: string[]) => {
            const globalIds = ordered.map((item) => item.id);
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

    /** Mueve un item a la posicion `to` dentro de la lista visible. */
    const moveWithin = useCallback(
        (visibleIds: string[], id: string, to: number) => {
            const from = visibleIds.indexOf(id);
            const clamped = Math.max(0, Math.min(visibleIds.length - 1, to));
            if (from < 0 || from === clamped) return;
            applyVisibleOrder(arrayMove(visibleIds, from, clamped));
        },
        [applyVisibleOrder]
    );

    const undo = useCallback(() => {
        const prev = undoStack[undoStack.length - 1];
        if (!prev) return;
        setUndoStack((stack) => stack.slice(0, -1));
        commit(prev, false);
    }, [undoStack, commit]);

    return {
        ordered,
        positionById,
        saveState,
        canUndo: undoStack.length > 0,
        undo,
        applyVisibleOrder,
        moveWithin,
    };
}
