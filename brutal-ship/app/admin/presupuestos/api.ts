/**
 * Escrituras contra /api/admin/[table]. A diferencia de useAdminData, devuelve la
 * fila que respondió la base: el presupuestador necesita el `id` y el `number`
 * recién asignados sin volver a pedir la lista entera.
 */
export async function escribir<T>(tabla: "quotes" | "quote_catalog", metodo: "POST" | "PUT" | "DELETE", cuerpo: unknown): Promise<T> {
    const res = await fetch(`/api/admin/${tabla}`, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        if (res.status === 401) throw new Error("La sesión venció. Volvé a entrar al panel.");
        if (res.status === 429) throw new Error("Demasiados cambios seguidos. Esperá unos segundos y probá de nuevo.");
        throw new Error(json.error || "No se pudo guardar");
    }
    return json as T;
}
