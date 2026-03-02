"use client";

import { useState, useEffect, useCallback } from "react";

export function useAdminData<T extends { id: string }>(table: string) {
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

    return { data, loading, error, saving, create, update, remove, refetch: fetchData };
}
