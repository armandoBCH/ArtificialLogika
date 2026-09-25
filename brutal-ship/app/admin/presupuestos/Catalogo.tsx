"use client";

import { useEffect, useRef, useState } from "react";
import { escribir } from "./api";
import { ListaEditable, PesosInput } from "./controles";
import type { ItemCatalogo } from "./modelo";

/**
 * Los extras que se suman a un presupuesto con un clic. Cada fila se edita en el
 * lugar y se guarda sola; los cambios valen para los presupuestos nuevos, no
 * tocan los ya guardados (cada presupuesto guarda su propia copia del precio).
 */

interface Props {
    abierto: boolean;
    onCerrar: () => void;
    items: ItemCatalogo[];
    onCambio: (items: ItemCatalogo[]) => void;
    baseLista: boolean;
}

type Borrador = Omit<ItemCatalogo, "id"> & { id: string | null; clave: string };

/** Solo lo editable: `updated_at` cambia en cada guardado y marcaría la fila como sucia. */
const firma = (x: Borrador) => JSON.stringify([x.name, x.description, x.includes, x.price, x.unit, x.category, x.is_recurring, x.is_active]);

const vacio = (orden: number): Borrador => ({
    id: null,
    clave: `nuevo-${Date.now()}`,
    name: "",
    description: "",
    includes: [],
    price: 0,
    unit: "",
    category: "Extras",
    is_recurring: false,
    display_order: orden,
    is_active: true,
});

