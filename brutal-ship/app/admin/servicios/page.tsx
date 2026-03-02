"use client";

import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface ServiceFeature {
    text: string;
    visible: boolean;
    order: number;
}

interface Service {
    id: string;
    name: string;
    description: string;
    price_from: string;
    icon: string;
    icon_color: string;
    accent_color: string;
    features: ServiceFeature[];
    is_popular: boolean;
    popular_label: string | null;
    cta_text: string;
    cta_style: "primary" | "secondary" | "default";
    display_order: number;
    is_active: boolean;
}

const ICON_OPTIONS = [
    { value: "web", label: "Web" },
    { value: "track_changes", label: "Landing" },
    { value: "layers", label: "Multi-Pág" },
    { value: "shopping_cart", label: "E-commerce" },
    { value: "phone_iphone", label: "Mobile" },
    { value: "brush", label: "Diseño" },
    { value: "code", label: "Código" },
    { value: "campaign", label: "Marketing" },
    { value: "speed", label: "Performance" },
];

const CTA_STYLE_OPTIONS = [
    { value: "default", label: "Normal" },
    { value: "primary", label: "Primario (Destacado)" },
    { value: "secondary", label: "Secundario" },
];

/** Normalize legacy string[] features to ServiceFeature[] */
function normalizeFeatures(raw: unknown): ServiceFeature[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((f, i) => {
        if (typeof f === "string") return { text: f, visible: true, order: i };
        return {
            text: f.text || "",
            visible: f.visible !== false,
            order: typeof f.order === "number" ? f.order : i,
        };
    });
}

