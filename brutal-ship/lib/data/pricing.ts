import { createClient } from "@/lib/supabase/server";
import type { PricingPlan } from "@/lib/types/database";

const DEFAULT_PLANS: PricingPlan[] = [
    {
        id: "1",
        name: "Landing Page",
        subtitle: "Ideal para emprendedores y freelancers.",
        price: 149,
        original_price: null,
        currency: "USD",
        payment_type: "Pago Único",
        price_note: null,
        features: [
            { text: "Mockup previo gratis", icon: "draw", is_highlighted: true, icon_bg: "bg-hot-coral" },
            { text: "Presupuesto sin cargo", icon: "request_quote", is_highlighted: true, icon_bg: "bg-accent-yellow" },
            { text: "Página con tu info", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Perfecto en celular", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Botón de WhatsApp", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Formulario contacto", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Aparece en Google", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "1 mes de soporte", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
        ],
        is_featured: false,
        featured_label: null,
        cta_text: "Consultar",
        cta_style: "default",
        header_bg: "bg-ink-black",
        display_order: 1,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "2",
        name: "E-commerce",
        subtitle: "Vendé online. Tu tienda propia.",
        price: 399,
        original_price: 499,
        currency: "USD",
        payment_type: "Precio Base",
        price_note: "Precio de lanzamiento — cupos limitados.",
        features: [
            { text: "Mockup previo gratis", icon: "draw", is_highlighted: true, icon_bg: "bg-hot-coral" },
            { text: "Presupuesto sin cargo", icon: "request_quote", is_highlighted: true, icon_bg: "bg-accent-yellow" },
            { text: "Todo Institucional +", icon: "check", is_highlighted: true, icon_bg: "bg-accent-yellow" },
            { text: "Catálogo con fotos", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Carrito y checkout", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Pagos online", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Métricas (visitas)", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "1 mes de soporte", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
        ],
        is_featured: true,
        featured_label: "🔥 Más Elegido",
        cta_text: "Quiero Mi Tienda",
        cta_style: "primary",
        header_bg: "bg-primary",
        display_order: 2,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "3",
        name: "Sitio Institucional",
        subtitle: "Tu negocio completo en internet.",
        price: 249,
        original_price: null,
        currency: "USD",
        payment_type: "Pago Único",
        price_note: null,
        features: [
            { text: "Mockup previo gratis", icon: "draw", is_highlighted: true, icon_bg: "bg-hot-coral" },
            { text: "Presupuesto sin cargo", icon: "request_quote", is_highlighted: true, icon_bg: "bg-accent-yellow" },
            { text: "Todo lo de Landing +", icon: "check", is_highlighted: true, icon_bg: "bg-accent-yellow" },
            { text: "Diseño a medida", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Hasta 5 páginas", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Mapa interactivo", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "Galería de fotos", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
            { text: "1 mes de soporte", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" },
        ],
        is_featured: false,
        featured_label: null,
        cta_text: "Consultar",
        cta_style: "default",
        header_bg: "bg-ink-black",
        display_order: 3,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
];

export async function getPricingPlans(): Promise<PricingPlan[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("pricing_plans")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error || !data || data.length === 0) {
            return DEFAULT_PLANS;
        }

        return data as PricingPlan[];
    } catch {
        return DEFAULT_PLANS;
    }
}
