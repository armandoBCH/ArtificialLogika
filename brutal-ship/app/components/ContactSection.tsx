"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactSection() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'idle') return;

        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1200);
    };
    return (
        <section id="contacto" className="relative bg-primary px-4 py-20 md:px-10 lg:px-20 overflow-hidden">
            {/* Geometric Background Shapes */}
            <div className="geometric-shape top-10 left-10 w-32 h-32 rounded-full border-4 border-white"></div>
            <div className="geometric-shape bottom-20 right-20 w-48 h-48 rotate-45 border-4 border-white"></div>
            <div className="geometric-shape top-1/2 left-1/4 w-24 h-24 rounded border-4 border-white"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-4 drop-shadow-md">
                        ¿Listo Para Tu <br className="hidden md:block" />Nueva Web?
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Contanos sobre tu negocio y te enviamos <strong className="text-white underline decoration-2 underline-offset-4">un presupuesto + mockup gratis</strong> en menos de 48 horas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Contact Form Card */}
                    <div className="lg:col-span-7 bg-white rounded-lg border-2 border-black p-6 md:p-10 shadow-neobrutalism relative">
                        {/* Free offer badge */}
                        <div className="absolute -top-4 left-6 bg-accent-yellow border-2 border-black px-4 py-1 font-bold text-sm shadow-neobrutalism-sm transform -rotate-2 rounded z-20">
                            🎁 PRESUPUESTO + MOCKUP GRATIS
                        </div>
                        <h3 className="text-black text-2xl font-bold mb-2 flex items-center gap-2 mt-4">
                            <span className="material-symbols-outlined text-primary">mail</span>
                            Recibí tu presupuesto sin compromiso
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">Completá el formulario y te enviamos un mockup de cómo se vería tu web + presupuesto detallado. 100% gratis.</p>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-black font-bold text-sm uppercase">Tu Nombre</span>
                                    <input
                                        className="w-full rounded border-2 border-black bg-gray-50 px-4 py-3 text-black placeholder-gray-400 focus:bg-white focus:-translate-y-1 focus:border-primary focus:ring-0 focus:shadow-[4px_4px_0px_0px_#8523e1] transition-all duration-300 outline-none font-medium"
                                        placeholder="Juan Pérez"
                                        type="text"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-black font-bold text-sm uppercase">Tu Email o Teléfono</span>
                                    <input
                                        className="w-full rounded border-2 border-black bg-gray-50 px-4 py-3 text-black placeholder-gray-400 focus:bg-white focus:-translate-y-1 focus:border-primary focus:ring-0 focus:shadow-[4px_4px_0px_0px_#8523e1] transition-all duration-300 outline-none font-medium"
                                        placeholder="juan@ejemplo.com o 11-1234-5678"
                                        type="text"
                                    />
                                </label>
                            </div>
                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">¿Qué tipo de negocio tenés?</span>
                                <select
                                    className="w-full rounded border-2 border-black bg-gray-50 px-4 py-3 text-black focus:bg-white focus:-translate-y-1 focus:border-primary focus:ring-0 focus:shadow-[4px_4px_0px_0px_#8523e1] transition-all duration-300 outline-none font-medium appearance-none"
                                    defaultValue="Otro"
                                >
                                    <option>Restaurante / Gastronomía</option>
                                    <option>Tienda / Comercio</option>
                                    <option>Profesional Independiente</option>
                                    <option>Salud / Clínica</option>
                                    <option>Servicios</option>
                                    <option>Otro</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-black font-bold text-sm uppercase">Contanos qué necesitás</span>
                                <textarea
                                    className="w-full rounded border-2 border-black bg-gray-50 px-4 py-3 text-black placeholder-gray-400 focus:bg-white focus:-translate-y-1 focus:border-primary focus:ring-0 focus:shadow-[4px_4px_0px_0px_#8523e1] transition-all duration-300 outline-none font-medium resize-none"
                                    placeholder="Ej: Necesito una web para mi peluquería con fotos de mis trabajos, precios y un botón de WhatsApp..."
                                    rows={4}
                                ></textarea>
                            </label>
                            <button
                                className={`w-full md:w-auto px-8 py-3 text-white font-bold uppercase tracking-wider rounded border-2 border-black transition-all shadow-neobrutalism-sm ${status === 'success' ? 'bg-[#00D68F]' : 'bg-primary hover:bg-primary/90 hover:shadow-neobrutalism active:scale-95'} flex items-center justify-center gap-2 overflow-hidden relative`}
                                type="submit"
                                disabled={status !== 'idle'}
                                style={{ minHeight: '52px', minWidth: '320px' }}
                            >
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {status === 'idle' && (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex items-center gap-2"
                                        >
                                            Quiero Mi Presupuesto Gratis <span className="material-icons text-sm">arrow_forward</span>
                                        </motion.div>
                                    )}
                                    {status === 'loading' && (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center gap-2"
                                        >
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </motion.div>
                                    )}
                                    {status === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className="flex items-center gap-2 text-black"
                                        >
                                            <span className="material-icons">check_circle</span>
                                            ¡Mensaje Enviado!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                            {/* Trust signals under button */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium pt-1">
                                <span className="flex items-center gap-1">
                                    <span className="material-icons text-green-600 text-sm">check_circle</span>
                                    Sin compromiso
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons text-green-600 text-sm">check_circle</span>
                                    Respuesta en 48hs
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons text-green-600 text-sm">check_circle</span>
                                    Mockup incluido
                                </span>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar / Info Cards */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* WhatsApp Card */}
                        <div className="bg-ink-black rounded-lg border-2 border-white/10 p-8 shadow-neobrutalism relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-secondary/20"></div>
                            <div className="relative z-10">
                                <div className="size-12 bg-secondary rounded-lg flex items-center justify-center border-2 border-black mb-4 shadow-[2px_2px_0px_0px_#fff]">
                                    <span className="material-symbols-outlined text-black text-2xl">chat</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2">¿Preferís WhatsApp?</h3>
                                <p className="text-gray-400 mb-6 font-light">
                                    Escribinos directo y te respondemos al toque. Sin formularios, sin esperas.
                                </p>
                                <a
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-secondary text-black font-bold uppercase tracking-wider rounded border-2 border-black shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all"
                                    href="https://wa.me/5491112345678?text=Hola!%20Quiero%20consultar%20por%20una%20web%20para%20mi%20negocio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Chatear por WhatsApp</span>
                                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                </a>
                            </div>
                        </div>

                        {/* Social Proof Mini Card */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex -space-x-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img alt="Cliente" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkYW0Flt0xW1Z3HB3NQwCqzJaGgTOWrUXGCNluYmymfDWoJiDh-UQh0Hdx9NWuTx_qiQdr2KzeaMkZ7N-QQl-4dkzIoTTSGaeaZ2tbzIGEJElJLhGWd7ydROujN0ENIj2UpffcTf9t4guY8he-CwCnCEMKa7QKx-3PXBAKeNM6IVxxsNb5-fd8qJOzrfCMg5_jfSEb9mfICiqS2r2p2IlfH-kkOZFsh6HwhgsxB1gpdvi7ThCjXF-CiziTu_MG8QUi-jcjVj54rUI" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img alt="Cliente" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQAEL7ldXO17P2zxbs1YngIHQKE24NCKGj4oHGt_U2jG0qZlQJYr5_JnXBJDR2YGgjx92YrRE0A1VBRzREbR7mT3awaWFn2PLGLhFbdroVUJNp2fTW9nA2xy0EXhcPunUx9Os-ruZSBCW7eK-AEGwD9FP-TnJ6vU27MmbXLnT3QBUELyLnEkDzq5PyYCWaZaiA2RMtrwwH9Qhr4aeOIBEk5InS3zW5OPrNNoCM6Tsy1tH3DmPWRd3ajGeYXrv4ejWcHDK3jjmO13U" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img alt="Cliente" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwUxH3A7ZLuocQWfDb9tQet8_f_6u-oQQpVWTMjdpLmOS5ImkWGQ2yJOHKDj85TOdQwFhcPYptf-mugD8IWQ-w4sNC4AtJZ9J_ffQF2JxVbGqj6YfDTGIfTt3X-3p2TRPQA6g8DHQcqy6mRejoSOGIYJXeeyvv8idqZO85dwqI2a8ODmJu4qRIbVLPKefJoPsqoWl_70pqnl3Vn55pSEj4bF0QYnlSAdTcnI_Si2joxXY0K-47AmnvN-m4KWktQo8UD4nWuZCLBgQ" />
                                </div>
                                <p className="text-white text-sm font-bold">&quot;Me respondieron en 2 horas&quot;</p>
                            </div>
                            <p className="text-white/60 text-xs">— María L., clienta de Artificial Logika</p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-[#2a2a2a] rounded-lg border-2 border-white/10 p-8">
                            <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-wide border-b border-white/10 pb-2">
                                Contacto Directo
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-300">
                                    <span className="material-symbols-outlined text-secondary shrink-0">location_on</span>
                                    <span>
                                        Buenos Aires, <br />Argentina
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <span className="material-symbols-outlined text-secondary shrink-0">mail</span>
                                    <span>hola@artificiallogika.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
