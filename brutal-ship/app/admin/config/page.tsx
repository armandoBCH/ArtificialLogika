"use client";

import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface Config {
    id: string;
    key: string;
    value: string;
    label: string;
    type: string;
}

export default function ConfigPage() {
    const { data, loading, saving, update } = useAdminData<Config>("site_config");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    function startEdit(config: Config) {
        setEditingId(config.id);
        setEditValue(config.value);
    }

    async function handleSave(config: Config) {
        const ok = await update({ id: config.id, value: editValue } as Config);
        if (ok) setEditingId(null);
    }

    const iconMap: Record<string, string> = {
        whatsapp_number: "📱",
        email: "📧",
        instagram_url: "📸",
        response_time: "⏰",
        company_name: "🏢",
        tagline: "✨",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white font-display">⚙️ Configuración</h1>
                <p className="text-gray-400 mt-1">Configuración general del sitio</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : (
                <div className="space-y-3">
                    {data.map((config) => (
                        <div
                            key={config.id}
                            className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5 flex items-center gap-4 hover:border-primary/30 transition-all"
                        >
                            <span className="text-2xl">{iconMap[config.key] || "🔧"}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm">{config.label || config.key}</p>
                                <p className="text-gray-500 text-xs font-mono">{config.key}</p>
                            </div>
                            {editingId === config.id ? (
                                <div className="flex items-center gap-2 flex-1 max-w-md">
                                    <input
                                        className="admin-input flex-1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSave(config); if (e.key === "Escape") setEditingId(null); }}
                                    />
                                    <button
                                        onClick={() => handleSave(config)}
                                        disabled={saving}
                                        className="bg-secondary text-black font-bold px-3 py-1.5 border-2 border-black shadow-neobrutalism-sm rounded-sm text-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
                                    >
                                        ✓
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white text-sm font-bold px-2">✕</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <p className="text-gray-300 text-sm font-mono bg-white/5 px-3 py-1.5 rounded-sm max-w-xs truncate">
                                        {config.value || "—"}
                                    </p>
                                    <button
                                        onClick={() => startEdit(config)}
                                        className="text-primary text-sm font-bold hover:text-white transition-colors"
                                    >
                                        Editar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
