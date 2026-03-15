import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AnalyticsSection from "./components/AnalyticsSection";

async function getStats() {
    const supabase = await createClient();

    const [plans, services, projects, testimonials, faqs, leads, config] =
        await Promise.all([
            supabase.from("pricing_plans").select("id", { count: "exact" }),
            supabase.from("services").select("id", { count: "exact" }),
            supabase.from("portfolio_projects").select("id", { count: "exact" }),
            supabase.from("testimonials").select("id", { count: "exact" }),
            supabase.from("faqs").select("id", { count: "exact" }),
            supabase
                .from("contact_leads")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5),
            supabase.from("site_config").select("id", { count: "exact" }),
        ]);

    return {
        counts: {
            plans: plans.count ?? 0,
            services: services.count ?? 0,
            projects: projects.count ?? 0,
            testimonials: testimonials.count ?? 0,
            faqs: faqs.count ?? 0,
            config: config.count ?? 0,
        },
        recentLeads: leads.data ?? [],
    };
}

const statCards = [
    { key: "plans", label: "Planes", icon: "💰", href: "/admin/precios", color: "bg-primary" },
    { key: "services", label: "Servicios", icon: "⚡", href: "/admin/servicios", color: "bg-secondary" },
    { key: "projects", label: "Proyectos", icon: "🎨", href: "/admin/portafolio", color: "bg-electric-blue" },
    { key: "testimonials", label: "Testimonios", icon: "💬", href: "/admin/testimonios", color: "bg-accent-yellow" },
    { key: "faqs", label: "FAQs", icon: "❓", href: "/admin/faqs", color: "bg-accent-coral" },
    { key: "config", label: "Config", icon: "⚙️", href: "/admin/config", color: "bg-violet-electric" },
] as const;

export default async function AdminDashboard() {
    const { counts, recentLeads } = await getStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white font-display">
                    Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                    Resumen general del contenido del sitio
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.key}
                        href={card.href}
                        className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 hover:border-primary/50 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{card.icon}</span>
                            <div
                                className={`w-3 h-3 rounded-full ${card.color} group-hover:animate-pulse`}
                            />
                        </div>
                        <p className="text-3xl font-black text-white font-display">
                            {counts[card.key]}
                        </p>
                        <p className="text-gray-400 text-sm font-medium mt-1">
                            {card.label}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Recent Leads */}
            <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-white font-display">
                        📬 Leads Recientes
                    </h2>
                    <Link
                        href="/admin/leads"
                        className="text-primary text-sm font-bold hover:underline"
                    >
                        Ver todos →
                    </Link>
                </div>

                {recentLeads.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No hay leads todavía
                    </p>
                ) : (
                    <div className="space-y-3">
                        {recentLeads.map((lead: Record<string, string>) => (
                            <div
                                key={lead.id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-sm"
                            >
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {lead.name || "Sin nombre"}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {lead.contact_info || lead.email || "—"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs">
                                        {lead.business_type || "—"}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                        {new Date(lead.created_at).toLocaleDateString("es-AR")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Analytics Section */}
            <AnalyticsSection />
        </div>
    );
}
