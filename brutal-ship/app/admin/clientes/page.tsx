import { createClient } from "@/lib/supabase/server";
import type { PresupuestoGuardado } from "../presupuestos/modelo";
import Clientes from "./ClientesCliente";
import type { LinkGuardado, SuscripcionGuardada } from "./MercadoPago";
import type { Cliente } from "./cuentas";

export const metadata = {
    title: "Clientes — Logika",
};

export default async function ClientesPage() {
    const supabase = await createClient();

    const [clientes, presupuestos, suscripciones, cobrosMp, links, cargosMp] = await Promise.all([
        supabase.from("clients").select("*"),
        supabase.from("quotes").select("*").order("updated_at", { ascending: false }).limit(500),
        supabase.from("mp_subscriptions").select("*").order("created_at", { ascending: false }),
        supabase.from("mp_payments").select("*"),
        supabase.from("mp_links").select("*").order("created_at", { ascending: false }),
        supabase.from("mp_charges").select("*"),
    ]);

    // Sin las tablas, el SQL de Mercado Pago todavía no se corrió: el resto anda igual.
    const mpListo = !suscripciones.error && !cobrosMp.error && !links.error && !cargosMp.error;
    const de = <F extends { quote_id: string }>(filas: F[] | null, id: string) => (filas ?? []).filter((f) => f.quote_id === id);

    return (
        <Clientes
            // Sin la tabla, el SQL de clientes todavía no se corrió.
            listo={!clientes.error && !presupuestos.error}
            clientes={(clientes.data ?? []) as Cliente[]}
            presupuestos={((presupuestos.data ?? []) as PresupuestoGuardado[]).map((g) => ({
                ...g,
                total: Number(g.total),
                mp_payments: de(cobrosMp.data, g.id),
                mp_charges: de(cargosMp.data, g.id),
            }))}
            suscripciones={mpListo ? ((suscripciones.data ?? []) as SuscripcionGuardada[]) : []}
            links={mpListo ? ((links.data ?? []) as LinkGuardado[]) : []}
            // Solo si hay con qué hablar con Mercado Pago; el token nunca sale del servidor.
            mp={{ listo: mpListo, conectado: Boolean(process.env.MP_ACCESS_TOKEN) }}
        />
    );
}
