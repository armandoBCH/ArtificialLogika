"use client";

import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar_url: string;
    rating: number;
    badge: string;
    sort_order: number;
}

const BADGE_OPTIONS = ["Caso de Éxito", "Cliente Frecuente", "Recomendado", "Partner", "Nuevo"];

export default function TestimoniosPage() {
    const { data, loading, saving, create, update, remove } = useAdminData<Testimonial>("testimonials");
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [creating, setCreating] = useState(false);

    const empty: Partial<Testimonial> = {
        name: "", role: "", company: "", content: "", avatar_url: "",
        rating: 5, badge: "", sort_order: 0,
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

    const showForm = creating || editing;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">💬 Testimonios</h1>
                    <p className="text-gray-400 mt-1">Gestionar testimonios de clientes</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</span>
                                <input className="admin-input w-full" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rol / Puesto</span>
                                <input className="admin-input w-full" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa</span>
                                <input className="admin-input w-full" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
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
                            <textarea className="admin-input w-full" rows={3} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        </label>
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL de Avatar (opcional)</span>
                            <input className="admin-input w-full" placeholder="https://..." value={form.avatar_url || ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
                        </label>
                    </div>

                    {/* ── Rating & Badge ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">star</span>
                            Rating & Badge
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Visual Star Rating */}
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</span>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: star })}
                                            className={`text-2xl transition-all hover:scale-125 ${(form.rating || 0) >= star ? "grayscale-0" : "grayscale opacity-30"}`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Badge Quick Select */}
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Badge</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {BADGE_OPTIONS.map((b) => (
                                        <button
                                            key={b}
                                            type="button"
                                            onClick={() => setForm({ ...form, badge: form.badge === b ? "" : b })}
                                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${form.badge === b
                                                ? "bg-secondary text-black border-secondary"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Order ── */}
                    <div className="border-t border-white/10 pt-4">
                        <label className="space-y-1 inline-block">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden (1, 2, 3...)</span>
                            <input className="admin-input w-24" type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
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
                        <div key={t.id} className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5 flex items-start gap-4 hover:border-primary/30 transition-all">
                            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0 text-lg overflow-hidden">
                                {t.avatar_url ? <img src={t.avatar_url} alt={t.name} className="w-full h-full rounded-full object-cover" /> : t.name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold text-sm">{t.name}</h3>
                                    {t.badge && <span className="bg-secondary/20 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-sm">{t.badge}</span>}
                                </div>
                                <p className="text-gray-400 text-xs">{t.role} — {t.company}</p>
                                <p className="text-gray-300 text-sm mt-2 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
                                <p className="text-accent-yellow text-xs mt-1">{"⭐".repeat(t.rating || 5)}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
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
