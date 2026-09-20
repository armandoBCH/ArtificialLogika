"use client";

import { useState, useEffect, useCallback } from "react";

export function useAdminData<T extends { id: string; display_order?: number }>(table: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/${table}`);
            if (!res.ok) throw new Error("Error al cargar datos");
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, [table]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const create = async (item: Partial<T>) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/${table}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error al crear");
            }
            await fetchData();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const update = async (item: Partial<T> & { id: string }) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/${table}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error al actualizar");
            }
            await fetchData();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/${table}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error al eliminar");
            }
            await fetchData();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
            return false;
        } finally {
            setSaving(false);
        }
    };

    /**
     * Guarda un orden nuevo en una sola llamada.
     *
     * Recibe los ids ya ordenados y les asigna display_order 1..N. Pinta el
     * cambio en local primero para que el arrastre no espere a la red, y si el
     * guardado falla vuelve a pedir los datos: mejor ver el orden real del
     * servidor que uno optimista que no existe.
     */
    const reorder = useCallback(
        async (orderedIds: string[]) => {
            const byId = new Map(data.map((item) => [item.id, item]));
            const next = orderedIds
                .map((id, i) => {
                    const item = byId.get(id);
                    return item ? ({ ...item, display_order: i + 1 } as T) : null;
                })
                .filter((item): item is T => item !== null);

            if (next.length !== data.length) return false;

            const previous = data;
            setData(next);

            try {
                const res = await fetch(`/api/admin/${table}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: orderedIds.map((id, i) => ({ id, display_order: i + 1 })),
                    }),
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || "Error al guardar el orden");
                }
                return true;
            } catch (err) {
                setData(previous);
                setError(err instanceof Error ? err.message : "Error al guardar el orden");
                return false;
            }
        },
        [data, table]
    );

    return { data, loading, error, saving, create, update, remove, reorder, refetch: fetchData };
}
