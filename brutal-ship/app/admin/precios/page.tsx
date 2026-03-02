"use client";

import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface Feature {
    text: string;
    icon: string;
    is_highlighted: boolean;
    icon_bg: string;
}

interface Plan {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    original_price: number | null;
    currency: string;
    payment_type: string;
    price_note: string | null;
    features: Feature[];
    is_featured: boolean;
    featured_label: string | null;
    cta_text: string;
    cta_style: string;
    header_bg: string;
    display_order: number;
}

const CURRENCY_OPTIONS = ["USD", "ARS", "EUR"];
const PAYMENT_TYPE_OPTIONS = ["Pago Único", "Mensual", "Anual", "Por Proyecto"];
const FEATURE_ICON_OPTIONS = [
    { value: "check", label: "✓" },
    { value: "star", label: "★" },
    { value: "bolt", label: "⚡" },
    { value: "diamond", label: "💎" },
];

export default function PreciosPage() {
    const { data, loading, saving, create, update, remove } = useAdminData<Plan>("pricing_plans");
    const [editing, setEditing] = useState<Plan | null>(null);
    const [creating, setCreating] = useState(false);

    const emptyPlan: Partial<Plan> = {
        name: "", subtitle: "", price: 0, original_price: null, currency: "USD", payment_type: "Pago Único",
        price_note: "", features: [], is_featured: false, featured_label: "", cta_text: "Consultar",
        cta_style: "default", header_bg: "bg-ink-black", display_order: 0,
    };

    const [form, setForm] = useState<Partial<Plan>>(emptyPlan);

    function openCreate() { setForm(emptyPlan); setCreating(true); setEditing(null); }
    function openEdit(plan: Plan) { setForm(plan); setEditing(plan); setCreating(false); }

    async function handleSave() {
        if (editing) {
            const ok = await update({ ...form, id: editing.id } as Plan);
            if (ok) setEditing(null);
        } else {
            const ok = await create(form);
            if (ok) setCreating(false);
        }
    }

    async function handleDelete(id: string) {
        if (confirm("¿Eliminar este plan?")) await remove(id);
    }

    const showForm = creating || editing;

    // Feature helpers
    const addFeature = () => {
        const newFeature = { text: "", icon: "check", is_highlighted: false, icon_bg: "bg-accent-yellow" };
        setForm({ ...form, features: [...(form.features || []), newFeature] });
    };

    const updateFeature = (index: number, key: keyof Feature, value: string | boolean) => {
        const newFeatures = [...(form.features || [])];
        newFeatures[index] = { ...newFeatures[index], [key]: value };
        setForm({ ...form, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(form.features || [])];
        newFeatures.splice(index, 1);
        setForm({ ...form, features: newFeatures });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">💰 Precios</h1>
                    <p className="text-gray-400 mt-1">Gestionar planes de precios</p>
                </div>
                <button onClick={openCreate} className="bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    + Nuevo Plan
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-6 space-y-6">
                    <h2 className="text-xl font-black text-white font-display border-b border-white/10 pb-4">
                        {editing ? "✏️ Editar Plan" : "🆕 Nuevo Plan"}
                    </h2>

                    {/* ── SECTION 1: Basic Info ── */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">info</span>
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
                            <span className="material-icons text-base">payments</span>
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
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-icons text-base">checklist</span>
                                Características
                            </h3>
                            <button type="button" onClick={addFeature} className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                                <span className="material-icons text-sm">add_circle</span> Agregar
                            </button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {(form.features || []).map((feature, idx) => (
                                <div key={idx} className="flex gap-2 items-center bg-white/5 p-2.5 rounded-sm border border-white/10">
                                    <div className="flex gap-1 shrink-0">
                                        {FEATURE_ICON_OPTIONS.map((ico) => (
                                            <button
                                                key={ico.value}
                                                type="button"
                                                onClick={() => updateFeature(idx, "icon", ico.value)}
                                                className={`w-7 h-7 text-sm flex items-center justify-center rounded-sm border transition-all ${feature.icon === ico.value
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                                                    }`}
                                            >
                                                {ico.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input className="admin-input flex-1 text-sm py-1.5" placeholder="Texto de la característica" value={feature.text} onChange={(e) => updateFeature(idx, "text", e.target.value)} />
                                    <button
                                        type="button"
                                        onClick={() => updateFeature(idx, "is_highlighted", !feature.is_highlighted)}
                                        className={`px-2 py-1 text-[9px] font-bold uppercase border rounded-sm transition-all shrink-0 ${feature.is_highlighted
                                            ? "bg-[#F2FA5A] text-black border-black"
                                            : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {feature.is_highlighted ? "⭐ Destacada" : "Normal"}
                                    </button>
                                    <button type="button" onClick={() => removeFeature(idx)} className="text-hot-coral hover:text-white transition-colors shrink-0">🗑️</button>
                                </div>
                            ))}
                            {(!form.features || form.features.length === 0) && (
                                <p className="text-xs text-gray-500 italic py-4 text-center">No hay características. Hacé clic en &quot;Agregar&quot; para empezar.</p>
                            )}
                        </div>
                    </div>

                    {/* ── SECTION 4: CTA & Settings ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">settings</span>
                            Configuración
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Texto del Botón</span>
                                <input className="admin-input w-full" value={form.cta_text || ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden</span>
                                <input className="admin-input w-full" type="number" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
                            </label>
                            <div className="space-y-2 pt-4">
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
                        <button onClick={() => { setEditing(null); setCreating(false); }} className="text-gray-400 font-bold px-5 py-2 hover:text-white transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Plan Cards instead of Table */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.map((plan) => (
                        <div key={plan.id} className={`bg-[#1e1530] border-2 rounded-sm overflow-hidden flex flex-col transition-all hover:border-primary/40 ${plan.is_featured ? "border-[#F2FA5A]/40 ring-1 ring-[#F2FA5A]/20" : "border-white/10"}`}>
                            {/* Header */}
                            <div className={`p-4 border-b border-white/10 ${plan.is_featured ? "bg-[#F2FA5A]/10" : ""}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-white font-black text-lg">{plan.name}</h3>
                                    {plan.is_featured && (
                                        <span className="bg-[#F2FA5A]/20 text-[#F2FA5A] text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider border border-[#F2FA5A]/30">
                                            {plan.featured_label || "Destacado"}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-xs">{plan.subtitle}</p>
                            </div>

                            {/* Price */}
                            <div className="p-4 flex items-baseline gap-2">
                                {plan.original_price && (
                                    <span className="text-gray-500 text-sm line-through font-mono">${plan.original_price}</span>
                                )}
                                <span className="text-white text-2xl font-black">${plan.price?.toLocaleString()}</span>
                                <span className="text-gray-400 text-xs font-bold">{plan.currency} · {plan.payment_type}</span>
                            </div>

                            {/* Features count */}
                            <div className="px-4 pb-4 flex-1">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="material-icons text-sm">checklist</span>
                                    {plan.features?.length || 0} características
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-mono">#{plan.display_order}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(plan)} className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-xs font-bold transition-colors">Editar</button>
                                    <button onClick={() => handleDelete(plan.id)} className="text-hot-coral text-xs font-bold hover:text-white transition-colors">🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                            <p className="text-gray-500">No hay planes creados aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
