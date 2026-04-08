"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAdminData } from "../hooks/useAdminData";
import dynamic from "next/dynamic";

const ScreenshotCropModal = dynamic(() => import("../components/ScreenshotCropModal"), { ssr: false });

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
    categories: string[];
    external_url: string | null;
    applied_services: string[];
    applied_features: string[];
    tags: string[];
    description: string;
    description_long: string;
    image_url: string;
    image_url_wide: string;
    image_alt: string;
    accent_color: string;
    stats: PortfolioStat[];
    display_order: number;
    is_active: boolean;
    is_sample: boolean;
}

// Tag suggestions by category
const TAG_SUGGESTIONS: Record<string, string[]> = {
    "E-commerce": ["Tienda Online", "Carrito de Compras", "Pagos Online", "MercadoPago", "Catálogo", "Stock", "Envíos", "WooCommerce", "Shopify"],
    "Restaurante": ["Menú Digital", "Reservas", "Delivery", "Carta Online", "WhatsApp Pedidos", "Gastronomía", "QR"],
    "Peluquería": ["Turnos Online", "Galería", "Reservas", "Belleza", "Estética", "Barbería", "Salón"],
    "Profesional": ["Portfolio", "CV Online", "Landing Page", "Contacto", "Freelancer", "Consultoría"],
    "Salud": ["Turnos", "Pacientes", "Clínica", "Consultorio", "Médico", "Odontología", "Nutrición"],
    "Educación": ["Cursos", "Plataforma", "E-learning", "Inscripciones", "Academia", "Instituto"],
    "Inmobiliaria": ["Propiedades", "Listado", "Filtros", "Mapa", "Alquiler", "Venta", "Inmuebles"],
    "Tecnología": ["SaaS", "Dashboard", "API", "App Web", "Software", "Startup", "Plataforma"],
    "Concesionaria": ["Vehículos", "Catálogo Autos", "Fichas Técnicas", "Usado", "0km", "Financiación", "Test Drive"],
    "CONSECIONARIA": ["Vehículos", "Catálogo Autos", "Fichas Técnicas", "Usado", "0km", "Financiación", "Test Drive"],
    "Automotriz": ["Taller", "Repuestos", "Turnos", "Presupuestos", "Mecánica"],
    "Otro": ["Landing Page", "Contacto", "Portfolio", "Servicios", "Sobre Nosotros"],
};

const COMMON_TAGS = ["Diseño Web", "Responsive", "SEO", "React", "Next.js", "Diseño UI/UX", "Mobile First", "WordPress", "Branding", "Redes Sociales", "AUTO-GESTIONABLE"];

