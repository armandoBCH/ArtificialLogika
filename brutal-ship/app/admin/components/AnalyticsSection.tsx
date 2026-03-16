"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { AnalyticsData } from "@/lib/analytics";

// ─── Interactive SVG Area Chart ──────────────────────
function InteractiveAreaChart({ data }: { data: { date: string; visitors: number }[] }) {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    if (data.length < 2) return (
        <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
            No hay suficientes datos para el gráfico
        </div>
    );

    const W = 800;
    const H = 200;
    const PAD_Y = 20;
    const PAD_X = 10;

    const max = Math.max(...data.map((d) => d.visitors), 1);
    const min = 0; // Always start at 0 for area charts

    const getX = (i: number) => PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2);
    const getY = (val: number) => H - PAD_Y - ((val - min) / (max - min)) * (H - PAD_Y * 2);

    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.visitors), ...d }));
    
    // Smooth curve (Catmull-Rom logic simplified or just straight lines. Let's stick to straight lines for sharpness, it looks better in brutalism)
    const lineStr = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaStr = `${lineStr} L ${points[points.length - 1].x} ${H - PAD_Y} L ${points[0].x} ${H - PAD_Y} Z`;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        // Use SVG viewbox coordinates approximation
        const relativeX = (e.clientX - rect.left) / rect.width * W;
        
        // Find closest point
        let closestIdx = 0;
        let minDiff = Infinity;
        points.forEach((p, i) => {
            const diff = Math.abs(p.x - relativeX);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = i;
            }
        });
        setHoverIdx(closestIdx);
    };

    return (
        <div className="relative w-full h-48 group">
            <svg 
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`} 
                className="w-full h-full overflow-visible" 
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIdx(null)}
            >
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f090" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#00f090" stopOpacity={0.0} />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="#000" />
                    </filter>
                </defs>
                
                {/* Horizontal Grid Lines */}
                {[0, 0.5, 1].map(ratio => {
                    const y = H - PAD_Y - ratio * (H - PAD_Y * 2);
                    return (
                        <g key={ratio}>
                            <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                            <text x={0} y={y - 4} fill="rgba(255,255,255,0.3)" fontSize={12} fontWeight="bold">
                                {Math.round(min + ratio * (max - min))}
                            </text>
                        </g>
                    );
                })}

                <path d={areaStr} fill="url(#chartGrad)" />
                <path d={lineStr} fill="none" stroke="#00f090" strokeWidth={3} strokeLinejoin="round" filter="url(#shadow)" />
                
                {/* Hover interactions */}
                {hoverIdx !== null && (
                    <g>
                        <line 
                            x1={points[hoverIdx].x} y1={PAD_Y} 
                            x2={points[hoverIdx].x} y2={H - PAD_Y} 
                            stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4 4" 
                        />
                        <circle cx={points[hoverIdx].x} cy={points[hoverIdx].y} r={6} fill="#00f090" stroke="#000" strokeWidth={2} />
                    </g>
                )}
            </svg>

            {/* Tooltip (DOM based for sharp text rendering) */}
            {hoverIdx !== null && (
                <div 
                    className="absolute z-10 bg-white text-black font-bold px-3 py-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] pointer-events-none transform -translate-x-1/2 -translate-y-[120%]"
                    style={{ 
                        left: `${(points[hoverIdx].x / W) * 100}%`,
                        top: `${(points[hoverIdx].y / H) * 100}%`
                    }}
                >
                    <div className="text-xs text-gray-500">{points[hoverIdx].date}</div>
                    <div className="text-lg leading-none mt-1">{points[hoverIdx].visitors} <span className="text-xs font-normal">visitas</span></div>
                </div>
            )}
        </div>
    );
}

// ─── Change badge ────────────────────────────────────
function ChangeBadge({ value }: { value: number }) {
    const isPositive = value >= 0;
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm border ${
                isPositive ? "bg-mint/20 text-mint border-mint/30" : "bg-hot-coral/20 text-hot-coral border-hot-coral/30"
            }`}
        >
            {isPositive ? "▲" : "▼"} {Math.abs(value)}%
        </span>
    );
}

