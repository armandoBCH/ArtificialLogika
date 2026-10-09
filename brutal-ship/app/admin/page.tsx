import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatearPesos } from "@/lib/precios";
import AnalyticsSection from "./components/AnalyticsSection";
import { mesDeHoy, resumenDe, trabajoDe } from "./clientes/cuentas";
import { calcularTotales, normalizar, type PresupuestoGuardado } from "./presupuestos/modelo";

/** Las mismas cuentas que muestra Clientes, para tenerlas a mano al entrar al panel. */
async function getCobros() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quotes")
        .select("id, status, data, client_id, payments, costs, monthly_active")
        .order("updated_at", { ascending: false })
        .limit(500);
    // Sin las columnas de cobro (antes del SQL de clientes) no hay nada que mostrar.
    if (error || !data) return null;
    const mes = mesDeHoy();
    const trabajos = (data as PresupuestoGuardado[]).map((q) => trabajoDe(q, calcularTotales(normalizar(q.data)), mes));
    return resumenDe(trabajos, mes);
}

async function getStats() {
    const supabase = await createClient();

    const [plans, projects, testimonials, faqs, leads, config] =
        await Promise.all([
            supabase.from("pricing_plans").select("id", { count: "exact" }),
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
    { key: "projects", label: "Proyectos", icon: "🎨", href: "/admin/portafolio", color: "bg-primary" },
    { key: "testimonials", label: "Testimonios", icon: "💬", href: "/admin/testimonios", color: "bg-accent-yellow" },
    { key: "faqs", label: "FAQs", icon: "❓", href: "/admin/faqs", color: "bg-hot-coral" },
    { key: "config", label: "Config", icon: "⚙️", href: "/admin/config", color: "bg-primary" },
] as const;

export default async function AdminDashboard() {
    const [{ counts, recentLeads }, cobros] = await Promise.all([getStats(), getCobros()]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white font-body">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Cobros y contenido del sitio
                    </p>
                </div>
                <Link
                    href="/admin/presupuestos"
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                    <span aria-hidden="true">🧾</span>
                    Armar presupuesto
                </Link>
            </div>

            {cobros && (
                <section aria-labelledby="cobros" className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 id="cobros" className="text-xl font-black text-white font-body">
                            💸 Cobros
                        </h2>
                        <Link href="/admin/clientes" className="text-primary text-sm font-bold hover:underline">
                            Ver clientes →
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <CifraCobro
                            etiqueta="Falta cobrar"
                            valor={cobros.falta}
                            clase={cobros.falta > 0 ? "text-accent-yellow" : "text-white"}
                            detalle={`De ${cobros.trabajos} ${cobros.trabajos === 1 ? "trabajo" : "trabajos"}${cobros.cuotasAtrasadas > 0 ? ` y ${cobros.cuotasAtrasadas} ${cobros.cuotasAtrasadas === 1 ? "cuota atrasada" : "cuotas atrasadas"}` : ""}`}
                        />
                        <CifraCobro
                            etiqueta="Entró este mes"
                            valor={cobros.entroEsteMes}
                            detalle={cobros.conMensual > 0 ? `Cuotas: ${cobros.pagaronEsteMes} de ${cobros.conMensual} pagadas` : undefined}
                        />
                        <CifraCobro etiqueta="Ganancia" valor={cobros.ganancia} clase="text-secondary" detalle={`Ya en mano: ${formatearPesos(cobros.gananciaCobrada)}`} />
                    </div>
                </section>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                        <p className="text-3xl font-black text-white font-body">
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
                    <h2 className="text-xl font-black text-white font-body">
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
                                        {lead.contact || "—"}
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

function CifraCobro({ etiqueta, valor, detalle, clase = "text-white" }: { etiqueta: string; valor: number; detalle?: string; clase?: string }) {
    return (
        <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{etiqueta}</p>
            <p className={`mt-1 font-display text-2xl font-bold tabular-nums ${clase}`}>{formatearPesos(valor)}</p>
            {detalle && <p className="mt-0.5 text-xs text-gray-500">{detalle}</p>}
        </div>
    );
}