const BASE_CATEGORIES = [
    "E-commerce", "Restaurante", "Peluquería", "Profesional",
    "Salud", "Educación", "Inmobiliaria", "Tecnología",
    "Concesionaria", "Automotriz", "Otro",
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

    const [tagInput, setTagInput] = useState("");

    const empty: Partial<PortfolioProject> = {
        title: "", description: "", description_long: "", category: "", categories: [],
        image_url: "", image_url_wide: "", image_alt: "", accent_color: "primary",
        external_url: "", applied_services: [], applied_features: [],
        tags: [], stats: [], is_active: true, is_sample: false, display_order: 0,
    };

    const [form, setForm] = useState<Partial<PortfolioProject>>(empty);
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [newCategoryInput, setNewCategoryInput] = useState("");
    const [showScreenshotModal, setShowScreenshotModal] = useState(false);
    const [uploadingSlot, setUploadingSlot] = useState<"" | "4x3" | "16x9">("");
    const [uploadError, setUploadError] = useState("");
    const [draggingSlot, setDraggingSlot] = useState<"" | "4x3" | "16x9">("");
    const fileInput43Ref = useRef<HTMLInputElement>(null);
    const fileInput169Ref = useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback(async (file: File, target: "4x3" | "16x9") => {
        if (!file.type.startsWith("image/")) {
            setUploadError("Solo se permiten archivos de imagen.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setUploadError("La imagen no puede superar los 10MB.");
            return;
        }
        setUploadingSlot(target);
        setUploadError("");
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Error al leer archivo"));
                reader.readAsDataURL(file);
            });

            const safeName = (form.title || "proyecto")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 50);
            const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
            const validExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "webp";
            const filename = `${safeName}-${target}-upload-${Date.now()}.${validExt}`;

            const res = await fetch("/api/admin/upload-supabase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64, filename }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al subir");

            setForm((prev) => ({
                ...prev,
                ...(target === "4x3"
                    ? { image_url: data.url }
                    : { image_url_wide: data.url }),
                image_alt: prev.image_alt || `Imagen de ${prev.title || "proyecto"}`,
            }));
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Error desconocido al subir.");
        } finally {
            setUploadingSlot("");
        }
    }, [form.title]);

    const makeDropHandlers = useCallback((slot: "4x3" | "16x9") => ({
        onDrop: (e: React.DragEvent) => {
            e.preventDefault();
            setDraggingSlot("");
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload(file, slot);
        },
        onDragOver: (e: React.DragEvent) => {
            e.preventDefault();
            setDraggingSlot(slot);
        },
        onDragLeave: (e: React.DragEvent) => {
            e.preventDefault();
            setDraggingSlot("");
        },
    }), [handleFileUpload]);

    // Merge base categories + categories from existing projects + custom added ones
    const allCategories = useMemo(() => {
        const fromDb = data.flatMap((p) => p.categories || (p.category ? [p.category] : [])).filter(Boolean);
        const merged = new Set([...BASE_CATEGORIES, ...fromDb, ...customCategories]);
        return Array.from(merged).sort((a, b) => a.localeCompare(b, "es"));
    }, [data, customCategories]);

    const addCategory = () => {
        const trimmed = newCategoryInput.trim();
        if (trimmed && !allCategories.includes(trimmed)) {
            setCustomCategories((prev) => [...prev, trimmed]);
            setForm({ ...form, category: trimmed });
        }
        setNewCategoryInput("");
    };

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
            const featsToRemove = (svc?.features || []).map((f: any) => typeof f === 'string' ? f : f.text);
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
        .flatMap(s => s.features)
        .map((f: any) => typeof f === 'string' ? f : f.text)
        .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i); // deduplicate

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
        <>
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
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categorías <span className="text-primary">(podés elegir varias)</span></span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {allCategories.map((cat: string) => {
                                            const cats = form.categories || [];
                                            const isSelected = cats.includes(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => {
                                                        const newCats = isSelected
                                                            ? cats.filter(c => c !== cat)
                                                            : [...cats, cat];
                                                        setForm({ ...form, categories: newCats, category: newCats[0] || "" });
                                                    }}
                                                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${isSelected
                                                        ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                                                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                                        }`}
                                                >
                                                    {isSelected && <span className="material-icons text-[14px] mr-1">check</span>}
                                                    {cat}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            className="admin-input flex-1 text-sm"
                                            placeholder="Nueva categoría..."
                                            value={newCategoryInput}
                                            onChange={(e) => setNewCategoryInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
                                        />
                                        <button
                                            type="button"
                                            onClick={addCategory}
                                            disabled={!newCategoryInput.trim()}
                                            className="bg-mint text-black font-bold px-4 py-1.5 text-xs uppercase tracking-wider border-2 border-black rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shadow-[2px_2px_0px_#000] disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            + Agregar
                                        </button>
                                    </div>
                                </label>
                                <label className="space-y-1 md:col-span-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción corta (tarjetas)</span>
                                    <textarea className="admin-input w-full" rows={2} placeholder="Breve descripción que aparece en las tarjetas del catálogo" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                    <p className="text-[10px] text-gray-500">Se muestra en las tarjetas del catálogo y la sección de inicio. Máximo 2-3 líneas.</p>
                                </label>
                                <label className="space-y-1 md:col-span-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción extendida (detalle)</span>
                                    <textarea className="admin-input w-full" rows={5} placeholder="Descripción completa del proyecto, proceso, desafíos y resultados. Se muestra en la página de detalle." value={form.description_long || ""} onChange={(e) => setForm({ ...form, description_long: e.target.value })} />
                                    <p className="text-[10px] text-gray-500">Se muestra en la página de detalle de cada proyecto. Podés ser más extenso y detallado.</p>
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
                                <label className="space-y-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Texto Alt (SEO)</span>
                                    <input className="admin-input w-full" placeholder="Descripción de la imagen para SEO" value={form.image_alt || ""} onChange={(e) => setForm({ ...form, image_alt: e.target.value })} />
                                </label>
                                <label className="space-y-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL del Sitio Web del Cliente</span>
                                    <div className="flex gap-2">
                                        <input className="admin-input flex-1" placeholder="https://www.ejemplo-cliente.com" value={form.external_url || ""} onChange={(e) => setForm({ ...form, external_url: e.target.value || null })} />
                                        <button
                                            type="button"
                                            onClick={() => setShowScreenshotModal(true)}
                                            disabled={!form.external_url}
                                            className="bg-electric-blue text-white font-bold px-4 py-2 text-xs uppercase tracking-wider border-2 border-black rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shadow-[2px_2px_0px_#000] disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            📸 Capturar
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-500">Pegá la URL y tocá &quot;Capturar&quot; para generar un screenshot automáticamente.</p>
                                </label>

                                {/* ── Direct Image Upload: Two zones ── */}
                                <div className="md:col-span-2 space-y-3">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">O subí imágenes directamente</span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* 4:3 Upload Zone */}
                                        <div className="space-y-2">
                                            <p className="text-[11px] text-primary font-black uppercase tracking-wider flex items-center gap-1">
                                                🖼️ Detalle + Inicio (4:3)
                                            </p>
                                            <div
                                                {...makeDropHandlers("4x3")}
                                                onClick={() => fileInput43Ref.current?.click()}
                                                className={`relative border-2 border-dashed rounded-sm p-5 text-center cursor-pointer transition-all ${
                                                    draggingSlot === "4x3"
                                                        ? "border-primary bg-primary/10 scale-[1.01]"
                                                        : uploadingSlot === "4x3"
                                                            ? "border-primary/50 bg-primary/5"
                                                            : "border-white/20 bg-white/5 hover:border-primary/40 hover:bg-white/10"
                                                }`}
                                            >
                                                <input
                                                    ref={fileInput43Ref}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(file, "4x3");
                                                        e.target.value = "";
                                                    }}
                                                />
                                                {uploadingSlot === "4x3" ? (
                                                    <div className="flex flex-col items-center gap-2 py-2">
                                                        <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                                        <p className="text-white font-bold text-xs">Subiendo...</p>
                                                    </div>
                                                ) : form.image_url ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={form.image_url} alt="Preview 4:3" className="w-full max-h-24 object-cover rounded border border-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                        <p className="text-primary text-[10px] font-bold">✓ Imagen cargada · Clic para reemplazar</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1.5 py-2">
                                                        <span className={`material-icons text-2xl ${draggingSlot === "4x3" ? "text-primary" : "text-gray-500"}`}>
                                                            {draggingSlot === "4x3" ? "file_download" : "aspect_ratio"}
                                                        </span>
                                                        <p className="text-gray-300 text-xs font-bold">
                                                            {draggingSlot === "4x3" ? "Soltá acá" : "Subir imagen 4:3"}
                                                        </p>
                                                        <p className="text-gray-500 text-[10px]">Página de detalle e inicio</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 16:9 Upload Zone */}
                                        <div className="space-y-2">
                                            <p className="text-[11px] text-mint font-black uppercase tracking-wider flex items-center gap-1">
                                                🎥 Catálogo (16:9)
                                            </p>
                                            <div
                                                {...makeDropHandlers("16x9")}
                                                onClick={() => fileInput169Ref.current?.click()}
                                                className={`relative border-2 border-dashed rounded-sm p-5 text-center cursor-pointer transition-all ${
                                                    draggingSlot === "16x9"
                                                        ? "border-mint bg-mint/10 scale-[1.01]"
                                                        : uploadingSlot === "16x9"
                                                            ? "border-mint/50 bg-mint/5"
                                                            : "border-white/20 bg-white/5 hover:border-mint/40 hover:bg-white/10"
                                                }`}
                                            >
                                                <input
                                                    ref={fileInput169Ref}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(file, "16x9");
                                                        e.target.value = "";
                                                    }}
                                                />
                                                {uploadingSlot === "16x9" ? (
                                                    <div className="flex flex-col items-center gap-2 py-2">
                                                        <div className="w-7 h-7 border-3 border-mint border-t-transparent rounded-full animate-spin" />
                                                        <p className="text-white font-bold text-xs">Subiendo...</p>
                                                    </div>
                                                ) : form.image_url_wide ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={form.image_url_wide} alt="Preview 16:9" className="w-full max-h-24 object-cover rounded border border-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                        <p className="text-mint text-[10px] font-bold">✓ Imagen cargada · Clic para reemplazar</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1.5 py-2">
                                                        <span className={`material-icons text-2xl ${draggingSlot === "16x9" ? "text-mint" : "text-gray-500"}`}>
                                                            {draggingSlot === "16x9" ? "file_download" : "wide_screen"}
                                                        </span>
                                                        <p className="text-gray-300 text-xs font-bold">
                                                            {draggingSlot === "16x9" ? "Soltá acá" : "Subir imagen 16:9"}
                                                        </p>
                                                        <p className="text-gray-500 text-[10px]">Tarjetas del catálogo</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {uploadError && (
                                        <p className="text-hot-coral text-xs font-bold mt-2 flex items-center gap-1">
                                            <span className="material-icons text-sm">error</span>
                                            {uploadError}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-gray-500">💡 También podés usar "📸 Capturar" para generar ambos recortes automáticamente desde la URL.</p>
                                </div>

                                {/* Image Preview */}
                                {(form.image_url || form.image_url_wide) && (
                                    <div className="md:col-span-2 space-y-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <span className="material-icons text-[14px]">visibility</span>
                                            Vista previa — así se ve cada imagen recortada:
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* 4:3 preview (detail + homepage) */}
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-primary font-bold uppercase">🖼️ Detalle + Inicio (4:3)</p>
                                                <div className="aspect-[4/3] bg-gray-900 border border-white/10 rounded overflow-hidden">
                                                    {form.image_url ? (
                                                        <>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={form.image_url} alt="Preview 4:3" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Sin imagen 4:3</div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-500">Se usa en la página de detalle y en &quot;Nuestro Trabajo&quot;</p>
                                            </div>
                                            {/* 16:9 preview (catalog) */}
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-mint font-bold uppercase">🎥 Catálogo (16:9)</p>
                                                <div className="aspect-video bg-gray-900 border border-white/10 rounded overflow-hidden">
                                                    {(form.image_url_wide || form.image_url) ? (
                                                        <>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={form.image_url_wide || form.image_url} alt="Preview 16:9" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Sin imagen 16:9</div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-500">Se usa en las tarjetas del catálogo</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-500">💡 Usá &quot;📸 Capturar&quot; para generar ambos recortes automáticamente de una sola captura.</p>
                                    </div>
                                )}
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
                        <div className="space-y-3 border-t border-white/10 pt-4">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-icons text-base">label</span>
                                Etiquetas / Tags
                            </h3>

                            {/* Current tags as removable chips */}
                            {(form.tags || []).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {(form.tags || []).map((tag, i) => (
                                        <button
                                            key={`${tag}-${i}`}
                                            type="button"
                                            onClick={() => setForm({ ...form, tags: (form.tags || []).filter((_, idx) => idx !== i) })}
                                            className="inline-flex items-center gap-1 bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-sm text-xs font-bold hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/30 transition-colors group"
                                        >
                                            {tag}
                                            <span className="material-icons text-[14px] opacity-50 group-hover:opacity-100">close</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Manual tag input */}
                            <div className="flex gap-2">
                                <input
                                    className="admin-input flex-1 text-sm"
                                    placeholder="Escribí un tag y presioná Enter o coma..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ',') {
                                            e.preventDefault();
                                            const newTag = tagInput.replace(/,/g, '').trim();
                                            if (newTag && !(form.tags || []).includes(newTag)) {
                                                setForm({ ...form, tags: [...(form.tags || []), newTag] });
                                            }
                                            setTagInput("");
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newTag = tagInput.replace(/,/g, '').trim();
                                        if (newTag && !(form.tags || []).includes(newTag)) {
                                            setForm({ ...form, tags: [...(form.tags || []), newTag] });
                                        }
                                        setTagInput("");
                                    }}
                                    disabled={!tagInput.trim()}
                                    className="bg-mint text-black font-bold px-4 py-1.5 text-xs uppercase tracking-wider border-2 border-black rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shadow-[2px_2px_0px_#000] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    + Tag
                                </button>
                            </div>

                            {/* Category-based tag suggestions */}
                            {(() => {
                                const selectedCats = form.categories || [];
                                const catTags = selectedCats.flatMap(cat => TAG_SUGGESTIONS[cat] || []);
                                const allSuggestions = [...new Set([...catTags, ...COMMON_TAGS])];
                                const unusedSuggestions = allSuggestions.filter(t => !(form.tags || []).includes(t));
                                if (unusedSuggestions.length === 0) return null;
                                return (
                                    <div>
                                        <p className="text-[10px] text-gray-500 mb-1.5 flex items-center gap-1">
                                            <span className="material-icons text-[12px]">auto_awesome</span>
                                            Sugerencias {selectedCats.length > 0 ? `para ${selectedCats.map(c => `"${c}"`).join(", ")}` : "generales"} — clic para agregar:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {unusedSuggestions.map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, tags: [...(form.tags || []), tag] })}
                                                    className={`px-2 py-0.5 text-[11px] font-bold border rounded-sm transition-all ${catTags.includes(tag)
                                                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/30"
                                                        : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    + {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
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

            <ScreenshotCropModal
                isOpen={showScreenshotModal}
                onClose={() => setShowScreenshotModal(false)}
                onComplete={(result: { imageUrl: string; imageUrlWide: string }) => {
                    setForm((prev) => ({
                        ...prev,
                        image_url: result.imageUrl,
                        image_url_wide: result.imageUrlWide,
                        image_alt: `Screenshot de ${prev.title || "proyecto"}`,
                    }));
                    setShowScreenshotModal(false);
                }}
                externalUrl={form.external_url || ""}
                projectTitle={form.title || ""}
            />
        </>
    );
}
