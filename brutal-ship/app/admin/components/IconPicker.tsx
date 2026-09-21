"use client";

import { useEffect, useMemo, useState } from "react";
import {
    FONDOS_ICONO,
    GRUPOS_ICONOS,
    iconoExiste,
    normalizarNombreIcono,
    textoSobreFondo,
    type GrupoIconos,
} from "@/lib/iconos-plan";

type Props = {
    icon: string;
    bg: string;
    /** Texto de la caracteristica, para la vista previa. */
    text: string;
    highlighted: boolean;
    /** Iconos que ya aparecen en algun plan: van primero. */
    usados: string[];
    onChange: (cambios: { icon?: string; icon_bg?: string }) => void;
    onClose: () => void;
};

/**
 * Selector de icono y color de una caracteristica de plan.
 *
 * Se monta y desmonta con cada apertura, asi que la busqueda arranca limpia
 * sin tener que resetearla a mano.
 */
export default function IconPicker({ icon, bg, text, highlighted, usados, onChange, onClose }: Props) {
    const [query, setQuery] = useState("");
    const [custom, setCustom] = useState("");
    const [customError, setCustomError] = useState("");

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const grupos = useMemo<GrupoIconos[]>(() => {
        const catalogo = new Map(GRUPOS_ICONOS.flatMap((g) => g.iconos).map((i) => [i.name, i]));
        const enUso: GrupoIconos = {
            titulo: "En uso en tus planes",
            iconos: usados.map((name) => catalogo.get(name) ?? { name, tags: "" }),
        };
        const todos = usados.length ? [enUso, ...GRUPOS_ICONOS] : GRUPOS_ICONOS;

        const q = normalizarNombreIcono(query).replace(/_/g, " ");
        if (!q) return todos;

        // Buscando no tiene sentido repetir el mismo icono en dos grupos.
        const vistos = new Set<string>();
        return todos
            .map((g) => ({
                ...g,
                iconos: g.iconos.filter((i) => {
                    if (vistos.has(i.name)) return false;
                    const hit = `${i.name.replace(/_/g, " ")} ${i.tags}`
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .includes(q.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
                    if (hit) vistos.add(i.name);
                    return hit;
                }),
            }))
            .filter((g) => g.iconos.length > 0);
    }, [query, usados]);

    const aplicarCustom = () => {
        const nombre = normalizarNombreIcono(custom);
        if (!nombre) return;
        if (!iconoExiste(nombre)) {
            setCustomError(`"${nombre}" no existe en Material Icons. En el sitio se vería la palabra en vez del ícono.`);
            return;
        }
        setCustomError("");
        onChange({ icon: nombre });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 md:p-10"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Elegir ícono"
                className="w-full max-w-3xl bg-[#1e1530] border-2 border-primary/40 rounded-sm shadow-neobrutalism-primary"
            >
                {/* Cabecera con vista previa tal cual el sitio */}
                <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
                    <div className="flex items-center gap-3 bg-white rounded-sm px-3 py-2 min-w-0">
                        <div
                            className={`w-6 h-6 ${bg} ${textoSobreFondo(bg)} border-2 border-black shadow-neobrutalism-sm flex items-center justify-center shrink-0`}
                        >
                            <span aria-hidden="true" className="material-icons text-sm font-black">{icon}</span>
                        </div>
                        <span
                            className={`text-ink-black text-sm truncate ${
                                highlighted
                                    ? "font-bold underline decoration-hot-coral decoration-2 underline-offset-2"
                                    : "font-medium"
                            }`}
                        >
                            {text || "Texto de la característica"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Así se ve en el sitio
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-primary text-white font-bold px-4 py-1.5 text-sm border-2 border-black rounded-sm shadow-neobrutalism-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        >
                            Listo
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Fondo */}
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Fondo</p>
                        <div className="flex flex-wrap gap-2">
                            {FONDOS_ICONO.map((f) => {
                                const activo = f.value === bg;
                                return (
                                    <button
                                        key={f.value}
                                        type="button"
                                        onClick={() => onChange({ icon_bg: f.value })}
                                        aria-pressed={activo}
                                        className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-sm border-2 text-xs font-bold transition-colors ${
                                            activo
                                                ? "border-primary bg-primary/20 text-white"
                                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
                                        }`}
                                    >
                                        <span
                                            className={`w-5 h-5 ${f.value} ${textoSobreFondo(f.value)} border-2 border-black flex items-center justify-center`}
                                        >
                                            <span aria-hidden="true" className="material-icons text-[12px]">{icon}</span>
                                        </span>
                                        {f.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="relative">
                        <span
                            aria-hidden="true"
                            className="material-icons absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-[18px]"
                        >
                            search
                        </span>
                        <input
                            autoFocus
                            className="admin-input admin-input-search w-full"
                            placeholder='Buscar: "mockup", "gratis", "whatsapp", "google", "envíos"...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Grilla de iconos */}
                    <div className="space-y-4 max-h-[46vh] overflow-y-auto pr-1">
                        {grupos.length === 0 && (
                            <p className="text-xs text-gray-500 italic text-center py-6">
                                Nada con ese nombre en la lista. Probá escribirlo abajo, en &quot;Otro ícono&quot;.
                            </p>
                        )}
                        {grupos.map((g) => (
                            <div key={g.titulo}>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                    {g.titulo}
                                </p>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                                    {g.iconos.map((i) => {
                                        const activo = i.name === icon;
                                        return (
                                            <button
                                                key={`${g.titulo}-${i.name}`}
                                                type="button"
                                                onClick={() => onChange({ icon: i.name })}
                                                title={i.name}
                                                aria-label={i.name}
                                                aria-pressed={activo}
                                                className={`h-16 flex flex-col items-center justify-center gap-1 rounded-sm border-2 transition-colors ${
                                                    activo
                                                        ? "border-primary bg-primary text-white"
                                                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white"
                                                }`}
                                            >
                                                <span aria-hidden="true" className="material-icons text-[22px]">{i.name}</span>
                                                <span className="text-[8px] font-mono leading-none truncate max-w-full px-1 opacity-70">
                                                    {i.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cualquier otro icono de la fuente */}
                    <div className="border-t border-white/10 pt-3">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                            Otro ícono
                        </p>
                        <div className="flex gap-2">
                            <input
                                className="admin-input flex-1 text-sm font-mono"
                                placeholder="nombre_del_icono"
                                value={custom}
                                onChange={(e) => {
                                    setCustom(e.target.value);
                                    setCustomError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        aplicarCustom();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={aplicarCustom}
                                disabled={!custom.trim()}
                                className="bg-mint text-black font-bold px-4 text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-neobrutalism-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Usar
                            </button>
                        </div>
                        {customError ? (
                            <p role="alert" className="text-[11px] text-hot-coral font-bold mt-1.5">{customError}</p>
                        ) : (
                            <p className="text-[10px] text-gray-500 mt-1.5">
                                Cualquiera de{" "}
                                <a
                                    href="https://fonts.google.com/icons?icon.set=Material+Icons"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2 hover:text-white"
                                >
                                    Material Icons
                                </a>
                                . Copiá el nombre (por ejemplo <span className="font-mono">celebration</span>) y pegalo acá.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
