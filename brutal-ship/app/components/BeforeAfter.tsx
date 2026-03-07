export default function BeforeAfter() {
    return (
        <div className="relative w-full overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>
            {/* Decorative Accent Shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-4 border-primary/20 animate-float z-0 hidden lg:block"></div>
            <div className="absolute bottom-40 right-10 w-24 h-24 rounded-full bg-secondary-mint/20 animate-float z-0 hidden lg:block" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
                {/* Hero Header */}
                <div className="text-center mb-20 relative">
                    <div className="inline-block relative">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6">
                            El Antes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-coral">y Después</span>
                        </h2>
                        {/* Decorative Mint Arrow SVG */}
                        <div className="absolute -right-12 -bottom-8 md:-right-24 md:-bottom-4 transform rotate-12 hidden sm:block">
                            <svg fill="none" height="80" viewBox="0 0 100 80" width="100" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 40 Q 50 10 90 40" fill="none" stroke="#00f090" strokeLinecap="round" strokeWidth="4"></path>
                                <path d="M90 40 L 80 25 M 90 40 L 75 45" stroke="#00f090" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                            </svg>
                            <span className="absolute top-12 left-12 transform rotate-12 bg-secondary-mint text-black text-xs font-bold px-2 py-1 border-2 border-black shadow-neo -ml-2 rounded-sm">
                                ¡Cambio Total!
                            </span>
                        </div>
                    </div>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-4 font-medium">
                        Tu web vieja te está haciendo perder clientes. Mirá cómo se ve la diferencia cuando dejás que profesionales se encarguen.
                    </p>
                </div>
                {/* Comparison Split Screen */}
                <div className="bg-white dark:bg-surface-dark border-4 border-black dark:border-white rounded-xl shadow-neo-lg overflow-hidden mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black dark:divide-white">
                        {/* LEFT: Before */}
                        <div className="relative p-8 lg:p-12 bg-gray-100 dark:bg-[#1a1a1a] group">
                            <div className="absolute top-6 left-6 z-20">
                                <span className="bg-secondary-coral text-white text-sm font-bold px-4 py-2 border-2 border-black rounded-md shadow-neo uppercase tracking-wider">
                                    Antes
                                </span>
                            </div>
                            <div className="mt-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-sm grayscale hover:grayscale-0">
                                <div className="bg-gray-200 dark:bg-gray-700 h-8 border-b border-gray-300 dark:border-gray-600 flex items-center px-4 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-300"></div>
                                </div>
                                <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-900 p-6 relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt="Sitio web anterior"
                                        className="w-full h-full object-cover object-top opacity-50 blur-[1px] mix-blend-multiply dark:mix-blend-overlay"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeB4wUeUUJTjoiI1EPrCdvnw20ImkJnORy0Wlw91FNXk7uk4LATnblBQBUDOw5CMnTfdsOREY954N3NjN8_gm52FgSUKwrZcWhu4bWj26eFAme9Y0iu43ZQ8WazdaoGN79KyeJE7uePGuue2r_sslQEQA-7r7OG2C9856y13b15E-HKUkhhWfiGc-R-IKfEcE0RJ6vwy23sjnnConSNZ2OkWnUhxlyQe0sBOCSbTmLS9Oy7MgDX5QdFLgY6_LRc9yGdomTCU2v2dE"
                                    />
                                    <div className="absolute top-1/4 left-1/4 bg-white dark:bg-gray-800 border-2 border-secondary-coral text-secondary-coral p-2 rounded shadow-md transform -rotate-3 text-xs font-bold flex items-center gap-1">
                                        <span className="material-icons-outlined text-sm">close</span> UI Desordenada
                                    </div>
                                    <div className="absolute bottom-1/3 right-10 bg-white dark:bg-gray-800 border-2 border-secondary-coral text-secondary-coral p-2 rounded shadow-md transform rotate-2 text-xs font-bold flex items-center gap-1">
                                        <span className="material-icons-outlined text-sm">close</span> Carga Lenta
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-coral/10 p-1 rounded border-2 border-secondary-coral/20 flex-shrink-0">
                                        <span className="material-icons-outlined text-secondary-coral">close</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-gray-200">Estética Desactualizada</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Diseño estancado en 2010 que no genera confianza.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-coral/10 p-1 rounded border-2 border-secondary-coral/20 flex-shrink-0">
                                        <span className="material-icons-outlined text-secondary-coral">close</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-gray-200">Navegación Confusa</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Los usuarios abandonan porque no encuentran la información.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* RIGHT: After */}
                        <div className="relative p-8 lg:p-12 bg-white dark:bg-surface-dark">
                            <div className="absolute top-6 left-6 z-20">
                                <span className="bg-secondary-mint text-gray-900 text-sm font-bold px-4 py-2 border-2 border-black rounded-md shadow-neo uppercase tracking-wider">
                                    Después
                                </span>
                            </div>
                            <div className="mt-12 bg-white dark:bg-gray-800 border-2 border-black rounded-lg overflow-hidden shadow-neo transform lg:scale-105 lg:-translate-x-2 transition-transform duration-500 hover:scale-110 z-10 relative">
                                <div className="bg-gray-100 dark:bg-gray-900 h-8 border-b-2 border-black flex items-center px-4 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-secondary-coral border border-black"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
                                    <div className="w-3 h-3 rounded-full bg-secondary-mint border border-black"></div>
                                    <div className="ml-4 w-full h-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full"></div>
                                </div>
                                <div className="aspect-[4/3] bg-white relative overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt="Sitio web nuevo"
                                        className="w-full h-full object-cover object-top"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt8E-gIWAW_rRUeXmw2BunyDFi3ETYiRNFMjEUjYXu6SYSd0wXq87N7GEWN_3mtYLB_sjkMYh3q4e6YKconTKb_qHe_cMufEWa3pYQvBz-_mYcXtg34NcAJbXfvJa6IBxIW1znASsTE8nU7iPlxQyc_F6kL-hYauMqvyW_2HnWcIgwF7Glj5c4xaTtMldgdwMKXlPK667_N7N9T8sTEaqhkVmifpG2dakSViEahqpnoTAXStelAt56DSHJqS25LMTs6-cBg9hAAD8"
                                    />
                                    <div className="absolute top-1/3 left-10 bg-secondary-mint border-2 border-black text-black p-2 rounded shadow-neo transform -rotate-1 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="material-icons-outlined text-sm">check</span> Alta Conv.
                                    </div>
                                    <div className="absolute bottom-1/4 right-1/4 bg-primary text-white border-2 border-black p-2 rounded shadow-neo transform rotate-2 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="material-icons-outlined text-sm">bolt</span> Carga Instantánea
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 lg:pl-4 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-mint/20 p-1 rounded border-2 border-secondary-mint flex-shrink-0">
                                        <span className="material-icons-outlined text-green-700 dark:text-secondary-mint font-bold">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-primary">Moderno y Confiable</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Estética limpia que te posiciona como líder de la industria.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-mint/20 p-1 rounded border-2 border-secondary-mint flex-shrink-0">
                                        <span className="material-icons-outlined text-green-700 dark:text-secondary-mint font-bold">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-primary">Enfocado en Resultados</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Diseños que guían al visitante a contactarte, no solo a mirar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mini Case Study Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <div className="bg-white dark:bg-surface-dark border-2 border-black dark:border-gray-700 rounded-lg p-6 shadow-neo hover:translate-y-[-4px] hover:shadow-neo-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wide">Consultas</span>
                            <span className="material-icons-outlined text-primary">trending_up</span>
                        </div>
                        <div className="text-5xl font-black text-primary mb-2">3x</div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">Más consultas en el primer mes con la web nueva.</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark border-2 border-black dark:border-gray-700 rounded-lg p-6 shadow-neo hover:translate-y-[-4px] hover:shadow-neo-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wide">Velocidad</span>
                            <span className="material-icons-outlined text-secondary-mint">speed</span>
                        </div>
                        <div className="text-5xl font-black text-secondary-mint dark:text-secondary-mint mb-2">0.8s</div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">Tiempo de carga promedio (antes 4.2s).</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark border-2 border-black dark:border-gray-700 rounded-lg p-6 shadow-neo hover:translate-y-[-4px] hover:shadow-neo-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wide">Visibilidad</span>
                            <span className="material-icons-outlined text-secondary-coral">favorite</span>
                        </div>
                        <div className="text-5xl font-black text-secondary-coral mb-2">+150%</div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">Aumento en el tiempo de sesión por usuario.</p>
                    </div>
                </div>
            </div>
            {/* Full Width CTA Banner */}
            <div className="w-full bg-primary relative overflow-hidden border-t-4 border-black dark:border-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "24px 24px" }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                            ¿Tu sitio web necesita una <br className="hidden md:block" />transformación total?
                        </h2>
                        <p className="text-white/80 text-xl max-w-xl">
                            No sigas perdiendo clientes por una web que no te representa. Te armamos una nueva, rápido y sin complicaciones.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button className="group relative inline-flex items-center justify-center">
                            <span className="absolute top-2 left-2 w-full h-full bg-black rounded-lg opacity-100"></span>
                            <span className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-white border-2 border-black rounded-lg group-hover:-translate-x-1 group-hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                                Quiero Mi Web Nueva
                                <span className="material-icons-outlined ml-2 group-hover:rotate-45 transition-transform">arrow_forward</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