export default function Catalogo({ abierto, onCerrar, items, onCambio, baseLista }: Props) {
    const dialogo = useRef<HTMLDialogElement>(null);
    const [nuevo, setNuevo] = useState<Borrador | null>(null);

    useEffect(() => {
        const d = dialogo.current;
        if (!d) return;
        if (abierto && !d.open) d.showModal();
        if (!abierto && d.open) d.close();
    }, [abierto]);

    const categorias = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

    return (
        <dialog
            ref={dialogo}
            onClose={() => {
                setNuevo(null);
                onCerrar();
            }}
            aria-labelledby="catalogo-titulo"
            className="visor m-auto max-h-[88vh] w-[min(64rem,calc(100vw-2rem))] overflow-hidden rounded-sm border-2 border-black bg-[#1e1530] p-0 text-white shadow-neobrutalism-primary backdrop:bg-black/70"
        >
            <div className="flex max-h-[88vh] flex-col">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-white/10 px-6 py-4">
                    <div>
                        <h2 id="catalogo-titulo" className="font-display text-xl font-bold">Catálogo de extras</h2>
                        <p className="text-sm text-gray-400">
                            Extras que se cobran una vez y servicios que se cobran por mes. Cambiar un precio acá no toca los presupuestos ya guardados.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={!baseLista || nuevo !== null}
                            onClick={() => setNuevo(vacio(items.length + 1))}
                            className="rounded-sm border-2 border-black bg-primary px-4 py-2 text-sm font-bold text-white shadow-neobrutalism-sm transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:opacity-40"
                        >
                            + Nuevo extra
                        </button>
                        <button
                            type="button"
                            onClick={() => dialogo.current?.close()}
                            aria-label="Cerrar catálogo"
                            className="grid h-10 w-10 place-items-center rounded-sm text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                            <span aria-hidden="true" className="material-icons">close</span>
                        </button>
                    </div>
                </header>

                <div className="overflow-y-auto px-6 py-5">
                    {!baseLista && (
                        <p className="mb-4 rounded-sm border-2 border-accent-yellow/50 bg-accent-yellow/10 p-3 text-sm text-accent-yellow">
                            Para editar el catálogo falta crear la tabla: corré <code className="font-bold">supabase/presupuestos-y-pesos-2026-09-16.sql</code> en Supabase. Mientras tanto se usan estos extras de base.
                        </p>
                    )}

                    <datalist id="catalogo-categorias">
                        {categorias.map((c) => (
                            <option key={c} value={c} />
                        ))}
                    </datalist>

                    <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)_8rem_7rem_8.5rem_auto] gap-2 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 lg:grid">
                        <span>Nombre</span>
                        <span>Descripción</span>
                        <span>Categoría</span>
                        <span>Unidad</span>
                        <span className="text-right">Precio</span>
                        <span className="w-[10.5rem]" />
                    </div>

                    <ul className="space-y-2">
                        {nuevo && (
                            <Fila
                                key={nuevo.clave}
                                inicial={nuevo}
                                baseLista={baseLista}
                                onGuardado={(item) => {
                                    onCambio([...items, item]);
                                    setNuevo(null);
                                }}
                                onBorrado={() => setNuevo(null)}
                            />
                        )}
                        {items.map((item) => (
                            <Fila
                                key={item.id}
                                inicial={{ ...item, clave: item.id }}
                                baseLista={baseLista}
                                onGuardado={(guardado) => onCambio(items.map((i) => (i.id === guardado.id ? guardado : i)))}
                                onBorrado={() => onCambio(items.filter((i) => i.id !== item.id))}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </dialog>
    );
}

function Fila({
    inicial,
    baseLista,
    onGuardado,
    onBorrado,
}: {
    inicial: Borrador;
    baseLista: boolean;
    onGuardado: (item: ItemCatalogo) => void;
    onBorrado: () => void;
}) {
    const [b, setB] = useState<Borrador>(inicial);
    const [estado, setEstado] = useState<"quieto" | "guardando" | "error">("quieto");
    const [error, setError] = useState("");
    const cambiado = b.id === null || firma(b) !== firma(inicial);
    const set = (cambios: Partial<Borrador>) => setB((prev) => ({ ...prev, ...cambios }));

    async function guardar() {
        if (!b.name.trim()) {
            setEstado("error");
            setError("Poné un nombre");
            return;
        }
        setEstado("guardando");
        const campos = {
            name: b.name.trim(),
            description: b.description.trim(),
            includes: b.includes.filter((i) => i.trim()),
            price: b.price,
            unit: b.unit.trim(),
            category: b.category.trim() || "Extras",
            is_recurring: b.is_recurring,
            display_order: b.display_order,
            is_active: b.is_active,
        };
        try {
            const fila = await escribir<ItemCatalogo>("quote_catalog", b.id ? "PUT" : "POST", b.id ? { id: b.id, ...campos } : campos);
            const guardado = { ...fila, price: Number(fila.price), includes: fila.includes ?? [] };
            setEstado("quieto");
            setB({ ...guardado, clave: b.clave });
            onGuardado(guardado);
        } catch (e) {
            setEstado("error");
            setError(e instanceof Error ? e.message : "No se pudo guardar");
        }
    }

    async function borrar() {
        if (!b.id) return onBorrado();
        if (!confirm(`¿Borrar "${b.name}" del catálogo?`)) return;
        try {
            await escribir("quote_catalog", "DELETE", { id: b.id });
            onBorrado();
        } catch (e) {
            setEstado("error");
            setError(e instanceof Error ? e.message : "No se pudo borrar");
        }
    }

    return (
        <li className={`rounded-sm border-2 p-3 ${b.id === null ? "border-primary/60 bg-primary/10" : "border-white/10 bg-white/[0.03]"} ${b.is_active ? "" : "opacity-60"}`}>
            <div className="grid gap-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)_8rem_7rem_8.5rem_auto] lg:items-center">
                <input
                    className="admin-input w-full font-bold"
                    aria-label="Nombre"
                    placeholder={b.is_recurring ? "Nombre del servicio mensual" : "Nombre del extra"}
                    value={b.name}
                    disabled={!baseLista}
                    autoFocus={b.id === null}
                    onChange={(e) => set({ name: e.target.value })}
                />
                <input
                    className="admin-input w-full text-sm"
                    aria-label="Descripción"
                    placeholder="Qué es, en palabras del cliente"
                    value={b.description}
                    disabled={!baseLista}
                    onChange={(e) => set({ description: e.target.value })}
                />
                <input
                    className="admin-input w-full text-sm"
                    aria-label="Categoría"
                    list="catalogo-categorias"
                    placeholder="Categoría"
                    value={b.category}
                    disabled={!baseLista}
                    onChange={(e) => set({ category: e.target.value })}
                />
                <input
                    className="admin-input w-full text-sm"
                    aria-label="Unidad"
                    placeholder={b.is_recurring ? "por mes" : "por página"}
                    value={b.is_recurring ? "" : b.unit}
                    disabled={!baseLista || b.is_recurring}
                    title={b.is_recurring ? "Un servicio mensual siempre se cobra por mes" : undefined}
                    onChange={(e) => set({ unit: e.target.value })}
                />
                <fieldset disabled={!baseLista} className="contents">
                    <PesosInput etiqueta="Precio" valor={b.price} onChange={(price) => set({ price })} sufijo={b.is_recurring ? "/mes" : undefined} />
                </fieldset>
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        disabled={!baseLista || !cambiado || estado === "guardando"}
                        onClick={guardar}
                        className="rounded-sm border-2 border-black bg-primary px-3 py-2 text-xs font-bold text-white disabled:border-white/10 disabled:bg-white/5 disabled:text-gray-500"
                    >
                        {estado === "guardando" ? "Guardando…" : b.id === null ? "Crear" : "Guardar"}
                    </button>
                    <button
                        type="button"
                        disabled={!baseLista}
                        onClick={borrar}
                        aria-label={b.id === null ? "Descartar" : `Borrar ${b.name}`}
                        className="grid h-9 w-9 place-items-center rounded-sm text-gray-400 hover:bg-hot-coral/15 hover:text-hot-coral disabled:opacity-30"
                    >
                        <span aria-hidden="true" className="material-icons text-lg">{b.id === null ? "close" : "delete_outline"}</span>
                    </button>
                </div>
            </div>
            <details className="group mt-2">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-white">
                    <span aria-hidden="true" className="material-icons text-base transition-transform group-open:rotate-90">chevron_right</span>
                    Qué incluye{b.includes.filter((i) => i.trim()).length > 0 ? ` (${b.includes.filter((i) => i.trim()).length})` : ""}
                    <span className="font-medium normal-case tracking-normal text-gray-600">· viaja al presupuesto</span>
                </summary>
                <div className="mt-2 pl-5">
                    <fieldset disabled={!baseLista}>
                        <ListaEditable
                            items={b.includes}
                            onChange={(includes) => set({ includes })}
                            placeholder="Algo que incluye"
                            agregar="Agregar renglón"
                        />
                    </fieldset>
                </div>
            </details>

            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-bold text-gray-400">
                <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#8523e1]"
                        checked={b.is_recurring}
                        disabled={!baseLista}
                        onChange={(e) => set({ is_recurring: e.target.checked, unit: e.target.checked ? "" : b.unit })}
                    />
                    Se cobra por mes
                </label>
                <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="checkbox" className="h-4 w-4 accent-[#8523e1]" checked={b.is_active} disabled={!baseLista} onChange={(e) => set({ is_active: e.target.checked })} />
                    Visible en el presupuestador
                </label>
                {estado === "error" && <span role="alert" className="text-hot-coral">{error}</span>}
                {cambiado && b.id !== null && estado !== "error" && <span className="text-accent-yellow">Sin guardar</span>}
            </div>
        </li>
    );
}
