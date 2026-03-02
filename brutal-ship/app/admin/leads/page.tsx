"use client";

import { useAdminData } from "../hooks/useAdminData";

interface Lead {
    id: string;
    name: string;
    contact_info: string;
    business_type: string;
    message: string;
    created_at: string;
}

export default function LeadsPage() {
    const { data, loading, remove } = useAdminData<Lead>("contact_leads");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white font-display">📬 Leads</h1>
                    <p className="text-gray-400 mt-1">Consultas recibidas desde el formulario de contacto</p>
                </div>
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm px-4 py-2">
                    <span className="text-white font-bold text-lg">{data.length}</span>
                    <span className="text-gray-400 text-sm ml-1">total</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : data.length === 0 ? (
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-12 text-center">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-gray-400 font-medium">No hay leads todavía</p>
                    <p className="text-gray-500 text-sm mt-1">Las consultas del formulario de contacto aparecerán acá</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((lead) => (
                        <div key={lead.id} className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5 hover:border-primary/30 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-white font-bold">{lead.name || "Sin nombre"}</h3>
                                    <p className="text-primary text-sm font-medium">{lead.contact_info}</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    {lead.business_type && (
                                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-sm">
                                            {lead.business_type}
                                        </span>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(lead.created_at).toLocaleDateString("es-AR", {
                                            day: "numeric", month: "short", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {lead.message && (
                                <div className="bg-white/5 rounded-sm p-3 mt-2">
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{lead.message}</p>
                                </div>
                            )}
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={() => { if (confirm("¿Eliminar este lead?")) remove(lead.id); }}
                                    className="text-hot-coral text-xs font-bold hover:text-white transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
