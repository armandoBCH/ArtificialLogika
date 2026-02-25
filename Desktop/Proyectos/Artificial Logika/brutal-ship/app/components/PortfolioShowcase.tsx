export default function PortfolioShowcase() {
    return (
        <section id="portafolio" className="relative w-full bg-dot-pattern pb-20">
            {/* Decorative Top Bar */}
            <div className="w-full h-4 bg-black dark:bg-primary"></div>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="flex flex-col md:flex-row md:items-end gap-6 border-b-4 border-black dark:border-white pb-8">
                    {/* Star Icon */}
                    <div className="text-mint shrink-0 transform hover:rotate-12 transition-transform duration-300">
                        <svg
                            className="drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                            fill="currentColor"
                            height="80"
                            viewBox="0 0 24 24"
                            width="80"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                stroke="black"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-black dark:text-white drop-shadow-sm leading-none">
                            Ejemplos <span className="text-primary dark:text-primary">Reales</span>
                        </h1>
                        <p className="mt-4 text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl border-l-4 border-black dark:border-white pl-4 ml-1">
                            Así se ven las webs que hacemos. Cada proyecto está pensado para el negocio de cada cliente.
                        </p>
                    </div>
                </div>
            </div>
            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Project Card 1 — Peluquería */}
                <article className="group relative bg-white dark:bg-gray-800 border-2 border-black dark:border-white shadow-hard hover:shadow-hard-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        <div className="bg-primary p-8 md:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white relative overflow-hidden">
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider border border-white/20">Peluquería</span>
                                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20">Servicios</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Estilo María</h2>
                                <p className="text-white/90 text-lg mb-8 font-light max-w-md">
                                    Web completa para peluquería: galería de trabajos, lista de precios, botón de WhatsApp para turnos y ubicación en Google Maps.
                                </p>
                            </div>
                            <div className="relative z-10 border-t border-white/20 pt-8 mt-auto">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <p className="text-3xl font-bold text-white">+300%</p>
                                        <p className="text-sm text-white/70 uppercase tracking-wide">Consultas por WhatsApp</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">2 sem</p>
                                        <p className="text-sm text-white/70 uppercase tracking-wide">Tiempo de Entrega</p>
                                    </div>
                                </div>
                                <a className="inline-flex items-center justify-between w-full sm:w-auto px-6 py-4 bg-white text-black font-bold text-lg uppercase border-2 border-black shadow-hard-sm hover:shadow-hard hover:translate-x-1 hover:-translate-y-1 transition-all duration-200 group-hover:bg-mint" href="#contacto">
                                    Quiero Algo Así
                                    <span className="material-icons ml-2">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-900 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full max-w-lg transform group-hover:scale-105 transition-transform duration-500 ease-out">
                                <div className="bg-white rounded-t-lg border-2 border-black shadow-hard overflow-hidden">
                                    <div className="bg-gray-200 border-b-2 border-black p-2 flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                    </div>
                                    <div className="aspect-[4/3] bg-gray-50 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt="Web de peluquería con galería de trabajos"
                                            className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVoR4f22OSpfWGZI1INmdC-nPQn7kkKJfA97M6BqYfuOqaj3Fp1VmxR33nkip7mwmR5BhlY-dEJ2YRui5WRNBmray4fUMysNLNEWbjwLEonSu1kEHQqgWWeJK8NtsaIVbjOmZI5koNc-8_vRtviwzvbjePekgBekv-iBz5Qgm25Zxp5Ax5cnjiHyAP8Iw-xNgq1qkd7b6zU7TfcXx_2CcerNv4fcqiRNkoLCNvT1dQXT8Oa6EHbjiB0_w3QIomwKZiC4Suw5BD_g4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
                {/* Decorative Divider */}
                <div className="w-full h-0 border-t-4 border-dashed border-black dark:border-white/20 opacity-30"></div>
                {/* Project Card 2 — Restaurante */}
                <article className="group relative bg-white dark:bg-gray-800 border-2 border-black dark:border-white shadow-hard hover:shadow-hard-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        <div className="order-2 lg:order-1 bg-gray-100 dark:bg-gray-900 p-8 md:p-12 flex items-center justify-center relative overflow-hidden border-t-2 lg:border-t-0 lg:border-r-2 border-black dark:border-white">
                            <div className="w-full max-w-lg transform group-hover:scale-105 transition-transform duration-500 ease-out">
                                <div className="bg-white rounded-t-lg border-2 border-black shadow-hard overflow-hidden">
                                    <div className="bg-gray-200 border-b-2 border-black p-2 flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                    </div>
                                    <div className="aspect-[4/3] bg-gray-50 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt="Web de restaurante con menú digital y reservas"
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC34rks4hUuzySIw08zD_pRjyWAW8TBN8YOAWPuYRdV0e9RE2Rp4O7IMi-XZ_C8oL8ZfnFbEDGOuzbuLjkqgf-JQHGaTXSFZH0tE4zFGJLCCJ23jp6oOgsNgXyCZVgIPGY4grCRH3zGeJC8c8zyl-bPMA7zNqArkJueK7JH6okBxbChxo6dnUUbVUFBlmhmj9khSE2EJwYXt3w46gz2TH1FhBINZbTKEvOQNPGnbVOVskzfWG8gx7yJ0NxHekila1dXtUMFuPT_D0Y"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 bg-mint p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 -mr-16 -mt-16 rotate-45 border-4 border-black"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider border border-black">Restaurante</span>
                                    <span className="px-3 py-1 bg-white/40 text-black text-xs font-bold uppercase tracking-wider border border-black">Gastronomía</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">Don Julio Parrilla</h2>
                                <p className="text-black/80 text-lg mb-8 font-medium max-w-md">
                                    Menú digital con fotos, sistema de reservas online, enlace a delivery y mapa para llegar fácil. Todo en una web rápida y atractiva.
                                </p>
                            </div>
                            <div className="relative z-10 border-t border-black/20 pt-8 mt-auto">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <p className="text-3xl font-bold text-black">+45%</p>
                                        <p className="text-sm text-black/70 uppercase tracking-wide">Reservas Online</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-black">10 días</p>
                                        <p className="text-sm text-black/70 uppercase tracking-wide">Tiempo de Entrega</p>
                                    </div>
                                </div>
                                <a className="inline-flex items-center justify-between w-full sm:w-auto px-6 py-4 bg-black text-white font-bold text-lg uppercase border-2 border-transparent shadow-hard-sm hover:shadow-hard hover:translate-x-1 hover:-translate-y-1 transition-all duration-200 hover:bg-white hover:text-black hover:border-black" href="#contacto">
                                    Quiero Algo Así
                                    <span className="material-icons ml-2">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </article>
                {/* Decorative Divider */}
                <div className="w-full h-0 border-t-4 border-dashed border-black dark:border-white/20 opacity-30"></div>
                {/* Project Card 3 — Estudio de Abogados */}
                <article className="group relative bg-white dark:bg-gray-800 border-2 border-black dark:border-white shadow-hard hover:shadow-hard-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        <div className="bg-coral p-8 md:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border-[20px] border-white opacity-10 rounded-full scale-150"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider border border-white/20">Profesional</span>
                                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20">Abogacía</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Estudio Torres & Asoc.</h2>
                                <p className="text-white/90 text-lg mb-8 font-light max-w-md">
                                    Sitio profesional para estudio de abogados: áreas de práctica, equipo, formulario de consulta y blog con artículos legales.
                                </p>
                            </div>
                            <div className="relative z-10 border-t border-white/20 pt-8 mt-auto">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <p className="text-3xl font-bold text-white">3x</p>
                                        <p className="text-sm text-white/70 uppercase tracking-wide">Consultas Mensuales</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">100%</p>
                                        <p className="text-sm text-white/70 uppercase tracking-wide">Satisfacción</p>
                                    </div>
                                </div>
                                <a className="inline-flex items-center justify-between w-full sm:w-auto px-6 py-4 bg-white text-black font-bold text-lg uppercase border-2 border-black shadow-hard-sm hover:shadow-hard hover:translate-x-1 hover:-translate-y-1 transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:border-white" href="#contacto">
                                    Quiero Algo Así
                                    <span className="material-icons ml-2">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-900 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full max-w-lg transform group-hover:scale-105 transition-transform duration-500 ease-out">
                                <div className="bg-white rounded-t-lg border-2 border-black shadow-hard overflow-hidden">
                                    <div className="bg-gray-200 border-b-2 border-black p-2 flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                        <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                    </div>
                                    <div className="aspect-[4/3] bg-gray-50 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt="Web profesional de estudio de abogados"
                                            className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEj_813dqwISEs5lWRSIW1ssxp16U3iBzCnBlvH6Wctkv5vpkpBhmJCHG5sq5VJDzLHirDOJeC3PhIyIdjfDaBKhXJcU_Fh6xAV0RpR86jfdJXErpaWLHj0RDbG5mDqGuU24RldkomkZ1PjUoIXzQUvEpHgamVUzYPEslegbTfUwc0Nfbu_jO4pZhJzdHfq4ZOs_nb3QfZOEO8iu1WvPyKWDScLzuZm2_EBmVuMYq6exsOYBPM35gNlvBt9YidEhEJ137rJcr-W3c"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">¿Tu negocio no está en la lista? No importa — hacemos webs para cualquier rubro.</p>
                <a className="inline-block px-12 py-6 bg-black text-white text-xl font-bold uppercase tracking-widest border-2 border-transparent hover:bg-white hover:text-black hover:border-black shadow-hard hover:shadow-hard-lg transition-all duration-300 transform hover:-translate-y-1" href="#contacto">
                    Contanos Sobre Tu Negocio
                </a>
            </div>
        </section>
    );
}
