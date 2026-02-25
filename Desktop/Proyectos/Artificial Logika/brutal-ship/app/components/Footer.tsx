export default function Footer() {
    return (
        <footer className="bg-ink-black border-t-2 border-white/10 text-white pt-16 pb-8 px-6 md:px-10 relative overflow-hidden">
            {/* Geometric Footer Decoration */}
            <div className="geometric-shape bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 text-white mb-6">
                            <div className="size-8 flex items-center justify-center rounded bg-white text-black border-2 border-primary">
                                <span className="material-symbols-outlined">code</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Artificial Logika</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Hacemos páginas web profesionales para todo tipo de negocio. Vos te enfocás en lo tuyo, nosotros nos encargamos de tu presencia digital.
                        </p>
                        <div className="flex gap-4">
                            <a
                                className="size-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400 group"
                                href="#"
                                aria-label="Instagram"
                            >
                                <span className="material-symbols-outlined text-lg">photo_camera</span>
                            </a>
                            <a
                                className="size-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400 group"
                                href="#"
                                aria-label="Email"
                            >
                                <span className="material-symbols-outlined text-lg">alternate_email</span>
                            </a>
                            <a
                                className="size-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400 group"
                                href="#"
                                aria-label="WhatsApp"
                            >
                                <span className="material-symbols-outlined text-lg">chat</span>
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-secondary pl-3">Navegación</h4>
                        <ul className="space-y-3">
                            <li>
                                <a className="text-gray-400 hover:text-secondary hover:pl-2 transition-all block" href="#servicios">
                                    Servicios
                                </a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-secondary hover:pl-2 transition-all block" href="#portafolio">
                                    Nuestro Trabajo
                                </a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-secondary hover:pl-2 transition-all block" href="#precios">
                                    Precios
                                </a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-secondary hover:pl-2 transition-all block" href="#contacto">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-primary pl-3">Servicios</h4>
                        <ul className="space-y-3">
                            <li>
                                <a className="text-gray-400 hover:text-primary hover:pl-2 transition-all block" href="#servicios">
                                    Página Web One-Page
                                </a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-primary hover:pl-2 transition-all block" href="#servicios">
                                    Landing Page
                                </a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-primary hover:pl-2 transition-all block" href="#servicios">
                                    Web Multi-Página
                                </a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-primary hover:pl-2 transition-all block" href="#servicios">
                                    Rediseño Web
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* CTA Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-white pl-3">¿Listo para Arrancar?</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Escribinos hoy y en menos de 24hs te respondemos con una propuesta para tu proyecto.
                        </p>
                        <a
                            href="#contacto"
                            className="block w-full bg-white text-black font-bold text-sm uppercase py-3 px-6 rounded hover:bg-gray-200 transition-colors border-2 border-transparent hover:border-primary text-center"
                        >
                            Quiero Mi Web
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2024 Artificial Logika. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-white transition-colors" href="#">
                            Política de Privacidad
                        </a>
                        <a className="hover:text-white transition-colors" href="#">
                            Términos de Servicio
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
