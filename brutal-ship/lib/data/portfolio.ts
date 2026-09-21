import { createPublicClient } from "@/lib/supabase/public";
import type { PortfolioProject, PortfolioStat } from "@/lib/types/database";

// CMS placeholders that must never render as if they were a result. A case study with
// no measured outcome shows no stat block at all — an empty slot is more honest than
// "SITIO DE MUESTRA" set in the same weight as "+20% DE VENTAS".
const PLACEHOLDER_STAT = /^(sitio de muestra|nueva m[eé]trica|proyecto de muestra|placeholder|tbd|n\/a|-+)$/i;

export function isRealStat(stat: Partial<PortfolioStat>) {
    const value = (stat.value ?? "").trim();
    const label = (stat.label ?? "").trim();
    if (!value || !label) return false;
    return !PLACEHOLDER_STAT.test(value) && !PLACEHOLDER_STAT.test(label);
}

/**
 * Si el proyecto lleva el sello "Proyecto de Muestra". Vive aca y no en el
 * componente porque lo usan la home y la imagen de vista previa de cada caso.
 *
 * El sello decia "Proyecto de Muestra" tambien cuando el proyecto no tenia
 * ninguna metrica cargada. Eso etiquetaba como demo a dos clientes reales
 * (Expresion Honesta y Boda Carlos y Jenlys), que existen y estan publicados:
 * simplemente todavia no tienen numeros medidos.
 *
 * No cargar metricas no dice nada sobre si el trabajo es real. Lo que si dice
 * algo es tener metricas y que sean todas de relleno: eso es una demo aunque
 * el flag diga lo contrario, y esa proteccion se mantiene.
 */
export function esMuestra(project: Pick<PortfolioProject, "is_sample" | "stats">) {
    const stats = project.stats ?? [];
    const soloTienePlaceholders = stats.length > 0 && !stats.some(isRealStat);
    return project.is_sample || soloTienePlaceholders;
}

const DEFAULT_PROJECTS: PortfolioProject[] = [
    {
        id: "1",
        title: "Estilo María",
        category: "Peluquería",
        external_url: "https://logika.com.ar",
        applied_services: ["Página Web One-Page", "Landing Page Conversión"],
        applied_features: ["Diseño Responsive", "Formulario de Contacto", "Botón de WhatsApp", "Optimización SEO Básica"],
        categories: [],
        is_sample: true,
        tags: ["Peluquería", "Servicios"],
        description: "Web completa para peluquería: galería de trabajos, lista de precios, botón de WhatsApp para turnos y ubicación en Google Maps.",
        description_long: "",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVoR4f22OSpfWGZI1INmdC-nPQn7kkKJfA97M6BqYfuOqaj3Fp1VmxR33nkip7mwmR5BhlY-dEJ2YRui5WRNBmray4fUMysNLNEWbjwLEonSu1kEHQqgWWeJK8NtsaIVbjOmZI5koNc-8_vRtviwzvbjePekgBekv-iBz5Qgm25Zxp5Ax5cnjiHyAP8Iw-xNgq1qkd7b6zU7TfcXx_2CcerNv4fcqiRNkoLCNvT1dQXT8Oa6EHbjiB0_w3QIomwKZiC4Suw5BD_g4",
        image_url_wide: "",
        image_alt: "Web de peluquería con galería de trabajos",
        accent_color: "primary",
        stats: [
            { value: "+300%", label: "Consultas por WhatsApp" },
            { value: "2 sem", label: "Tiempo de Entrega" },
        ],
        display_order: 1,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "2",
        title: "Don Julio Parrilla",
        category: "Restaurante",
        external_url: "https://logika.com.ar",
        applied_services: ["Página Web One-Page"],
        applied_features: ["Diseño Responsive", "Integración con Redes", "Velocidad Optimizada"],
        categories: [],
        is_sample: true,
        tags: ["Restaurante", "Gastronomía"],
        description: "Menú digital con fotos, sistema de reservas online, enlace a delivery y mapa para llegar fácil. Todo en una web rápida y atractiva.",
        description_long: "",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC34rks4hUuzySIw08zD_pRjyWAW8TBN8YOAWPuYRdV0e9RE2Rp4O7IMi-XZ_C8oL8ZfnFbEDGOuzbuLjkqgf-JQHGaTXSFZH0tE4zFGJLCCJ23jp6oOgsNgXyCZVgIPGY4grCRH3zGeJC8c8zyl-bPMA7zNqArkJueK7JH6okBxbChxo6dnUUbVUFBlmhmj9khSE2EJwYXt3w46gz2TH1FhBINZbTKEvOQNPGnbVOVskzfWG8gx7yJ0NxHekila1dXtUMFuPT_D0Y",
        image_url_wide: "",
        image_alt: "Web de restaurante con menú digital y reservas",
        accent_color: "mint",
        stats: [
            { value: "+45%", label: "Reservas Online" },
            { value: "10 días", label: "Tiempo de Entrega" },
        ],
        display_order: 2,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "3",
        title: "Estudio Torres & Asoc.",
        category: "Profesional",
        external_url: "https://logika.com.ar",
        applied_services: ["Web Multi-Página", "Landing Page Conversión"],
        applied_features: ["Hasta 10 Páginas Internas", "Editable por Vos", "SEO Avanzado", "Copywriting Persuasivo"],
        categories: [],
        is_sample: true,
        tags: ["Profesional", "Abogacía"],
        description: "Sitio profesional para estudio de abogados: áreas de práctica, equipo, formulario de consulta y blog con artículos legales.",
        description_long: "",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEj_813dqwISEs5lWRSIW1ssxp16U3iBzCnBlvH6Wctkv5vpkpBhmJCHG5sq5VJDzLHirDOJeC3PhIyIdjfDaBKhXJcU_Fh6xAV0RpR86jfdJXErpaWLHj0RDbG5mDqGuU24RldkomkZ1PjUoIXzQUvEpHgamVUzYPEslegbTfUwc0Nfbu_jO4pZhJzdHfq4ZOs_nb3QfZOEO8iu1WvPyKWDScLzuZm2_EBmVuMYq6exsOYBPM35gNlvBt9YidEhEJ137rJcr-W3c",
        image_url_wide: "",
        image_alt: "Web profesional de estudio de abogados",
        accent_color: "coral",
        stats: [
            { value: "3x", label: "Consultas Mensuales" },
            { value: "100%", label: "Satisfacción" },
        ],
        display_order: 3,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
];

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
    try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from("portfolio_projects")
            .select("*")
            .eq("is_active", true)
            // Segundo criterio a proposito: hoy los 6 proyectos activos tienen
            // display_order 0, asi que ordenar solo por eso deja el resultado a
            // criterio de Postgres y la home podia mostrar tres distintos entre
            // build y build. Con created_at el orden queda fijo.
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (error || !data || data.length === 0) {
            return DEFAULT_PROJECTS;
        }

        return data as PortfolioProject[];
    } catch {
        return DEFAULT_PROJECTS;
    }
}
