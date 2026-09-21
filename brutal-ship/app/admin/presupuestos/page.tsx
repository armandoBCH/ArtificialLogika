import { createClient } from "@/lib/supabase/server";
import { getPricingPlans } from "@/lib/data/pricing";
import { SITE_URL } from "@/lib/seo/constants";
import Presupuestador from "./PresupuestadorCliente";
import { CATALOGO_BASE, type ItemCatalogo, type Lead, type PresupuestoGuardado } from "./modelo";

export const metadata = {
    title: "Presupuestos — Logika",
};

export default async function PresupuestosPage() {
    const supabase = await createClient();

    // Los planes pasan por lib/data: si la base falla, traen los mismos valores
    // por defecto que muestra el sitio.
    const [planes, config, leads, catalogo, guardados] = await Promise.all([
        getPricingPlans(),
        supabase.from("site_config").select("key, value"),
        supabase.from("contact_leads").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("quote_catalog").select("*").order("display_order", { ascending: true }),
        supabase.from("quotes").select("*").order("updated_at", { ascending: false }).limit(300),
    ]);

    // Si alguna de las dos tablas no existe, el SQL todavía no se corrió.
    const baseLista = !catalogo.error && !guardados.error;
    const ajustes = Object.fromEntries((config.data ?? []).map((fila) => [fila.key, fila.value])) as Record<string, string>;

    return (
        <Presupuestador
            planes={planes}
            leads={(leads.data ?? []) as Lead[]}
            catalogo={
                baseLista
                    ? ((catalogo.data ?? []) as ItemCatalogo[]).map((i) => ({ ...i, price: Number(i.price) }))
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
        />
    );
}
