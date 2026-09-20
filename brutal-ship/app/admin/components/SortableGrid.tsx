"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Grilla reordenable por arrastre.
 *
 * El truco central: al empezar el arrastre medimos una sola vez la posicion de
 * cada casillero y no la volvemos a tocar. Las tarjetas cambian de casillero,
 * los casilleros no se mueven. Eso hace que el calculo de "sobre cual estoy"
 * no dependa de elementos que en ese momento estan animandose, que es de donde
 * salen los saltos y el parpadeo en las implementaciones que remiden en vivo.
 *
 * Requisito que impone: las tarjetas tienen que ser todas del mismo alto. Si no,
 * reordenar cambia el alto de las filas y los casilleros medidos quedan viejos.
 */

type Slot = { left: number; top: number; cx: number; cy: number };

export type DragHandleProps = {
    onPointerDown: (e: React.PointerEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    style: React.CSSProperties;
    tabIndex: number;
    role: string;
    "aria-label": string;
    "aria-disabled"?: boolean;
};

export type SortableRenderContext = {
    index: number;
    /** Esta tarjeta es la que se esta arrastrando. */
    isDragging: boolean;
    /** Hay un arrastre en curso (en esta tarjeta o en otra). */
    isDragActive: boolean;
    handleProps: DragHandleProps;
};

type Props<T> = {
    items: T[];
    getId: (item: T) => string;
    /** Recibe los ids en el orden nuevo. Solo se llama si el orden cambio. */
    onReorder: (orderedIds: string[]) => void;
    disabled?: boolean;
    /** Clases del contenedor: define si es grilla de 2, 3, 4 o lista. */
    className?: string;
    children: (item: T, ctx: SortableRenderContext) => React.ReactNode;
};

function arrayMove<T>(list: T[], from: number, to: number): T[] {
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

/** Margen del borde de la ventana donde el arrastre empieza a scrollear. */
const EDGE = 110;
const MAX_SCROLL_SPEED = 22;

export default function SortableGrid<T>({
    items,
    getId,
    onReorder,
    disabled = false,
    className = "",
    children,
}: Props<T>) {
    const reduceMotion = useReducedMotion();

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOrder, setDragOrder] = useState<string[] | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{
        id: string;
        grabX: number; // distancia del puntero al borde izquierdo de la tarjeta
        grabY: number;
        slots: Slot[];
        order: string[];
        clientX: number;
        clientY: number;
    } | null>(null);
    const rafId = useRef<number | null>(null);

    const ids = dragOrder ?? items.map(getId);
    const byId = new Map(items.map((item) => [getId(item), item]));
    const ordered = ids.map((id) => byId.get(id)).filter((v): v is T => v !== undefined);

    /** Recalcula posicion flotante y casillero destino a partir del puntero. */
    const applyDrag = useCallback(() => {
        const state = drag.current;
        if (!state) return;

        const pageX = state.clientX + window.scrollX;
        const pageY = state.clientY + window.scrollY;

        // Casillero mas cercano al puntero. Como los casilleros estan quietos,
        // esto no puede oscilar.
        let target = 0;
        let best = Infinity;
        for (let i = 0; i < state.slots.length; i++) {
            const s = state.slots[i];
            const d = (s.cx - pageX) ** 2 + (s.cy - pageY) ** 2;
            if (d < best) {
                best = d;
                target = i;
            }
        }

        const current = state.order.indexOf(state.id);
        if (target !== current && target >= 0) {
            state.order = arrayMove(state.order, current, target);
            setDragOrder(state.order);
        }

        const slot = state.slots[state.order.indexOf(state.id)];
        if (slot) {
            setOffset({ x: pageX - state.grabX - slot.left, y: pageY - state.grabY - slot.top });
        }
    }, []);

    const stopLoop = useCallback(() => {
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
    }, []);

    /** Auto-scroll cuando el puntero se acerca al borde de la ventana. */
    const startLoop = useCallback(() => {
        // Declaracion, no const: el tick se agenda a si mismo y asi no hay
        // referencia a un valor todavia sin declarar.
        function tick() {
            const state = drag.current;
            if (!state) return;

            let dy = 0;
            if (state.clientY < EDGE) {
                dy = -((EDGE - state.clientY) / EDGE) * MAX_SCROLL_SPEED;
            } else if (state.clientY > window.innerHeight - EDGE) {
                dy = ((state.clientY - (window.innerHeight - EDGE)) / EDGE) * MAX_SCROLL_SPEED;
            }

            if (dy !== 0) {
                window.scrollBy(0, dy);
                applyDrag();
            }

            rafId.current = requestAnimationFrame(tick);
        }
        rafId.current = requestAnimationFrame(tick);
    }, [applyDrag]);

    const endDrag = useCallback(
        (commit: boolean) => {
            const state = drag.current;
            drag.current = null;
            stopLoop();
            setDraggingId(null);
            setOffset({ x: 0, y: 0 });
            document.body.style.userSelect = "";
            document.body.style.cursor = "";

            if (!state) return;

            const before = items.map(getId);
            const changed = state.order.some((id, i) => id !== before[i]);
            if (commit && changed) onReorder(state.order);

            // Va en el mismo handler que `onReorder` a proposito: React junta las
            // dos actualizaciones en un solo render, asi que la tarjeta nunca
            // pasa por el orden viejo antes de que el padre aplique el nuevo.
            setDragOrder(null);
        },
        [items, getId, onReorder, stopLoop]
    );

    // Los listeners viven en window para que el arrastre sobreviva salirse de la
    // tarjeta, y se montan solo mientras hay un arrastre activo.
    useEffect(() => {
        if (!draggingId) return;

        const onMove = (e: PointerEvent) => {
            if (!drag.current) return;
            e.preventDefault();
            drag.current.clientX = e.clientX;
            drag.current.clientY = e.clientY;
            applyDrag();
        };
        const onUp = () => endDrag(true);
        const onCancel = () => endDrag(false);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") endDrag(false);
        };

        window.addEventListener("pointermove", onMove, { passive: false });
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onCancel);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onCancel);
            window.removeEventListener("keydown", onKey);
        };
    }, [draggingId, applyDrag, endDrag]);

    useEffect(() => stopLoop, [stopLoop]);

    const startDrag = useCallback(
        (id: string, e: React.PointerEvent) => {
            if (disabled || e.button !== 0) return;
            const container = containerRef.current;
            if (!container) return;

            const byNodeId = new Map<string, DOMRect>();
            for (const node of container.querySelectorAll<HTMLElement>(":scope > [data-sortable-id]")) {
                const nodeId = node.dataset.sortableId;
                if (nodeId) byNodeId.set(nodeId, node.getBoundingClientRect());
            }

            const order = items.map(getId);
            const rects: Slot[] = [];
            for (const itemId of order) {
                const r = byNodeId.get(itemId);
                if (!r) return; // medicion incompleta: no arrancamos a ciegas
                rects.push({
                    left: r.left + window.scrollX,
                    top: r.top + window.scrollY,
                    cx: r.left + r.width / 2 + window.scrollX,
                    cy: r.top + r.height / 2 + window.scrollY,
                });
            }

            const self = byNodeId.get(id);
            if (!self) return;
            e.preventDefault();

            drag.current = {
                id,
                grabX: e.clientX - self.left,
                grabY: e.clientY - self.top,
                slots: rects,
                order,
                clientX: e.clientX,
                clientY: e.clientY,
            };

            document.body.style.userSelect = "none";
            document.body.style.cursor = "grabbing";
            setDragOrder(order);
            setDraggingId(id);
            setOffset({ x: 0, y: 0 });
            startLoop();
        },
        [disabled, items, getId, startLoop]
    );

    /** Mover con teclado: el arrastre no puede ser la unica via. */
    const moveBy = useCallback(
        (id: string, to: number) => {
            const order = items.map(getId);
            const from = order.indexOf(id);
            const clamped = Math.max(0, Math.min(order.length - 1, to));
            if (from < 0 || from === clamped) return;
            onReorder(arrayMove(order, from, clamped));
        },
        [items, getId, onReorder]
    );

    const onHandleKey = useCallback(
        (id: string, e: React.KeyboardEvent) => {
            if (disabled) return;
            const order = items.map(getId);
            const i = order.indexOf(id);
            const keys: Record<string, number> = {
                ArrowLeft: i - 1,
                ArrowUp: i - 1,
                ArrowRight: i + 1,
                ArrowDown: i + 1,
                Home: 0,
                End: order.length - 1,
            };
            if (!(e.key in keys)) return;
            e.preventDefault();
            moveBy(id, keys[e.key]);
        },
        [disabled, items, getId, moveBy]
    );

    return (
        <div ref={containerRef} className={className}>
            {ordered.map((item, index) => {
                const id = getId(item);
                return (
                    <SortableItem
                        key={id}
                        id={id}
                        item={item}
                        index={index}
                        total={ordered.length}
                        isDragging={id === draggingId}
                        isDragActive={draggingId !== null}
                        offset={offset}
                        animateLayout={!reduceMotion}
                        disabled={disabled}
                        onStart={startDrag}
                        onKey={onHandleKey}
                    >
                        {children}
                    </SortableItem>
                );
            })}
        </div>
    );
}

