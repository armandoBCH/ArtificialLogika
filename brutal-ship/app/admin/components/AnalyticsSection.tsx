"use client";

import { useEffect, useState, useCallback } from "react";
import type { AnalyticsData } from "@/lib/analytics";

// ─── Mini line chart (pure SVG) ──────────────────────
function SparklineChart({ data }: { data: { date: string; visitors: number }[] }) {
    if (data.length < 2) return null;

    const W = 600;
    const H = 120;
    const PAD = 8;

    const max = Math.max(...data.map((d) => d.visitors), 1);
    const points = data.map((d, i) => ({
        x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
        y: PAD + (1 - d.visitors / max) * (H - PAD * 2),
    }));

    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${line} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8523e1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8523e1" stopOpacity={0.02} />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#chartGrad)" />
            <path d={line} fill="none" stroke="#8523e1" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {/* Last dot */}
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill="#8523e1" stroke="#1e1530" strokeWidth={2} />
        </svg>
    );
}

// ─── Change badge ────────────────────────────────────
function ChangeBadge({ value }: { value: number }) {
    const isPositive = value >= 0;
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-sm ${
                isPositive ? "bg-secondary/20 text-secondary" : "bg-hot-coral/20 text-hot-coral"
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
                <span className="text-gray-300 font-medium capitalize">{source}</span>
                <span className="text-white font-bold">{percentage}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

const SOURCE_COLORS = [
    "bg-primary",
    "bg-secondary",
    "bg-electric-blue",
    "bg-accent-yellow",
    "bg-accent-coral",
    "bg-violet-electric",
];

// ─── Not configured state ────────────────────────────
function NotConfigured() {
    return (
        <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-black text-white font-display mb-2">
                Google Analytics no configurado
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
                Para ver las estadísticas del sitio, configurá las variables de entorno:
            </p>
            <div className="bg-black/30 rounded-sm p-4 text-left max-w-sm mx-auto font-mono text-xs text-gray-400 space-y-1">
                <p><span className="text-primary">GA_PROPERTY_ID</span>=tu_property_id</p>
                <p><span className="text-primary">GA_CLIENT_EMAIL</span>=tu_service_account@...</p>
                <p><span className="text-primary">GA_PRIVATE_KEY</span>=-----BEGIN PRIVATE KEY-----...</p>
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
                    <div key={i} className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 h-28" />
                ))}
            </div>
            <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 h-48" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 h-56" />
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-6 h-56" />
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────
export default function AnalyticsSection() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/analytics");
            const json = await res.json();
            setData(json);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white font-display">
                        📈 Estadísticas del Sitio
                    </h2>
                </div>
                <AnalyticsSkeleton />
            </div>
        );
    }

    if (!data || !data.configured) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-black text-white font-display">
                    📈 Estadísticas del Sitio
                </h2>
                <NotConfigured />
            </div>
        );
    }

    const { kpis, dailyVisitors, topPages, trafficSources } = data;

    const kpiCards = [
        {
            label: "Visitantes",
            value: kpis.activeUsers.toLocaleString("es-AR"),
            change: kpis.activeUsersChange,
            icon: "👥",
            color: "border-primary/40",
            dotColor: "bg-primary",
        },
        {
            label: "Sesiones",
            value: kpis.sessions.toLocaleString("es-AR"),
            change: kpis.sessionsChange,
            icon: "🔄",
            color: "border-secondary/40",
            dotColor: "bg-secondary",
        },
        {
            label: "Páginas Vistas",
            value: kpis.pageViews.toLocaleString("es-AR"),
            change: kpis.pageViewsChange,
            icon: "📄",
            color: "border-electric-blue/40",
            dotColor: "bg-electric-blue",
        },
        {
            label: "Tasa de Rebote",
            value: `${kpis.bounceRate}%`,
            change: kpis.bounceRateChange,
            icon: "↩️",
            color: "border-accent-coral/40",
            dotColor: "bg-accent-coral",
            invertChange: true,
        },
    ];

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white font-display">
                    📈 Estadísticas del Sitio
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs font-medium">
                        Últimos 30 días &middot; Duración promedio: {formatDuration(kpis.avgSessionDuration)}
                    </span>
                    <button
                        onClick={() => { setLoading(true); fetchData(); }}
                        className="text-gray-400 hover:text-primary text-sm font-bold transition-colors"
                        title="Actualizar"
                    >
                        🔄
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-[#1e1530] border-2 ${card.color} rounded-sm p-5 transition-all hover:border-opacity-70`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xl">{card.icon}</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${card.dotColor}`} />
                        </div>
                        <p className="text-2xl font-black text-white font-display leading-none">
                            {card.value}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-gray-400 text-xs font-medium">{card.label}</p>
                            <ChangeBadge value={card.invertChange ? -card.change : card.change} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Sparkline Chart */}
            {dailyVisitors.length > 0 && (
                <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5">
                    <h3 className="text-sm font-bold text-gray-400 mb-3">
                        Visitantes diarios
                    </h3>
                    <SparklineChart data={dailyVisitors} />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-medium">
                        <span>30 días atrás</span>
                        <span>Hoy</span>
                    </div>
                </div>
            )}

            {/* Bottom Row: Top Pages + Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Pages */}
                {topPages.length > 0 && (
                    <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5">
                        <h3 className="text-sm font-bold text-gray-400 mb-4">
                            🏆 Páginas más Visitadas
                        </h3>
                        <div className="space-y-2">
                            {topPages.map((page, i) => (
                                <div
                                    key={page.path}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-sm"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-black text-gray-500 w-5 text-right shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-white text-sm font-medium truncate">
                                            {page.path === "/" ? "Inicio" : page.path}
                                        </span>
                                    </div>
                                    <span className="text-primary font-bold text-sm shrink-0 ml-3">
                                        {page.views.toLocaleString("es-AR")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Traffic Sources */}
                {trafficSources.length > 0 && (
                    <div className="bg-[#1e1530] border-2 border-white/10 rounded-sm p-5">
                        <h3 className="text-sm font-bold text-gray-400 mb-4">
                            🌐 Fuentes de Tráfico
                        </h3>
                        <div className="space-y-3">
                            {trafficSources.map((source, i) => (
                                <TrafficBar
                                    key={source.source}
                                    source={source.source === "(direct)" ? "Directo" : source.source}
                                    percentage={source.percentage}
                                    color={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
