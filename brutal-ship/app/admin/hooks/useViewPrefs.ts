"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ── Preferencia de vista de un listado del admin ──────────────────────────
   Va por useSyncExternalStore y no por un efecto que llame setState: en el
   servidor no hay localStorage, y leerlo en el primer render romperia la
   hidratacion. Ademas se sincroniza sola entre pestañas.
   ───────────────────────────────────────────────────────────────────────── */

export type ViewMode = "grid" | "list";
export type ViewPrefs = { mode: ViewMode; cols: number };

export const COLUMN_CHOICES = [2, 3, 4] as const;

export const COLS_CLASS: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const DEFAULT_VIEW: ViewPrefs = { mode: "grid", cols: 3 };

// Una entrada por clave: portafolio y precios guardan su vista por separado.
// getSnapshot tiene que devolver la misma referencia si nada cambio, o React
// entra en loop de renders; por eso el cache recuerda el texto crudo.
const cache = new Map<string, { raw: string | null; value: ViewPrefs }>();
const listeners = new Set<() => void>();

function read(key: string): ViewPrefs {
    let raw: string | null = null;
    try {
        raw = localStorage.getItem(key);
    } catch {
        /* modo privado o storage bloqueado */
    }
    const hit = cache.get(key);
    if (hit && hit.raw === raw) return hit.value;

    let value = DEFAULT_VIEW;
    try {
        const parsed = raw ? (JSON.parse(raw) as Partial<ViewPrefs>) : null;
        if (parsed) {
            value = {
                mode: parsed.mode === "list" ? "list" : "grid",
                cols: parsed.cols && COLS_CLASS[parsed.cols] ? parsed.cols : DEFAULT_VIEW.cols,
            };
        }
    } catch {
        /* json corrupto: volvemos al default */
    }
    cache.set(key, { raw, value });
    return value;
}

function write(key: string, next: ViewPrefs) {
    const raw = JSON.stringify(next);
    try {
        localStorage.setItem(key, raw);
    } catch {
        /* sin persistencia, pero la sesion sigue funcionando */
    }
    cache.set(key, { raw, value: next });
    for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
    listeners.add(onChange);
    window.addEventListener("storage", onChange);
    return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onChange);
    };
}

export function useViewPrefs(storageKey: string) {
    const view = useSyncExternalStore(
        subscribe,
        () => read(storageKey),
        () => DEFAULT_VIEW
    );
    const setMode = useCallback(
        (mode: ViewMode) => write(storageKey, { ...read(storageKey), mode }),
        [storageKey]
    );
    const setCols = useCallback(
        (cols: number) => write(storageKey, { mode: "grid", cols }),
        [storageKey]
    );
    return { ...view, setMode, setCols };
}
