"use client";

import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import type { Testimonial } from "@/lib/types/database";

const BADGE_OPTIONS = [
    { text: "Caso de Éxito", color: "bg-electric-blue/20 text-electric-blue" },
    { text: "Cliente Frecuente", color: "bg-mint/20 text-teal-700" },
    { text: "Recomendado", color: "bg-accent-yellow/20 text-yellow-700" },
    { text: "Servicios", color: "bg-primary/20 text-primary" },
    { text: "Gastronomía", color: "bg-mint/20 text-teal-700" },
    { text: "Profesional", color: "bg-hot-coral/20 text-red-700" },
];

export default function TestimoniosPage() {
    const { data, loading, saving, create, update, remove } = useAdminData<Testimonial>("testimonials");
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [creating, setCreating] = useState(false);

    const empty: Partial<Testimonial> = {
        name: "", role: "", quote: "", avatar_url: "",
        badge_text: "", badge_color: "", display_order: 0, is_active: true,
    };
    const [form, setForm] = useState<Partial<Testimonial>>(empty);

    function openCreate() { setForm(empty); setCreating(true); setEditing(null); }
    function openEdit(t: Testimonial) { setForm(t); setEditing(t); setCreating(false); }

    async function handleSave() {
        const ok = editing
            ? await update({ ...form, id: editing.id } as Testimonial)
            : await create(form);
        if (ok) { setEditing(null); setCreating(false); }
    }

    async function toggleVisibility(t: Testimonial) {
        await update({ ...t, is_active: !t.is_active });
    }

    const showForm = creating || editing;
    const activeCount = data.filter(t => t.is_active).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">💬 Testimonios</h1>
                    <p className="text-gray-400 mt-1">
                        Gestionar testimonios de clientes · <span className="text-secondary font-bold">{activeCount} visibles</span> de {data.length}
                    </p>
                </div>
                <button onClick={openCreate} className="bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    + Nuevo Testimonio
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-6 space-y-6">
                    <h2 className="text-xl font-black text-white font-display border-b border-white/10 pb-4">
                        {editing ? "✏️ Editar Testimonio" : "🆕 Nuevo Testimonio"}
                    </h2>

                    {/* ── Person Info ── */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">person</span>
                            Datos del Cliente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</span>
                                <input className="admin-input w-full" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rol / Puesto</span>
                                <input className="admin-input w-full" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                            </label>
                        </div>
                    </div>

                    {/* ── Content ── */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">format_quote</span>
                            Testimonio
                        </h3>
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contenido del testimonio</span>
                            <textarea className="admin-input w-full" rows={3} value={form.quote || ""} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
                        </label>
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL de Avatar (opcional)</span>
                            <input className="admin-input w-full" placeholder="https://..." value={form.avatar_url || ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
                        </label>
                    </div>

                    {/* ── Badge ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">label</span>
                            Badge
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {BADGE_OPTIONS.map((b) => (
                                <button
                                    key={b.text}
                                    type="button"
                                    onClick={() => setForm({
                                        ...form,
                                        badge_text: form.badge_text === b.text ? "" : b.text,
                                        badge_color: form.badge_text === b.text ? "" : b.color,
                                    })}
                                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${form.badge_text === b.text
                                        ? "bg-secondary text-black border-secondary"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    {b.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Order & Visibility ── */}
                    <div className="border-t border-white/10 pt-4 flex items-end gap-6">
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden (1, 2, 3...)</span>
                            <input className="admin-input w-24" type="number" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                            <div
                                className={`w-10 h-5 rounded-full relative transition-colors ${form.is_active ? "bg-secondary" : "bg-white/10"}`}
                                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${form.is_active ? "left-5" : "left-0.5"}`} />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${form.is_active ? "text-secondary" : "text-gray-500"}`}>
                                {form.is_active ? "Visible" : "Oculto"}
                            </span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={handleSave} disabled={saving} className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50">
                            {saving ? "Guardando..." : "💾 Guardar Testimonio"}
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
                <div className="space-y-3">
                    {data.map((t) => (
                        <div key={t.id} className={`bg-[#1e1530] border-2 rounded-sm p-5 flex items-start gap-4 transition-all ${t.is_active ? "border-white/10 hover:border-primary/30" : "border-white/5 opacity-50"}`}>
                            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0 text-lg overflow-hidden">
                                {t.avatar_url ? <img src={t.avatar_url} alt={t.name} className="w-full h-full rounded-full object-cover" /> : t.name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold text-sm">{t.name}</h3>
                                    {t.badge_text && <span className={`${t.badge_color || "bg-secondary/20 text-secondary"} text-[10px] font-bold px-2 py-0.5 rounded-sm`}>{t.badge_text}</span>}
                                    {!t.is_active && <span className="bg-white/10 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-sm">OCULTO</span>}
                                </div>
                                <p className="text-gray-400 text-xs">{t.role}</p>
                                <p className="text-gray-300 text-sm mt-2 line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Visibility Toggle */}
                                <button
                                    onClick={() => toggleVisibility(t)}
                                    className={`p-1.5 rounded text-xs font-bold transition-all ${t.is_active ? "text-secondary hover:bg-secondary/10" : "text-gray-500 hover:bg-white/10"}`}
                                    title={t.is_active ? "Ocultar" : "Mostrar"}
                                >
                                    <span className="material-icons text-sm">
                                        {t.is_active ? "visibility" : "visibility_off"}
                                    </span>
                                </button>
                                <button onClick={() => openEdit(t)} className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-xs font-bold transition-colors">Editar</button>
                                <button onClick={() => { if (confirm("¿Eliminar?")) remove(t.id); }} className="text-hot-coral text-xs font-bold hover:text-white transition-colors">🗑️</button>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                            <p className="text-gray-500">No hay testimonios aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
