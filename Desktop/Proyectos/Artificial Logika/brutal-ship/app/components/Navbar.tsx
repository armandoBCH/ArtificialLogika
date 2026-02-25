export default function Navbar() {
    return (
        <nav className="border-b-2 border-black bg-white dark:bg-background-dark sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary border-2 border-black rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tighter uppercase">
                            Artificial<span className="text-primary">Logika</span>
                        </span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a
                            className="text-black dark:text-white font-bold hover:underline decoration-2 underline-offset-4 decoration-primary"
                            href="#servicios"
                        >
                            Servicios
                        </a>
                        <a
                            className="text-black dark:text-white font-bold hover:underline decoration-2 underline-offset-4 decoration-primary"
                            href="#portafolio"
                        >
                            Trabajos
                        </a>
                        <a
                            className="text-black dark:text-white font-bold hover:underline decoration-2 underline-offset-4 decoration-primary"
                            href="#precios"
                        >
                            Precios
                        </a>
                    </div>
                    <div className="flex items-center">
                        <a href="#contacto" className="bg-primary text-white border-2 border-black font-bold py-2 px-6 shadow-neobrutalism hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neobrutalism-sm transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-lg">
                            Presupuesto Gratis
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
