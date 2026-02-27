export default function ServicesSection() {
    return (
        <section className="relative w-full py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-white dark:bg-background-dark">
            {/* Background Geometric Decorations */}
            <div className="decorative-shape top-10 left-[-50px] w-64 h-64 rounded-full border-4 border-primary dark:border-primary/50"></div>
            <div className="decorative-shape top-40 right-[-20px] w-48 h-48 bg-mint-fresh rounded-full"></div>
            <div className="decorative-shape bottom-20 left-20 w-32 h-32 bg-hot-coral rotate-45"></div>
            <div className="decorative-shape bottom-40 right-1/4 w-24 h-24 border-4 border-ink-black dark:border-white/20 rounded-full"></div>
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20 relative">
                    <div className="inline-block relative">
                        {/* Geometric Circle Behind Title */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-mint-fresh rounded-full -z-10 mix-blend-multiply dark:mix-blend-normal dark:opacity-50"></div>
                        <h2 className="text-5xl md:text-6xl font-bold text-ink-black dark:text-white tracking-tight leading-none">
                            Nuestros Servicios
                        </h2>
                    </div>
                    <p className="mt-6 text-xl text-muted-charcoal dark:text-gray-300 max-w-2xl mx-auto font-medium">
                        Elegí el tipo de web que mejor se adapte a tu negocio.{" "}
                        <br className="hidden md:block" />
                        Nosotros nos encargamos de todo, vos solo elegís.
                    </p>
                </div>
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {/* Card 1: One-Page */}
                    <div className="neo-card flex flex-col h-full bg-white dark:bg-gray-800 border-2 border-ink-black dark:border-gray-600 rounded-sm shadow-neo overflow-hidden">
                        <div className="h-3 w-full bg-primary"></div>
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border-2 border-ink-black dark:border-gray-400">
                                    <span className="material-icons text-primary text-3xl">web</span>
                                </div>
                                <span className="inline-block px-3 py-1 bg-soft-smoke dark:bg-gray-700 border border-ink-black dark:border-gray-500 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_#1A1A1A]">
                                    Desde $899
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-ink-black dark:text-white">
                                Página Web One-Page
                            </h3>
                            <p className="text-muted-charcoal dark:text-gray-300 mb-6 text-sm leading-relaxed">
                                Perfecta para emprendedores y negocios que quieren estar online rápido. Todo en una sola página, simple y efectivo.
                            </p>
                            <div className="mt-auto pt-6 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-primary text-base">check_circle</span>
                                        <span>Diseño Responsive</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-primary text-base">check_circle</span>
                                        <span>Formulario de Contacto</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-primary text-base">check_circle</span>
                                        <span>Integración con Redes</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-primary text-base">check_circle</span>
                                        <span>Optimización SEO Básica</span>
                                    </li>
                                </ul>
                                <a href="#contacto" className="w-full mt-8 py-3 bg-white dark:bg-gray-700 border-2 border-ink-black dark:border-gray-400 text-ink-black dark:text-white font-bold rounded-sm shadow-neo-sm hover:shadow-neo transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none text-center block">
                                    Consultar
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Card 2: Landing Page */}
                    <div className="neo-card flex flex-col h-full bg-white dark:bg-gray-800 border-2 border-ink-black dark:border-gray-600 rounded-sm shadow-neo overflow-hidden relative">
                        {/* Popular Badge */}
                        <div className="absolute top-6 right-[-28px] rotate-45 bg-ink-black text-white text-xs font-bold py-1 px-8 z-10">
                            POPULAR
                        </div>
                        <div className="h-3 w-full bg-mint-fresh"></div>
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-mint-fresh/20 rounded-full flex items-center justify-center border-2 border-ink-black dark:border-gray-400">
                                    <span className="material-icons text-green-600 dark:text-mint-fresh text-3xl">
                                        track_changes
                                    </span>
                                </div>
                                <span className="inline-block px-3 py-1 bg-soft-smoke dark:bg-gray-700 border border-ink-black dark:border-gray-500 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_#1A1A1A]">
                                    Desde $1,200
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-ink-black dark:text-white">
                                Landing Page Conversión
                            </h3>
                            <p className="text-muted-charcoal dark:text-gray-300 mb-6 text-sm leading-relaxed">
                                Diseñada para captar clientes y generar consultas. Ideal si querés promocionar un servicio específico o una campaña.
                            </p>
                            <div className="mt-auto pt-6 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-mint-fresh text-base">check_circle</span>
                                        <span>Copywriting Persuasivo</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-mint-fresh text-base">check_circle</span>
                                        <span>Textos Persuasivos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-mint-fresh text-base">check_circle</span>
                                        <span>Botón de WhatsApp</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-mint-fresh text-base">check_circle</span>
                                        <span>Velocidad Optimizada</span>
                                    </li>
                                </ul>
                                <a href="#contacto" className="w-full mt-8 py-3 bg-ink-black text-white border-2 border-ink-black font-bold rounded-sm shadow-neo-sm hover:shadow-neo hover:bg-gray-900 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none text-center block">
                                    Lo Quiero
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Card 3: Multi-Page */}
                    <div className="neo-card flex flex-col h-full bg-white dark:bg-gray-800 border-2 border-ink-black dark:border-gray-600 rounded-sm shadow-neo overflow-hidden">
                        <div className="h-3 w-full bg-hot-coral"></div>
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-hot-coral/20 rounded-full flex items-center justify-center border-2 border-ink-black dark:border-gray-400">
                                    <span className="material-icons text-hot-coral text-3xl">layers</span>
                                </div>
                                <span className="inline-block px-3 py-1 bg-soft-smoke dark:bg-gray-700 border border-ink-black dark:border-gray-500 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_#1A1A1A]">
                                    Desde $2,400
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-ink-black dark:text-white">
                                Web Multi-Página
                            </h3>
                            <p className="text-muted-charcoal dark:text-gray-300 mb-6 text-sm leading-relaxed">
                                Sitio web completo con varias secciones. Ideal para negocios establecidos que necesitan mostrar todo lo que hacen.
                            </p>
                            <div className="mt-auto pt-6 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-hot-coral text-base">check_circle</span>
                                        <span>Hasta 10 Páginas Internas</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-hot-coral text-base">check_circle</span>
                                        <span>Editable por Vos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-hot-coral text-base">check_circle</span>
                                        <span>Blog Integrado</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-icons text-hot-coral text-base">check_circle</span>
                                        <span>SEO Avanzado</span>
                                    </li>
                                </ul>
                                <a href="#contacto" className="w-full mt-8 py-3 bg-white dark:bg-gray-700 border-2 border-ink-black dark:border-gray-400 text-ink-black dark:text-white font-bold rounded-sm shadow-neo-sm hover:shadow-neo transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none text-center block">
                                    Consultar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* CTA Banner */}
                <div className="w-full bg-primary border-2 border-ink-black rounded-lg shadow-neo p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            ¿No sabes cuál elegir?
                        </h3>
                        <p className="text-white/90 font-medium text-lg">
                            Te ayudamos a elegir la opción perfecta para tu negocio. Gratis y sin compromiso.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <button className="px-8 py-4 bg-white text-ink-black font-bold text-lg rounded-sm border-2 border-ink-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center gap-2 group">
                            <span>Agendar Llamada</span>
                            <span className="material-icons group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section >
    );
}
