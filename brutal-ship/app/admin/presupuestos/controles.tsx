"use client";

import { useRef, useState, type ReactNode } from "react";

const miles = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/**
 * Monto en pesos con separador de miles mientras se escribe. "229000" en un input
 * se lee mal y se tipea mal; "229.000" no. Guarda siempre un número entero.
 */
export function PesosInput({
    valor,
    onChange,
    className = "",
    etiqueta,
    sufijo,
}: {
    valor: number;
    onChange: (monto: number) => void;
    className?: string;
    etiqueta: string;
    sufijo?: string;
}) {
    return (
        <div className={`relative ${className}`}>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-white/45">
                $
            </span>
            <input
                type="text"
                inputMode="numeric"
                aria-label={etiqueta}
                className={`admin-input w-full pl-7 text-right font-bold tabular-nums ${sufijo ? "pr-12" : ""}`}
                placeholder="0"
                value={valor ? miles.format(valor) : ""}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => {
                    const digitos = e.target.value.replace(/\D/g, "").slice(0, 10);
                    onChange(digitos ? Number(digitos) : 0);
                }}
            />
            {sufijo && (
                <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/45">
                    {sufijo}
                </span>
            )}
        </div>
    );
}

export function NumeroInput({
    valor,
    onChange,
    min = 0,
    max = 999999,
    etiqueta,
    sufijo,
    className = "",
}: {
    valor: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
    etiqueta: string;
    sufijo?: string;
    className?: string;
}) {
    // Mientras se escribe se respeta el texto tal cual: si no, "10," se volvería "10"
    // antes de poder tipear el 5 de un IVA del 10,5%.
    const [texto, setTexto] = useState<string | null>(null);

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                inputMode="decimal"
                aria-label={etiqueta}
                className={`admin-input w-full font-bold tabular-nums ${sufijo ? (sufijo.length > 2 ? "pr-12" : "pr-8") : ""}`}
                value={texto ?? (valor === 0 ? "" : String(valor).replace(".", ","))}
                placeholder="0"
                onFocus={(e) => e.currentTarget.select()}
                onBlur={() => setTexto(null)}
                onChange={(e) => {
                    const crudo = e.target.value.replace(/[^\d.,]/g, "");
                    setTexto(crudo);
                    const n = Number(crudo.replace(",", "."));
                    onChange(crudo === "" || Number.isNaN(n) ? 0 : Math.min(Math.max(n, min), max));
                }}
            />
            {sufijo && (
                <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/45">
                    {sufijo}
                </span>
            )}
        </div>
    );
}

export function Cantidad({ valor, onChange, etiqueta }: { valor: number; onChange: (n: number) => void; etiqueta: string }) {
    return (
        <div className="flex h-[42px] items-stretch overflow-hidden rounded-sm border-2 border-white/15 bg-white/5">
            <button
                type="button"
                aria-label={`Restar uno a ${etiqueta}`}
                onClick={() => onChange(Math.max(1, valor - 1))}
                className="grid w-9 place-items-center text-lg font-bold text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                disabled={valor <= 1}
            >
                −
            </button>
            <input
                type="text"
                inputMode="numeric"
                aria-label={etiqueta}
                className="w-10 bg-transparent text-center text-sm font-bold text-white tabular-nums outline-none focus:bg-white/10"
                value={valor}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => {
                    const n = Number(e.target.value.replace(/\D/g, ""));
                    onChange(Math.min(Math.max(n || 1, 1), 9999));
                }}
            />
            <button
                type="button"
                aria-label={`Sumar uno a ${etiqueta}`}
                onClick={() => onChange(Math.min(valor + 1, 9999))}
                className="grid w-9 place-items-center text-lg font-bold text-white/70 hover:bg-white/10 hover:text-white"
            >
                +
            </button>
        </div>
    );
}

/**
 * Lista de renglones editable pensada para teclado: Enter crea el siguiente renglón,
 * Backspace en un renglón vacío lo borra y vuelve al anterior.
 */
export function ListaEditable({
    items,
    onChange,
    placeholder,
    agregar,
}: {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder: string;
    agregar: string;
}) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const enfocar = (i: number) => requestAnimationFrame(() => refs.current[i]?.focus());

    return (
        <div className="space-y-1.5">
            {items.map((item, i) => (
                <div key={i} className="group flex items-center gap-2">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-primary" />
                    <input
                        ref={(el) => {
                            refs.current[i] = el;
                        }}
                        className="admin-input flex-1 py-1.5 text-sm"
                        value={item}
                        placeholder={placeholder}
                        aria-label={`${placeholder} ${i + 1}`}
                        onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onChange([...items.slice(0, i + 1), "", ...items.slice(i + 1)]);
                                enfocar(i + 1);
                            } else if (e.key === "Backspace" && item === "" && items.length > 0) {
                                e.preventDefault();
                                onChange(items.filter((_, j) => j !== i));
                                enfocar(Math.max(0, i - 1));
                            }
                        }}
                    />
                    <button
                        type="button"
                        aria-label="Quitar renglón"
                        onClick={() => onChange(items.filter((_, j) => j !== i))}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-sm text-white/40 hover:bg-hot-coral/15 hover:text-hot-coral"
                    >
                        <span aria-hidden="true" className="material-icons text-lg">close</span>
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => {
                    onChange([...items, ""]);
                    enfocar(items.length);
                }}
                className="inline-flex items-center gap-1 py-1 text-xs font-bold uppercase tracking-wider text-[#c9a3f5] hover:text-white"
            >
                <span aria-hidden="true" className="material-icons text-base">add</span>
                {agregar}
            </button>
        </div>
    );
}

export function Seccion({
    numero,
    titulo,
    descripcion,
    accion,
    children,
}: {
    numero: number;
    titulo: string;
    descripcion?: string;
    accion?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section aria-labelledby={`seccion-${numero}`} className="rounded-sm border-2 border-white/10 bg-[#1e1530]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm border-2 border-black bg-primary font-display text-sm font-bold text-white shadow-neobrutalism-sm">
                        {numero}
                    </span>
                    <div>
                        <h2 id={`seccion-${numero}`} className="font-display text-base font-bold leading-tight text-white">
                            {titulo}
                        </h2>
                        {descripcion && <p className="text-xs text-gray-400">{descripcion}</p>}
                    </div>
                </div>
                {accion}
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function Campo({ etiqueta, children, className = "" }: { etiqueta: string; children: ReactNode; className?: string }) {
    return (
        <label className={`block space-y-1 ${className}`}>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">{etiqueta}</span>
            {children}
        </label>
    );
}

/** Atajo de un toque para valores frecuentes (plazos, porcentajes, días). */
export function Atajos<T extends string | number>({
    opciones,
    actual,
    onElegir,
    formato = (v) => String(v),
}: {
    opciones: T[];
    actual: T;
    onElegir: (v: T) => void;
    formato?: (v: T) => string;
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {opciones.map((o) => (
                <button
                    key={String(o)}
                    type="button"
                    aria-pressed={o === actual}
                    onClick={() => onElegir(o)}
                    className={`rounded-sm border px-2 py-0.5 text-[11px] font-bold transition-colors ${o === actual
                        ? "border-primary bg-primary text-white"
                        : "border-white/15 bg-white/5 text-gray-300 hover:border-white/40 hover:text-white"
                        }`}
                >
                    {formato(o)}
                </button>
            ))}
        </div>
    );
}