// ─── Feature List Item ──────────────────────────────
function FeatureItem({
    feature,
    index,
    total,
    onToggle,
    onChangeText,
    onMoveUp,
    onMoveDown,
    onRemove,
}: {
    feature: ServiceFeature;
    index: number;
    total: number;
    onToggle: () => void;
    onChangeText: (text: string) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
}) {
    return (
        <div className={`flex items-center gap-2 p-2.5 rounded-sm border-2 transition-all ${feature.visible
            ? "bg-white/5 border-white/10"
            : "bg-white/[0.02] border-white/5 opacity-50"
            }`}>
            {/* Visibility toggle */}
            <button
                type="button"
                onClick={onToggle}
                title={feature.visible ? "Ocultar feature" : "Mostrar feature"}
                className={`w-7 h-7 flex items-center justify-center rounded-sm border-2 shrink-0 transition-all ${feature.visible
                    ? "bg-mint-fresh/20 border-mint-fresh/40 text-mint-fresh"
                    : "bg-white/5 border-white/10 text-gray-600"
                    }`}
            >
                <span className="material-icons text-sm">
                    {feature.visible ? "visibility" : "visibility_off"}
                </span>
            </button>

            {/* Text input */}
            <input
                className="admin-input flex-1 text-sm"
                value={feature.text}
                onChange={(e) => onChangeText(e.target.value)}
                placeholder="Texto del feature..."
            />

            {/* Order buttons */}
            <div className="flex flex-col gap-0.5 shrink-0">
                <button
                    type="button"
                    onClick={onMoveUp}
                    disabled={index === 0}
                    className="w-6 h-5 flex items-center justify-center rounded-sm text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
                    title="Mover arriba"
                >
                    <span className="material-icons text-xs">keyboard_arrow_up</span>
                </button>
                <button
                    type="button"
                    onClick={onMoveDown}
                    disabled={index === total - 1}
                    className="w-6 h-5 flex items-center justify-center rounded-sm text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
                    title="Mover abajo"
                >
                    <span className="material-icons text-xs">keyboard_arrow_down</span>
                </button>
            </div>

            {/* Remove */}
            <button
                type="button"
                onClick={onRemove}
                className="w-7 h-7 flex items-center justify-center rounded-sm text-hot-coral/60 hover:text-hot-coral hover:bg-hot-coral/10 transition-all shrink-0"
                title="Eliminar feature"
            >
                <span className="material-icons text-sm">close</span>
            </button>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────
export default function ServiciosPage() {
    const { data: rawData, loading, saving, create, update, remove } = useAdminData<Service>("services");
    const [editing, setEditing] = useState<Service | null>(null);
    const [creating, setCreating] = useState(false);

    // Normalize features on loaded data
    const data = rawData.map((s) => ({
        ...s,
        features: normalizeFeatures(s.features),
    }));

    const empty: Partial<Service> = {
        name: "", description: "", price_from: "", icon: "web",
        icon_color: "text-primary", accent_color: "border-primary",
        features: [], is_popular: false, popular_label: "",
        cta_text: "Consultar", cta_style: "default",
        display_order: 0, is_active: true
    };

    const [form, setForm] = useState<Partial<Service>>(empty);

    function openCreate() { setForm(empty); setCreating(true); setEditing(null); }
    function openEdit(s: Service) { setForm(s); setEditing(s); setCreating(false); }

    async function handleSave() {
        // Re-index feature orders before saving
        const reindexedFeatures = (form.features || []).map((f, i) => ({ ...f, order: i }));
        const payload = { ...form, features: reindexedFeatures };

        const ok = editing
            ? await update({ ...payload, id: editing.id } as Service)
            : await create(payload);
        if (ok) { setEditing(null); setCreating(false); }
    }

    // ─── Feature helpers ──────────────────
    const features = form.features || [];

    function setFeatures(newFeatures: ServiceFeature[]) {
        setForm({ ...form, features: newFeatures });
    }

    function addFeature() {
        setFeatures([...features, { text: "", visible: true, order: features.length }]);
    }

    function removeFeature(index: number) {
        setFeatures(features.filter((_, i) => i !== index));
    }

    function toggleFeature(index: number) {
        setFeatures(features.map((f, i) => i === index ? { ...f, visible: !f.visible } : f));
    }

    function updateFeatureText(index: number, text: string) {
        setFeatures(features.map((f, i) => i === index ? { ...f, text } : f));
    }

    function moveFeature(index: number, direction: -1 | 1) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= features.length) return;
        const newFeatures = [...features];
        [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
        setFeatures(newFeatures);
    }

    const showForm = creating || editing;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">⚡ Servicios</h1>
                    <p className="text-gray-400 mt-1">Gestionar servicios ofrecidos</p>
                </div>
                <button onClick={openCreate} className="bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    + Nuevo Servicio
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-6 space-y-6">
                    <h2 className="text-xl font-black text-white font-display border-b border-white/10 pb-4">
                        {editing ? "✏️ Editar Servicio" : "🆕 Nuevo Servicio"}
                    </h2>

                    {/* ── SECTION 1: Info ── */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">info</span>
                            Información
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre del servicio</span>
                                <input className="admin-input w-full" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio &quot;desde&quot;</span>
                                <input className="admin-input w-full" placeholder="Ej: Desde $149" value={form.price_from || ""} onChange={(e) => setForm({ ...form, price_from: e.target.value })} />
                            </label>
                            <label className="space-y-1 md:col-span-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción breve</span>
                                <textarea className="admin-input w-full" rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </label>
                        </div>
                    </div>

                    {/* ── SECTION 2: Icon Picker ── */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">emoji_emotions</span>
                            Ícono
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {ICON_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, icon: opt.value })}
                                    className={`flex items-center gap-2 px-3 py-2 border-2 rounded-sm text-sm font-bold transition-all ${form.icon === opt.value
                                        ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    <span className="material-icons text-lg">{opt.value}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── SECTION 3: Features (Orderable + Selectable) ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-icons text-base">checklist</span>
                                Ventajas / Features
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span className="material-icons text-xs text-mint-fresh">visibility</span>
                                    = visible en web
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons text-xs">swap_vert</span>
                                    = reordenar
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            {features.map((feature, index) => (
                                <FeatureItem
                                    key={index}
                                    feature={feature}
                                    index={index}
                                    total={features.length}
                                    onToggle={() => toggleFeature(index)}
                                    onChangeText={(text) => updateFeatureText(index, text)}
                                    onMoveUp={() => moveFeature(index, -1)}
                                    onMoveDown={() => moveFeature(index, 1)}
                                    onRemove={() => removeFeature(index)}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addFeature}
                            className="w-full py-2 border-2 border-dashed border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider rounded-sm hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-1.5"
                        >
                            <span className="material-icons text-sm">add</span>
                            Agregar Feature
                        </button>

                        <p className="text-[10px] text-gray-500">
                            Usá el ojo para mostrar/ocultar features en la web. Las flechas reordenan su posición.
                        </p>
                    </div>

                    {/* ── SECTION 4: CTA & Order ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">smart_button</span>
                            Botón & Orden
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Texto del Botón</span>
                                <input className="admin-input w-full" value={form.cta_text || ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
                            </label>
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estilo del Botón</span>
                                <div className="flex gap-2 mt-1">
                                    {CTA_STYLE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, cta_style: opt.value as Service["cta_style"] })}
                                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${form.cta_style === opt.value
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden</span>
                                <input className="admin-input w-full" type="number" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
                            </label>
                        </div>
                    </div>

                    {/* ── SECTION 5: Flags ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-mint-fresh text-sm font-bold cursor-pointer">
                                <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 bg-black border-2 border-white/20 rounded accent-mint-fresh" />
                                Activo (Visible en la página)
                            </label>
                            <label className="flex items-center gap-2 text-[#F2FA5A] text-sm font-bold cursor-pointer">
                                <input type="checkbox" checked={form.is_popular || false} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="w-5 h-5 bg-black border-2 border-white/20 rounded accent-[#F2FA5A]" />
                                Marcar como &quot;Popular&quot;
                            </label>
                        </div>
                        {form.is_popular && (
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Etiqueta Popular</span>
                                <input className="admin-input w-full" placeholder="Ej: Más Vendido" value={form.popular_label || ""} onChange={(e) => setForm({ ...form, popular_label: e.target.value })} />
                            </label>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={handleSave} disabled={saving} className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50">
                            {saving ? "Guardando..." : "💾 Guardar Servicio"}
                        </button>
                        <button onClick={() => { setEditing(null); setCreating(false); }} className="text-gray-400 font-bold px-5 py-2 hover:text-white transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.map((s) => {
                        const visibleCount = s.features.filter((f) => f.visible).length;
                        const totalCount = s.features.length;
                        return (
                            <div key={s.id} className={`bg-[#1e1530] border-2 rounded-sm p-5 flex flex-col gap-3 transition-all hover:border-primary/40 ${s.is_active ? "border-white/10" : "border-white/5 opacity-60"}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 border border-primary/40 rounded-sm flex items-center justify-center">
                                            <span className="material-icons text-primary text-xl">{s.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-base leading-tight">{s.name}</h3>
                                            <p className="text-primary text-xs font-mono font-bold">{s.price_from}</p>
                                        </div>
                                    </div>
                                    {s.is_popular && (
                                        <span className="bg-[#F2FA5A]/20 text-[#F2FA5A] text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider border border-[#F2FA5A]/30">
                                            {s.popular_label || "Popular"}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-400 text-xs line-clamp-2">{s.description}</p>

                                {s.features && s.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {s.features
                                            .filter((f) => f.visible)
                                            .sort((a, b) => a.order - b.order)
                                            .slice(0, 3)
                                            .map((f, i) => (
                                                <span key={i} className="bg-white/5 border border-white/10 text-gray-300 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">{f.text}</span>
                                            ))}
                                        {visibleCount > 3 && (
                                            <span className="text-gray-500 text-[9px] font-bold self-center">+{visibleCount - 3} más</span>
                                        )}
                                        {totalCount > visibleCount && (
                                            <span className="text-gray-600 text-[9px] font-bold self-center ml-1">({totalCount - visibleCount} ocultos)</span>
                                        )}
                                    </div>
                                )}

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className={`${s.is_active ? "text-mint-fresh" : "text-gray-600"}`}>{s.is_active ? "✔ Activo" : "❌ Oculto"}</span>
                                        <span className="text-gray-600">·</span>
                                        <span className="text-gray-500 font-mono">#{s.display_order}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(s)} className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-xs font-bold transition-colors">Editar</button>
                                        <button onClick={() => { if (confirm("¿Eliminar este servicio?")) remove(s.id); }} className="text-hot-coral text-xs font-bold hover:text-white transition-colors">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {data.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                            <p className="text-gray-500">No hay servicios creados aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
