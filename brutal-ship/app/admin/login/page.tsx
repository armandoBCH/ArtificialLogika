"use client";

import { useState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#191121] flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rotate-12 border-2 border-primary/20" />
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/10 -rotate-6 rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent-yellow/10 rotate-45" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-sm border-2 border-black shadow-neobrutalism flex items-center justify-center">
                            <span className="text-white font-black text-xl font-display">L</span>
                        </div>
                        <h1 className="text-3xl font-black text-white font-display tracking-tight">
                            LOGIKA
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm">Panel de Administración</p>
                </div>

                {/* Login Card */}
                <div className="bg-white border-3 border-black shadow-neobrutalism-lg p-8 rounded-sm">
                    <h2 className="text-2xl font-black text-ink-black mb-6 font-display">
                        Iniciar Sesión
                    </h2>

                    <form action={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-bold text-ink-black mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 border-2 border-black rounded-sm bg-soft-smoke font-medium text-ink-black placeholder-muted-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                placeholder="admin@logika.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-bold text-ink-black mb-2"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 border-2 border-black rounded-sm bg-soft-smoke font-medium text-ink-black placeholder-muted-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-hot-coral/10 border-2 border-hot-coral text-hot-coral px-4 py-3 rounded-sm text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-black py-3 px-6 border-2 border-black shadow-neobrutalism rounded-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neobrutalism-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Ingresando...
                                </span>
                            ) : (
                                "Ingresar"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 text-xs mt-6">
                    © {new Date().getFullYear()} Logika — Acceso restringido
                </p>
            </div>
        </div>
    );
}
