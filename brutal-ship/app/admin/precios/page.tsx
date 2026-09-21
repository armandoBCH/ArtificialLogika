"use client";

import { useMemo, useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import AdminError from "../components/AdminError";
import PlansBoard from "./PlansBoard";
import FeatureEditor, { conClaves, sinClaves, type EditableFeature, type PlanFeature } from "./FeatureEditor";

interface Plan {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    original_price: number | null;
    currency: string;
    payment_type: string;
    price_note: string | null;
    features: PlanFeature[];
    is_featured: boolean;
    featured_label: string | null;
    cta_text: string;
    cta_style: string;
    header_bg: string;
    display_order: number;
    is_active: boolean;
    created_at?: string;
}

const CURRENCY_OPTIONS = ["ARS", "USD", "EUR"];
const PAYMENT_TYPE_OPTIONS = ["Pago Único", "Mensual", "Anual", "Por Proyecto"];

const normalizar = (s: string) => s.trim().toLowerCase();

export default function PreciosPage() {
    const { data, loading, saving, create, update, remove, reorder, error } = useAdminData<Plan>("pricing_plans");
    const [editing, setEditing] = useState<Plan | null>(null);
    const [creating, setCreating] = useState(false);

    const emptyPlan: Partial<Plan> = {
        name: "", subtitle: "", price: 0, original_price: null, currency: "ARS", payment_type: "Pago Único",
        price_note: "", is_featured: false, featured_label: "", cta_text: "Consultar",
        cta_style: "default", header_bg: "bg-ink-black", display_order: 0, is_active: true,
    };

    const [form, setForm] = useState<Partial<Plan>>(emptyPlan);
    // Las caracteristicas viven aparte del resto del formulario porque llevan
    // una clave de edicion que no tiene que llegar a la base.
    const [features, setFeatures] = useState<EditableFeature[]>([]);

    function openCreate() {
        // Nace al final. Con display_order 0 caia arriba de todo.
        const last = data.reduce((max, p) => Math.max(max, p.display_order || 0), 0);
        setForm({ ...emptyPlan, display_order: last + 1 });
        setFeatures([]);
        setCreating(true);
        setEditing(null);
    }

    function openEdit(plan: Plan) {
        setForm(plan);
        setFeatures(conClaves(plan.features));
        setEditing(plan);
        setCreating(false);
    }

    function closeForm() {
        setEditing(null);
        setCreating(false);
    }

    async function handleSave() {
        const payload = { ...form, features: sinClaves(features).filter((f) => f.text.trim()) };
        const ok = editing
            ? await update({ ...payload, id: editing.id } as Plan)
            : await create(payload);
        if (ok) closeForm();
    }

    async function handleDelete(id: string) {
        if (confirm("¿Eliminar este plan?")) await remove(id);
    }

    const showForm = creating || editing;

    // Caracteristicas que tienen los otros planes y este no: se copian de un clic,
    // con su icono y su color. Asi "Mockup previo gratis" se repite igual en todos.
    const fromOtherPlans = useMemo(() => {
        const propias = new Set(features.map((f) => normalizar(f.text)));
        const vistas = new Set<string>();
        const out: PlanFeature[] = [];
        for (const plan of data) {
            if (editing && plan.id === editing.id) continue;
            for (const f of plan.features ?? []) {
                const k = normalizar(f.text ?? "");
                if (!k || propias.has(k) || vistas.has(k)) continue;
                vistas.add(k);
                out.push(f);
            }
        }
        return out;
    }, [data, editing, features]);

    const usedIcons = useMemo(() => {
        const set = new Set<string>();
        for (const plan of data) for (const f of plan.features ?? []) if (f.icon) set.add(f.icon);
        for (const f of features) if (f.icon) set.add(f.icon);
        return Array.from(set);
    }, [data, features]);

    const position = editing ? data.findIndex((p) => p.id === editing.id) + 1 : 0;

    return (
        <div className="space-y-6">
            <AdminError mensaje={error} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-body">💰 Precios</h1>
                    <p className="text-gray-400 mt-1">Gestionar planes de precios. Arrastrá las tarjetas para elegir el orden del sitio.</p>
                </div>
                <button onClick={openCreate} className="bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    + Nuevo Plan
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-6 space-y-6">
                    <h2 className="text-xl font-black text-white font-body border-b border-white/10 pb-4">
                        {editing ? "✏️ Editar Plan" : "🆕 Nuevo Plan"}
                    </h2>

                    {/* ── SECTION 1: Basic Info ── */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-base">info</span>
                            Información del Plan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre del plan</span>
                                <input className="admin-input w-full" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subtítulo</span>
                                <input className="admin-input w-full" placeholder="Descripción corta" value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                            </label>
                        </div>
                    </div>

                    {/* ── SECTION 2: Pricing ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-base">payments</span>
                            Precios
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio</span>
                                <input className="admin-input w-full text-xl font-black" type="number" value={form.price || 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio Original</span>
                                <input className="admin-input w-full line-through opacity-60" type="number" placeholder="Opcional" value={form.original_price || ""} onChange={(e) => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })} />
                                <p className="text-[9px] text-gray-600">Se mostrará tachado</p>
                            </label>
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Moneda</span>
                                <div className="flex gap-1.5 mt-1">
                                    {CURRENCY_OPTIONS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setForm({ ...form, currency: c })}
                                            className={`px-3 py-1.5 text-xs font-bold border-2 rounded-sm transition-all ${form.currency === c
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Pago</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {PAYMENT_TYPE_OPTIONS.map((pt) => (
                                        <button
                                            key={pt}
                                            type="button"
                                            onClick={() => setForm({ ...form, payment_type: pt })}
                                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${form.payment_type === pt
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            {pt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <label className="space-y-1 block">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nota de Precio (opcional)</span>
                            <input className="admin-input w-full" placeholder="Ej: IVA incluido, Precio Promo" value={form.price_note || ""} onChange={(e) => setForm({ ...form, price_note: e.target.value })} />
                        </label>
                    </div>

                    {/* ── SECTION 3: Features ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-base">checklist</span>
                            Características
                        </h3>
                        <FeatureEditor
                            features={features}
                            onChange={setFeatures}
                            fromOtherPlans={fromOtherPlans}
                            usedIcons={usedIcons}
                        />
                    </div>

                    {/* ── SECTION 4: CTA & Settings ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span aria-hidden="true" className="material-icons text-base">settings</span>
                            Configuración
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Texto del Botón</span>
                                <input className="admin-input w-full" value={form.cta_text || ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
                            </label>
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Posición</span>
                                <p className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-sm px-3 py-2">
                                    <span aria-hidden="true" className="material-icons text-[18px] text-primary">drag_indicator</span>
                                    {editing
                                        ? <>Está en el lugar <strong className="text-white font-black">#{position}</strong>. Se cambia arrastrando la tarjeta.</>
                                        : <>Se agrega al final. Después lo movés arrastrando.</>}
                                </p>
                            </div>
                            <div className="space-y-2 pt-4">
                                <label className="flex items-center gap-2 text-secondary text-sm font-bold cursor-pointer">
                                    <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 bg-black border-2 border-white/20 rounded accent-secondary" />
                                    Visible en el sitio
                                </label>
                                <label className="flex items-center gap-2 text-[#F2FA5A] text-sm font-bold cursor-pointer">
                                    <input type="checkbox" checked={form.is_featured || false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-5 h-5 bg-black border-2 border-white/20 rounded accent-[#F2FA5A]" />
                                    Plan Destacado
                                </label>
                                {form.is_featured && (
                                    <input className="admin-input w-full" placeholder="Ej: 🔥 Más Elegido" value={form.featured_label || ""} onChange={(e) => setForm({ ...form, featured_label: e.target.value })} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={handleSave} disabled={saving} className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50">
                            {saving ? "Guardando..." : "💾 Guardar Plan"}
                        </button>
                        <button onClick={closeForm} className="text-gray-400 font-bold px-5 py-2 hover:text-white transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <PlansBoard
                plans={data}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleActive={(plan) => update({ id: plan.id, is_active: !plan.is_active })}
                onReorder={reorder}
            />
        </div>
    );
}
