export default function HeroSection() {
    return (
        <header className="relative overflow-hidden bg-background-light dark:bg-background-dark pt-16 pb-24 border-b-2 border-black">
            {/* Abstract Shapes */}
            <div className="absolute top-20 right-[-50px] w-64 h-64 bg-mint rounded-full border-2 border-black mix-blend-multiply opacity-80 hidden lg:block z-0 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent-yellow border-2 border-black transform rotate-12 z-0 hidden lg:block"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-block bg-accent-yellow border-2 border-black px-4 py-1 font-bold text-sm shadow-neobrutalism-sm transform -rotate-2 rounded">
                            ✨ NOS ENCARGAMOS DE TODO
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter uppercase break-words">
                            Tu Web<br />
                            <span className="text-transparent bg-clip-text bg-primary text-stroke">
                                Profesional.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl font-medium border-l-4 border-primary pl-6 py-2 max-w-lg">
                            Diseñamos y creamos la página web que tu negocio necesita. Vos no te preocupás por nada — nosotros nos encargamos de todo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href="#contacto" className="bg-primary text-white border-2 border-black font-bold text-lg py-4 px-8 shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg flex items-center justify-center gap-2">
                                Presupuesto Gratis
                                <span className="material-icons">arrow_forward</span>
                            </a>
                            <a href="#portafolio" className="bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black font-bold text-lg py-4 px-8 shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg text-center">
                                Ver Nuestro Trabajo
                            </a>
                        </div>
                    </div>
                    {/* Hero Visual */}
                    <div className="relative">
                        <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-xl shadow-neobrutalism-lg p-2 transform rotate-1 hover:rotate-0 transition-all duration-300">
                            <div className="bg-background-light dark:bg-zinc-800 border-2 border-black rounded-lg overflow-hidden h-96 relative">
                                {/* Abstract UI Mockup */}
                                <div className="absolute top-0 left-0 w-full h-12 border-b-2 border-black bg-white dark:bg-zinc-900 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                                </div>
                                <div className="p-6 mt-12 grid grid-cols-2 gap-4">
                                    <div className="col-span-2 h-32 bg-primary/20 border-2 border-dashed border-primary rounded flex items-center justify-center">
                                        <span className="text-primary font-bold">TU SITIO WEB</span>
                                    </div>
                                    <div className="h-24 bg-mint border-2 border-black rounded"></div>
                                    <div className="h-24 bg-accent-yellow border-2 border-black rounded"></div>
                                </div>
                                {/* Floating element */}
                                <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-900 border-2 border-black p-4 rounded shadow-neobrutalism flex items-center gap-3">
                                    <div className="bg-green-500 rounded-full p-1 border border-black">
                                        <span className="material-icons text-white text-sm">check</span>
                                    </div>
                                    <div className="font-bold">¡Listo para Publicar!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