// ─── Traffic source bar ──────────────────────────────
function TrafficBar({ source, percentage, color }: { source: string; percentage: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300 font-medium capitalize truncate pr-4">{source}</span>
                <span className="text-white font-bold">{percentage}%</span>
            </div>
            <div className="h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

const BRAND_COLORS = [
    "bg-primary", // Violet
    "bg-secondary", // Yellow
    "bg-mint", // Green
    "bg-hot-coral", // Red
    "bg-electric-blue", // Blue
];

function DeviceRing({ devices }: { devices: {category: string, percentage: number}[] }) {
    if (devices.length === 0) return null;
    
    let currentOffset = 0;
    const circumference = 2 * Math.PI * 40;

    return (
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 relative flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    {devices.map((d, i) => {
                        const strokeDasharray = `${(d.percentage / 100) * circumference} ${circumference}`;
                        const strokeDashoffset = -currentOffset;
                        currentOffset += (d.percentage / 100) * circumference;
                        
                        // Map colors based on index
                        const colorHex = i === 0 ? "#8523e1" : i === 1 ? "#fffb00" : i === 2 ? "#00f090" : "#E11D48";
                        
                        return (
                            <circle 
                                key={d.category}
                                cx="50" cy="50" r="40" 
                                fill="transparent" 
                                stroke={colorHex} 
                                strokeWidth="12"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="flex-1 space-y-2">
                {devices.map((d, i) => (
                    <div key={d.category} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 border border-black ${BRAND_COLORS[i % BRAND_COLORS.length]}`} />
                            <span className="text-gray-300 capitalize">{d.category}</span>
                        </div>
                        <span className="text-white font-bold">{d.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Not configured state ────────────────────────────
function NotConfigured() {
    return (
        <div className="bg-[#1e1530] border-2 border-primary/30 rounded-sm p-8 text-center shadow-[4px_4px_0px_#8523e1]">
            <div className="text-5xl mb-4 animate-bounce">📊</div>
            <h3 className="text-2xl font-black text-white font-display mb-2">
                Google Analytics no configurado
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
                Conectá el dashboard a GA4 añadiendo las siguientes variables a tu archivo <code className="text-primary font-bold">.env.local</code> o en Vercel.
            </p>
            <div className="bg-black/50 border border-white/10 rounded-sm p-4 text-left max-w-xl mx-auto font-mono text-xs text-gray-300 space-y-2 overflow-x-auto">
                <p><span className="text-secondary font-bold">GA_PROPERTY_ID</span>=tu_property_id</p>
                <p><span className="text-secondary font-bold">GA_CLIENT_EMAIL</span>=tu_service_account@...</p>
                <p><span className="text-secondary font-bold">GA_PRIVATE_KEY</span>="-----BEGIN PRIVATE KEY-----..."</p>
            </div>
        </div>
    );
}

// ─── Loading skeleton ────────────────────────────────
function AnalyticsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#1e1530] border-2 border-white/5 rounded-sm p-6 h-28" />
                ))}
            </div>
            <div className="bg-[#1e1530] border-2 border-white/5 rounded-sm p-6 h-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-[#1e1530] border-2 border-white/5 rounded-sm p-6 h-56" />
                <div className="bg-[#1e1530] border-2 border-white/5 rounded-sm p-6 h-56" />
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────
export default function AnalyticsSection() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState<number>(30); // 7, 30, 90

    const fetchData = useCallback(async (selectedDays: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/analytics?days=${selectedDays}`);
            const json = await res.json();
            setData(json);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(days);
    }, [days, fetchData]);

    if (loading && !data) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white font-display">📈 Estadísticas de Tráfico</h2>
                </div>
                <AnalyticsSkeleton />
            </div>
        );
    }

    if (!data || !data.configured) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-white font-display">📈 Estadísticas de Tráfico</h2>
                <NotConfigured />
            </div>
        );
    }

    const { kpis, dailyVisitors, topPages, trafficSources, deviceCategories } = data;

    const kpiCards = [
        {
            label: "Visitantes",
            value: kpis.activeUsers.toLocaleString("es-AR"),
            change: kpis.activeUsersChange,
            icon: "👥",
            color: "border-primary/40 focus-within:border-primary",
            bgHover: "hover:bg-primary/5",
            dotColor: "bg-primary",
        },
        {
            label: "Sesiones",
            value: kpis.sessions.toLocaleString("es-AR"),
            change: kpis.sessionsChange,
            icon: "🔄",
            color: "border-secondary/40",
            bgHover: "hover:bg-secondary/5",
            dotColor: "bg-secondary",
        },
        {
            label: "Páginas Vistas",
            value: kpis.pageViews.toLocaleString("es-AR"),
            change: kpis.pageViewsChange,
            icon: "📄",
            color: "border-mint/40",
            bgHover: "hover:bg-mint/5",
            dotColor: "bg-mint",
        },
        {
            label: "Tasa de Rebote",
            value: `${kpis.bounceRate}%`,
            change: kpis.bounceRateChange,
            icon: "↩️",
            color: "border-hot-coral/40",
            bgHover: "hover:bg-hot-coral/5",
            dotColor: "bg-hot-coral",
            invertChange: true,
        },
    ];

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="space-y-6">
            {/* ── Section Header & Filters ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white font-display">
                        📈 Estadísticas de Tráfico
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Duración promedio: <span className="text-white font-bold">{formatDuration(kpis.avgSessionDuration)}</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-2 bg-[#1e1530] border-2 border-white/10 p-1 rounded-sm relative">
                    {loading && (
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    )}
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            disabled={loading}
                            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-sm ${days === d 
                                ? "bg-white text-black shadow-[2px_2px_0px_#8523e1]" 
                                : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            {d} DÍAS
                        </button>
                    ))}
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-[#1e1530] border-2 ${card.color} ${card.bgHover} rounded-sm p-4 md:p-5 transition-all duration-300 relative group overflow-hidden`}
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full ${card.dotColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className="flex items-center justify-between mb-3 pl-2">
                            <span className="text-xl opacity-80">{card.icon}</span>
                            <ChangeBadge value={card.invertChange ? -card.change : card.change} />
                        </div>
                        <p className="text-3xl font-black text-white font-display leading-none mb-1 pl-2">
                            {card.value}
                        </p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider pl-2">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Main Chart ── */}
            <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mint" />
                    Tráfico Diario ({days} días)
                </h3>
                <InteractiveAreaChart data={dailyVisitors} />
            </div>

            {/* ── Bottom Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Traffic Sources */}
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 flex flex-col">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        Fuentes de Tráfico
                    </h3>
                    {trafficSources.length > 0 ? (
                        <div className="space-y-4 flex-1 justify-center flex flex-col">
                            {trafficSources.map((source, i) => (
                                <TrafficBar
                                    key={source.source}
                                    source={source.source === "(direct)" ? "Directo" : source.source}
                                    percentage={source.percentage}
                                    color={BRAND_COLORS[i % BRAND_COLORS.length]}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Sin datos suficientes</div>
                    )}
                </div>

                {/* Top Pages */}
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-electric-blue" />
                        Páginas más Vistas
                    </h3>
                    {topPages.length > 0 ? (
                        <div className="space-y-2">
                            {topPages.map((page, i) => (
                                <div
                                    key={page.path}
                                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-sm transition-colors group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-black text-gray-500 w-5 text-right shrink-0 group-hover:text-primary transition-colors">
                                            #{i + 1}
                                        </span>
                                        <span className="text-gray-200 text-sm font-medium truncate">
                                            {page.path === "/" ? "Inicio" : page.path}
                                        </span>
                                    </div>
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold text-xs shrink-0 ml-3">
                                        {page.views.toLocaleString("es-AR")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">Sin datos suficientes</div>
                    )}
                </div>

                {/* Device Breakdown */}
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 flex flex-col">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-hot-coral" />
                        Dispositivos
                    </h3>
                    {deviceCategories && deviceCategories.length > 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <DeviceRing devices={deviceCategories} />
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Sin datos suficientes</div>
                    )}
                </div>

            </div>
        </div>
    );
}
