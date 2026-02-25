export default function PricingSection() {
    return (
        <section id="precios" className="py-24 bg-accent-yellow border-b-2 border-black relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-10 left-10 text-9xl opacity-10 font-bold rotate-12 pointer-events-none">✦</div>
            <div className="absolute bottom-10 right-10 text-9xl opacity-10 font-bold -rotate-12 pointer-events-none">✦</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-5xl font-bold uppercase tracking-tighter mb-4">Precios Claros</h2>
                <p className="text-xl font-medium mb-12 max-w-xl mx-auto">Sin sorpresas, sin letra chica. Sabés exactamente lo que recibís y cuánto cuesta.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                    {/* Plan 1 — Esencial */}
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-xl shadow-neobrutalism overflow-hidden">
                        <div className="bg-ink-black p-5 border-b-2 border-black">
                            <h3 className="text-white text-2xl font-bold uppercase">Esencial</h3>
                            <p className="text-white/70 font-medium mt-1 text-sm">Para arrancar con presencia online.</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-end justify-center gap-2 mb-6">
                                <span className="text-5xl font-bold">$599</span>
                                <span className="text-lg font-bold text-gray-500 mb-1">USD</span>
                            </div>
                            <div className="space-y-3 mb-6 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Diseño One-Page</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Responsive (Celular + PC)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Formulario de Contacto</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">SEO Básico</span>
                                </div>
                            </div>
                            <a href="#contacto" className="block w-full bg-white text-black font-bold py-3 text-base border-2 border-black shadow-[3px_3px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-lg uppercase tracking-wide text-center">
                                Consultar
                            </a>
                        </div>
                    </div>

                    {/* Plan 2 — Profesional (Destacado) */}
                    <div className="bg-white dark:bg-zinc-900 border-2 border-primary rounded-xl shadow-neobrutalism-lg overflow-hidden transform md:-translate-y-4 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-coral text-white text-xs font-bold px-4 py-1.5 border-2 border-black rounded-full shadow-neobrutalism-sm uppercase tracking-wider whitespace-nowrap z-10">
                            🔥 Más Elegido
                        </div>
                        <div className="bg-primary p-5 border-b-2 border-black">
                            <h3 className="text-white text-2xl font-bold uppercase mt-1">Profesional</h3>
                            <p className="text-white/80 font-medium mt-1 text-sm">Todo lo que tu negocio necesita.</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-end justify-center gap-1 mb-1">
                                <span className="text-xl font-bold text-gray-400 line-through">$1,200</span>
                            </div>
                            <div className="flex items-end justify-center gap-2 mb-2">
                                <span className="text-5xl font-bold">$899</span>
                                <span className="text-lg font-bold text-gray-500 mb-1">USD</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium mb-6 text-center">Precio de lanzamiento — cupos limitados por mes.</p>
                            <div className="space-y-3 mb-6 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-bold text-sm">Todo lo de Esencial +</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Diseño Personalizado</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Dominio + Hosting Configurado</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">SEO para Google</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Soporte Post-Entrega</span>
                                </div>
                            </div>
                            <a href="#contacto" className="block w-full bg-black text-white font-bold py-3 text-base border-2 border-black shadow-[4px_4px_0px_0px_#8523e1] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-lg uppercase tracking-wide text-center">
                                Quiero Este Plan
                            </a>
                        </div>
                    </div>

                    {/* Plan 3 — Premium */}
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-xl shadow-neobrutalism overflow-hidden">
                        <div className="bg-ink-black p-5 border-b-2 border-black">
                            <h3 className="text-white text-2xl font-bold uppercase">Premium</h3>
                            <p className="text-white/70 font-medium mt-1 text-sm">Para negocios que quieren más.</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-end justify-center gap-2 mb-6">
                                <span className="text-5xl font-bold">$1,500</span>
                                <span className="text-lg font-bold text-gray-500 mb-1">USD</span>
                            </div>
                            <div className="space-y-3 mb-6 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-bold text-sm">Todo lo de Profesional +</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Hasta 5 Páginas</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Blog Integrado</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Google Analytics</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-mint border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-xs font-bold">check</span>
                                    </div>
                                    <span className="font-medium text-sm">Soporte 3 Meses</span>
                                </div>
                            </div>
                            <a href="#contacto" className="block w-full bg-white text-black font-bold py-3 text-base border-2 border-black shadow-[3px_3px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-lg uppercase tracking-wide text-center">
                                Consultar
                            </a>
                        </div>
                    </div>
                </div>
                {/* Trust signals */}
                <div className="mt-8 space-y-2">
                    <p className="font-bold text-sm uppercase">50% de seña para arrancar — el resto al entregar</p>
                    <p className="text-sm font-medium flex items-center justify-center gap-2">
                        <span className="material-icons text-green-700 text-base">verified</span>
                        Si no te convence el diseño antes de desarrollar, te devolvemos la seña.
                    </p>
                </div>
            </div>
        </section>
    );
}
