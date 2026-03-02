"use client";

import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order: number;
}

const FAQ_CATEGORIES = ["General", "Precios", "Servicios", "Plazos", "Soporte", "Diseño"];

export default function FAQsPage() {
    const { data, loading, saving, create, update, remove } = useAdminData<FAQ>("faqs");
    const [editing, setEditing] = useState<FAQ | null>(null);
    const [creating, setCreating] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    const empty: Partial<FAQ> = { question: "", answer: "", category: "General", sort_order: 0 };
    const [form, setForm] = useState<Partial<FAQ>>(empty);

    function openCreate() { setForm(empty); setCreating(true); setEditing(null); }
    function openEdit(f: FAQ) { setForm(f); setEditing(f); setCreating(false); }

    async function handleSave() {
        const ok = editing
            ? await update({ ...form, id: editing.id } as FAQ)
            : await create(form);
        if (ok) { setEditing(null); setCreating(false); }
    }

    const showForm = creating || editing;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">❓ FAQs</h1>
                    <p className="text-gray-400 mt-1">Gestionar preguntas frecuentes</p>
                </div>
                <button onClick={openCreate} className="bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    + Nueva FAQ
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-6 space-y-6">
                    <h2 className="text-xl font-black text-white font-display border-b border-white/10 pb-4">
                        {editing ? "✏️ Editar FAQ" : "🆕 Nueva FAQ"}
                    </h2>

                    {/* ── Question ── */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">help_outline</span>
                            Pregunta
                        </h3>
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pregunta frecuente</span>
                            <input className="admin-input w-full text-lg" value={form.question || ""} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                        </label>
                    </div>

                    {/* ── Answer ── */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">chat_bubble_outline</span>
                            Respuesta
                        </h3>
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Respuesta detallada</span>
                            <textarea className="admin-input w-full" rows={4} value={form.answer || ""} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
                        </label>
                    </div>

                    {/* ── Category & Order ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">category</span>
                            Categoría & Orden
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {FAQ_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setForm({ ...form, category: cat.toLowerCase() })}
                                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${(form.category || "").toLowerCase() === cat.toLowerCase()
                                                ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden (1, 2, 3...)</span>
                                <input className="admin-input w-24" type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={handleSave} disabled={saving} className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50">
                            {saving ? "Guardando..." : "💾 Guardar FAQ"}
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
                <div className="space-y-2">
                    {data.map((f) => (
                        <div key={f.id} className="bg-[#1e1530] border-2 border-white/10 rounded-sm overflow-hidden hover:border-primary/30 transition-all">
                            <button
                                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 text-xs font-bold min-w-[24px]">#{f.sort_order}</span>
                                    <h3 className="text-white font-bold text-sm">{f.question}</h3>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-4">
                                    <span className="bg-white/5 text-gray-400 text-[10px] px-2 py-0.5 rounded-sm uppercase font-bold">{f.category}</span>
                                    <span className={`text-gray-400 transition-transform text-sm ${expanded === f.id ? "rotate-180" : ""}`}>▼</span>
                                </div>
                            </button>
                            {expanded === f.id && (
                                <div className="px-4 pb-4 border-t border-white/5">
                                    <p className="text-gray-300 text-sm mt-3 whitespace-pre-wrap">{f.answer}</p>
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5 justify-end">
                                        <button onClick={() => openEdit(f)} className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-xs font-bold transition-colors">Editar</button>
                                        <button onClick={() => { if (confirm("¿Eliminar?")) remove(f.id); }} className="text-hot-coral text-xs font-bold hover:text-white transition-colors">🗑️</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                            <p className="text-gray-500">No hay FAQs creadas aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