/**
 * Una tarjeta.
 *
 * Existe como componente aparte y no como un `children(item, ctx)` suelto dentro
 * del map porque llamar al render prop durante el render hace que el compilador
 * siga los handlers hasta los refs que tocan. Como componente, los handlers
 * entran por props y quedan donde tienen que quedar: fuera del render.
 */
function SortableItem<T>({
    id,
    item,
    index,
    total,
    isDragging,
    isDragActive,
    offset,
    animateLayout,
    disabled,
    onStart,
    onKey,
    children,
}: {
    id: string;
    item: T;
    index: number;
    total: number;
    isDragging: boolean;
    isDragActive: boolean;
    offset: { x: number; y: number };
    animateLayout: boolean;
    disabled: boolean;
    onStart: (id: string, e: React.PointerEvent) => void;
    onKey: (id: string, e: React.KeyboardEvent) => void;
    children: (item: T, ctx: SortableRenderContext) => React.ReactNode;
}) {
    return (
        <motion.div
            data-sortable-id={id}
            // La tarjeta arrastrada no participa del layout animado: su posicion
            // la manda el puntero, no el proyector de framer-motion.
            layout={!isDragging && animateLayout}
            transition={{ type: "spring", stiffness: 750, damping: 48, mass: 0.6 }}
            style={{
                x: isDragging ? offset.x : 0,
                y: isDragging ? offset.y : 0,
                zIndex: isDragging ? 40 : 1,
                position: "relative",
            }}
            animate={isDragging ? { scale: 1.035, rotate: -1.2 } : { scale: 1, rotate: 0 }}
        >
            {children(item, {
                index,
                isDragging,
                isDragActive,
                handleProps: {
                    onPointerDown: (e) => onStart(id, e),
                    onKeyDown: (e) => onKey(id, e),
                    style: {
                        touchAction: "none",
                        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
                    },
                    tabIndex: disabled ? -1 : 0,
                    role: "button",
                    "aria-label": `Mover, posición ${index + 1} de ${total}. Usá las flechas para reordenar.`,
                    "aria-disabled": disabled || undefined,
                },
            })}
        </motion.div>
    );
}
