"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface PortfolioStat {
    value: string;
    label: string;
}

interface ServiceData {
    name: string;
    features: string[];
    icon: string;
}

interface PortfolioProject {
    id: string;
    title: string;
    category: string;
    external_url: string | null;
    applied_services: string[];
    applied_features: string[];
    tags: string[];
    description: string;
    image_url: string;
    image_alt: string;
    accent_color: string;
    stats: PortfolioStat[];
    display_order: number;
    is_active: boolean;
    is_sample: boolean;
}

const CATEGORY_OPTIONS = [
    "E-commerce", "Restaurante", "Peluquería", "Profesional",
    "Salud", "Educación", "Inmobiliaria", "Tecnología", "Otro",
];

export default function PortafolioPage() {
    const { data, loading, saving, create, update, remove } = useAdminData<PortfolioProject>("portfolio_projects");
    const [editing, setEditing] = useState<PortfolioProject | null>(null);
    const [creating, setCreating] = useState(false);
    const [availableServices, setAvailableServices] = useState<ServiceData[]>([]);

    useEffect(() => {
        fetch("/api/admin/services")
            .then((res) => res.json())
            .then((services: ServiceData[]) => {
                setAvailableServices(services);
            })
            .catch(() => setAvailableServices([]));
    }, []);

    const empty: Partial<PortfolioProject> = {
        title: "", description: "", category: "",
        image_url: "", image_alt: "", accent_color: "primary",
        external_url: "", applied_services: [], applied_features: [],
        tags: [], stats: [], is_active: true, is_sample: false, display_order: 0,
    };

    const [form, setForm] = useState<Partial<PortfolioProject>>(empty);

    function openCreate() { setForm(empty); setCreating(true); setEditing(null); }
    function openEdit(p: PortfolioProject) { setForm(p); setEditing(p); setCreating(false); }

    async function handleSave() {
        const payload = { ...form };
        const ok = editing
            ? await update({ ...payload, id: editing.id } as PortfolioProject)
            : await create(payload);
        if (ok) { setEditing(null); setCreating(false); }
    }

    const showForm = creating || editing;

    // Helper: toggle service
    const toggleService = (svcName: string) => {
        const current = form.applied_services || [];
        if (current.includes(svcName)) {
            // Remove service and its features
            const svc = availableServices.find(s => s.name === svcName);
            const featsToRemove = svc?.features || [];
            setForm({
                ...form,
                applied_services: current.filter(s => s !== svcName),
                applied_features: (form.applied_features || []).filter(f => !featsToRemove.includes(f)),
            });
        } else {
            setForm({ ...form, applied_services: [...current, svcName] });
        }
    };

    // Helper: toggle feature
    const toggleFeature = (feat: string) => {
        const current = form.applied_features || [];
        if (current.includes(feat)) {
            setForm({ ...form, applied_features: current.filter(f => f !== feat) });
        } else {
            setForm({ ...form, applied_features: [...current, feat] });
        }
    };

    // Get all features from selected services
    const selectedServiceFeatures = availableServices
        .filter(s => (form.applied_services || []).includes(s.name))
        .flatMap(s => s.features);

    // Helpers for stats array
    const addStat = () => {
        const newStat = { value: "+100%", label: "Nueva métrica" };
        setForm({ ...form, stats: [...(form.stats || []), newStat] });
    };

    const updateStat = (index: number, key: keyof PortfolioStat, val: string) => {
        const newStats = [...(form.stats || [])];
        newStats[index] = { ...newStats[index], [key]: val };
        setForm({ ...form, stats: newStats });
    };

    const removeStat = (index: number) => {
        const newStats = [...(form.stats || [])];
        newStats.splice(index, 1);
        setForm({ ...form, stats: newStats });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">🎨 Portafolio</h1>
                    <p className="text-gray-400 mt-1">Gestionar proyectos del portafolio</p>
                </div>
                <button onClick={openCreate} className="bg-primary text-white font-bold px-5 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    + Nuevo Proyecto
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-6 space-y-6">
                    <h2 className="text-xl font-black text-white font-display border-b border-white/10 pb-4">
                        {editing ? "✏️ Editar Proyecto" : "🆕 Nuevo Proyecto"}
                    </h2>

                    {/* ── SECTION 1: Basic Info ── */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">info</span>
                            Información Básica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título del Proyecto</span>
                                <input className="admin-input w-full" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </label>
                            <label className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setForm({ ...form, category: cat })}
                                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${form.category === cat
                                                ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </label>
                            <label className="space-y-1 md:col-span-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción del proyecto</span>
                                <textarea className="admin-input w-full" rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </label>
                        </div>
                    </div>

                    {/* ── SECTION 2: Media ── */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">image</span>
                            Imagen & URL
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1 md:col-span-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL de la Imagen</span>
                                <input className="admin-input w-full" placeholder="https://..." value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                            </label>
                            <label className="space-y-1 md:col-span-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL del Sitio Web del Cliente</span>
                                <input className="admin-input w-full" placeholder="https://www.ejemplo-cliente.com" value={form.external_url || ""} onChange={(e) => setForm({ ...form, external_url: e.target.value || null })} />
                                <p className="text-[10px] text-gray-500">Se mostrará un botón &quot;Visitar Sitio Web&quot; en la página de detalle.</p>
                            </label>
                        </div>
                    </div>

                    {/* ── SECTION 3: Services - Visual Cards ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">build_circle</span>
                            Servicios Aplicados
                        </h3>
                        <p className="text-[10px] text-gray-500">Tocá los servicios que se usaron en este proyecto.</p>

                        {availableServices.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {availableServices.map((svc) => {
                                    const isSelected = (form.applied_services || []).includes(svc.name);
                                    return (
                                        <button
                                            key={svc.name}
                                            type="button"
                                            onClick={() => toggleService(svc.name)}
                                            className={`p-4 border-2 rounded-sm text-left transition-all flex flex-col gap-2 ${isSelected
                                                ? "bg-[#9b51e0] text-white border-[#9b51e0] shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] scale-[1.02]"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`material-icons text-xl ${isSelected ? "text-white" : "text-gray-500"}`}>
                                                    {svc.icon || "web"}
                                                </span>
                                                <span className="font-black text-sm uppercase tracking-wide">{svc.name}</span>
                                            </div>
                                            <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-white/70" : "text-gray-600"}`}>
                                                {isSelected ? "✓ Seleccionado" : "Clic para agregar"}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No hay servicios cargados. Cargá servicios primero.</p>
                        )}
                    </div>

                    {/* ── SECTION 4: Features (only if services selected) ── */}
                    {selectedServiceFeatures.length > 0 && (
                        <div className="space-y-3 border-t border-white/10 pt-4">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-icons text-base">auto_awesome</span>
                                Sub-servicios Incluidos
                            </h3>
                            <p className="text-[10px] text-gray-500">Seleccioná qué sub-servicios son relevantes para este proyecto. No es necesario seleccionarlos todos.</p>

                            <div className="flex flex-wrap gap-2">
                                {selectedServiceFeatures.map((feat) => {
                                    const isActive = (form.applied_features || []).includes(feat);
                                    return (
                                        <button
                                            key={feat}
                                            type="button"
                                            onClick={() => toggleFeature(feat)}
                                            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 rounded-sm transition-all flex items-center gap-1.5 ${isActive
                                                ? "bg-white text-black border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                                                : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
                                                }`}
                                        >
                                            <span className="material-icons text-sm">
                                                {isActive ? "check_box" : "check_box_outline_blank"}
                                            </span>
                                            {feat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── SECTION 5: Tags ── */}
                    <div className="space-y-1 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons text-base">label</span>
                            Etiquetas / Tags
                        </h3>
                        <input className="admin-input w-full" placeholder="React, Next.js, Diseño Web" value={(form.tags || []).join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
                        <p className="text-[10px] text-gray-500">Tags extra visibles en la tarjeta de preview (separados por coma).</p>
                    </div>

                    {/* ── SECTION 6: Stats ── */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-icons text-base">bar_chart</span>
                                Métricas de Impacto
                            </h3>
                            <button type="button" onClick={addStat} className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                                <span className="material-icons text-sm">add_circle</span> Agregar Métrica
                            </button>
                        </div>
                        {(form.stats || []).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(form.stats || []).map((stat, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-sm flex items-center gap-3">
                                        <input className="admin-input w-20 text-center font-black" placeholder="+50%" value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
                                        <input className="admin-input flex-1" placeholder="Descripción" value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
                                        <button type="button" onClick={() => removeStat(i)} className="text-hot-coral hover:text-white transition-colors text-sm">🗑️</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">Sin métricas. Podés agregar resultados como &quot;+300% consultas&quot;.</p>
                        )}
                    </div>

                    {/* ── SECTION 7: Settings ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <label className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden (1, 2, 3...)</span>
                            <input className="admin-input w-full" type="number" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
                        </label>
                        <div className="flex items-center pt-5 gap-6">
                            <label className="flex items-center gap-2 text-mint-fresh text-sm font-bold cursor-pointer">
                                <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 bg-black border-2 border-white/20 rounded accent-mint-fresh" />
                                Activo (Visible)
                            </label>
                            <label className="flex items-center gap-2 text-[#F2FA5A] text-sm font-bold cursor-pointer">
                                <input type="checkbox" checked={form.is_sample ?? false} onChange={(e) => setForm({ ...form, is_sample: e.target.checked })} className="w-5 h-5 bg-black border-2 border-white/20 rounded accent-[#F2FA5A]" />
                                Es Muestra
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={handleSave} disabled={saving} className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50">
                            {saving ? "Guardando..." : "💾 Guardar Proyecto"}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((p) => (
                        <div key={p.id} className="bg-[#1e1530] border-2 border-white/10 rounded-sm overflow-hidden group hover:border-primary/40 transition-all flex flex-col">
                            {p.image_url ? (
                                <div className="h-48 bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/5 relative">
                                    <img src={p.image_url} alt={p.image_alt || p.title} className="w-full h-full object-cover" />
                                    {!p.is_active && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                                            <span className="bg-hot-coral text-white font-bold px-3 py-1 rounded text-sm shadow-neobrutalism-sm">OCULTO</span>
                                        </div>
                                    )}
                                    {p.is_sample && (
                                        <div className="absolute top-2 right-2 z-20">
                                            <span className="bg-[#F2FA5A] text-black font-black px-2 py-0.5 rounded-sm text-xs shadow-[2px_2px_0px_#000] border border-black transform rotate-3 inline-block">MUESTRA</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-48 bg-white/5 flex items-center justify-center border-b border-white/5 relative">
                                    <span className="text-gray-500 font-mono text-sm">Sin Imagen</span>
                                    {!p.is_active && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                                            <span className="bg-hot-coral text-white font-bold px-3 py-1 rounded text-sm shadow-neobrutalism-sm">OCULTO</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-white font-bold text-lg leading-tight">{p.title}</h3>
                                </div>
                                <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{p.category}</p>

                                {/* Show applied services in card */}
                                {p.applied_services && p.applied_services.length > 0 && (
                                    <div className="flex gap-1.5 flex-wrap mb-3">
                                        {p.applied_services.map((svc) => (
                                            <span key={svc} className="bg-[#9b51e0]/20 text-[#9b51e0] text-[9px] px-2 py-0.5 rounded-sm uppercase font-black tracking-wider border border-[#9b51e0]/30">{svc}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 flex-wrap mb-4 flex-1 content-start">
                                    {p.tags?.map((tag) => (
                                        <span key={tag} className="bg-white/5 border border-white/10 text-gray-300 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider">{tag}</span>
                                    ))}
                                </div>

                                {/* External URL indicator */}
                                {p.external_url && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-mint-fresh font-bold mb-3">
                                        <span className="material-icons text-xs">language</span>
                                        Tiene sitio web vinculado
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-mono">Orden: {p.display_order}</span>
                                    <div className="flex gap-3">
                                        <button onClick={() => openEdit(p)} className="text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm font-bold transition-colors">Editar</button>
                                        <button onClick={() => { if (confirm("¿Eliminar este proyecto definitivamente?")) remove(p.id); }} className="text-hot-coral px-2 text-sm font-bold hover:text-white transition-colors" title="Eliminar">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-white/10 rounded-sm">
                            <p className="text-gray-500">No hay proyectos en el portafolio aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
