"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "logika-theme";
const EVENT = "logika-themechange";

/**
 * El estado real del tema vive en la clase `.dark` del <html>, que el
 * script anti-FOUC de layout.tsx aplica antes del primer paint.
 *
 * Se lee con useSyncExternalStore en vez de useState + useEffect: el DOM
 * es la fuente de verdad y este hook está hecho exactamente para eso,
 * sin el setState dentro de un efecto que dispara un render en cascada.
 */
function subscribe(onChange: () => void) {
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
}

function getSnapshot() {
    return document.documentElement.classList.contains("dark");
}

// En el servidor no hay DOM: se asume claro y el script corrige antes de pintar.
function getServerSnapshot() {
    return false;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const toggle = useCallback(() => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Modo privado o storage bloqueado: el tema funciona en esta
            // sesión, sólo no se recuerda para la próxima.
        }
        window.dispatchEvent(new Event(EVENT));
    }, []);

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            aria-pressed={isDark}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            suppressHydrationWarning
            className={`w-11 h-11 shrink-0 flex items-center justify-center border-2 border-black dark:border-white bg-white dark:bg-night-raised text-ink-black dark:text-white rounded-xl shadow-elev-1 hover:shadow-elev-0 hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${className}`}
        >
            {/* SVG inline en vez de ligadura de Material Icons: no depende de
                que cargue una fuente externa ni se lee como texto suelto. */}
            <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {isDark ? (
                    <>
                        <circle cx="12" cy="12" r="4.5" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </>
                ) : (
                    <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.8 6.8 0 0 0 9.5 9.5Z" />
                )}
            </svg>
        </button>
    );
}
