import { createClient } from "@/lib/supabase/server";
import type { PresupuestoGuardado } from "../presupuestos/modelo";
import Clientes from "./ClientesCliente";
import type { Cliente } from "./cuentas";

export const metadata = {
    title: "Clientes — Logika",
};

export default async function ClientesPage() {
    const supabase = await createClient();

    const [clientes, presupuestos] = await Promise.all([
        supabase.from("clients").select("*"),
        supabase.from("quotes").select("*").order("updated_at", { ascending: false }).limit(500),
    ]);

    return (
        <Clientes
            // Sin la tabla, el SQL de clientes todavía no se corrió.
            listo={!clientes.error && !presupuestos.error}
            clientes={(clientes.data ?? []) as Cliente[]}
            presupuestos={((presupuestos.data ?? []) as PresupuestoGuardado[]).map((g) => ({ ...g, total: Number(g.total) }))}
        />
    );
}
