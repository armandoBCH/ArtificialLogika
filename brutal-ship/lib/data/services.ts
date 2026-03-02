import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceFeature } from "@/lib/types/database";

function toFeature(text: string, index: number): ServiceFeature {
    return { text, visible: true, order: index };
}

const DEFAULT_SERVICES: Service[] = [
    {
        id: "1",
        name: "Página Web One-Page",
        description: "Perfecta para emprendedores y negocios que quieren estar online rápido. Todo en una sola página, simple y efectivo.",
        price_from: "Desde $149",
        icon: "web",
        icon_color: "text-primary",
        accent_color: "bg-primary",
        features: [
            { text: "Diseño Responsive", visible: true, order: 0 },
            { text: "Formulario de Contacto", visible: true, order: 1 },
            { text: "Integración con Redes", visible: true, order: 2 },
            { text: "Optimización SEO Básica", visible: true, order: 3 },
            { text: "Galería de Fotos", visible: true, order: 4 },
            { text: "Mapa de Ubicación", visible: true, order: 5 },
            { text: "Animaciones y Efectos", visible: true, order: 6 },
            { text: "Dominio Personalizado", visible: true, order: 7 },
        ],
        is_popular: false,
        popular_label: null,
        cta_text: "Consultar",
        cta_style: "default",
        display_order: 1,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "2",
        name: "Landing Page Conversión",
        description: "Diseñada para captar clientes y generar consultas. Ideal si querés promocionar un servicio específico o una campaña.",
        price_from: "Desde $199",
        icon: "track_changes",
        icon_color: "text-green-600 dark:text-mint-fresh",
        accent_color: "bg-mint-fresh",
        features: [
            { text: "Copywriting Persuasivo", visible: true, order: 0 },
            { text: "Textos Persuasivos", visible: true, order: 1 },
            { text: "Botón de WhatsApp", visible: true, order: 2 },
            { text: "Velocidad Optimizada", visible: true, order: 3 },
            { text: "Seguimiento de Conversiones", visible: true, order: 4 },
            { text: "Diseño A/B Testing Ready", visible: true, order: 5 },
            { text: "Call to Action Estratégicos", visible: true, order: 6 },
        ],
        is_popular: true,
        popular_label: "POPULAR",
        cta_text: "Lo Quiero",
        cta_style: "primary",
        display_order: 2,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "3",
        name: "Web Multi-Página",
        description: "Sitio web completo con varias secciones. Ideal para negocios establecidos que necesitan mostrar todo lo que hacen.",
        price_from: "Desde $349",
        icon: "layers",
        icon_color: "text-hot-coral",
        accent_color: "bg-hot-coral",
        features: [
            { text: "Hasta 10 Páginas Internas", visible: true, order: 0 },
            { text: "Editable por Vos", visible: true, order: 1 },
            { text: "Blog Integrado", visible: true, order: 2 },
            { text: "SEO Avanzado", visible: true, order: 3 },
            { text: "Panel de Administración", visible: true, order: 4 },
            { text: "Sistema de Reservas / Turnos", visible: true, order: 5 },
            { text: "Catálogo de Productos", visible: true, order: 6 },
        ],
        is_popular: false,
        popular_label: null,
        cta_text: "Consultar",
        cta_style: "default",
        display_order: 3,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
];

/** Normalize features: handle legacy string[] from old DB entries */
function normalizeFeatures(features: unknown): ServiceFeature[] {
    if (!Array.isArray(features)) return [];
    return features.map((f, i) => {
        if (typeof f === "string") return toFeature(f, i);
        // Already an object with text/visible/order
        return {
            text: f.text || "",
            visible: f.visible !== false, // default to true
            order: typeof f.order === "number" ? f.order : i,
        };
    });
}

export async function getServices(): Promise<Service[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error || !data || data.length === 0) {
            return DEFAULT_SERVICES;
        }

        // Normalize features and filter visible ones
        return (data as Service[]).map((s) => ({
            ...s,
            features: normalizeFeatures(s.features)
                .filter((f) => f.visible)
                .sort((a, b) => a.order - b.order),
        }));
    } catch {
        return DEFAULT_SERVICES;
    }
}
