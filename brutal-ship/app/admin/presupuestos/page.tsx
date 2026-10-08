import { createClient } from "@/lib/supabase/server";
import { getPricingPlans } from "@/lib/data/pricing";
import { SITE_URL } from "@/lib/seo/constants";
import type { Cliente } from "../clientes/cuentas";
import Presupuestador from "./PresupuestadorCliente";
import { CATALOGO_BASE, type ItemCatalogo, type Lead, type PresupuestoGuardado } from "./modelo";

export const metadata = {
    title: "Presupuestos — Logika",
};

export default async function PresupuestosPage() {
    const supabase = await createClient();

    // Los planes pasan por lib/data: si la base falla, traen los mismos valores
    // por defecto que muestra el sitio.
    const [planes, config, leads, catalogo, guardados, clientes] = await Promise.all([
        getPricingPlans(),
        supabase.from("site_config").select("key, value"),
        supabase.from("contact_leads").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("quote_catalog").select("*").order("display_order", { ascending: true }),
        supabase.from("quotes").select("*").order("updated_at", { ascending: false }).limit(300),
        supabase.from("clients").select("*"),
    ]);

    // Si alguna de las dos tablas no existe, el SQL todavía no se corrió.
    const baseLista = !catalogo.error && !guardados.error;
    // La columna `includes` llegó después: sin ella no se pueden guardar los
    // renglones de cada servicio.
    const faltaColumnaIncluye = baseLista && (catalogo.data ?? []).some((i) => i.includes === undefined);
    const ajustes = Object.fromEntries((config.data ?? []).map((fila) => [fila.key, fila.value])) as Record<string, string>;

    return (
        <Presupuestador
            planes={planes}
            leads={(leads.data ?? []) as Lead[]}
            catalogo={
                baseLista
                    ? ((catalogo.data ?? []) as ItemCatalogo[]).map((i) => ({ ...i, price: Number(i.price), includes: i.includes ?? [] }))
                    : CATALOGO_BASE
            }
            guardados={
                baseLista
                    ? ((guardados.data ?? []) as PresupuestoGuardado[]).map((g) => ({ ...g, total: Number(g.total) }))
                    : []
            }
            empresa={{
                whatsapp: ajustes.whatsapp_number ?? "",
                email: ajustes.email ?? "",
                ubicacion: ajustes.location ?? "",
                web: new URL(SITE_URL).host.replace(/^www\./, ""),
            }}
            baseLista={baseLista}
            faltaColumnaIncluye={faltaColumnaIncluye}
            // Sin la tabla (antes de supabase/clientes-2026-10-07.sql) se guarda como antes, sin cliente.
            clientes={(clientes.data ?? []) as Cliente[]}
            clientesListos={baseLista && !clientes.error}
        />
    );
}
