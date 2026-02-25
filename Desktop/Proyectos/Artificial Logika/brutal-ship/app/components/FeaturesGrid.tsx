export default function FeaturesGrid() {
    return (
        <section className="py-24 bg-white dark:bg-background-dark pattern-dots relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-5xl font-bold uppercase tracking-tighter mb-4 inline-block bg-white dark:bg-zinc-800 px-4 border-2 border-black shadow-neobrutalism rotate-1">
                        ¿Qué Incluye Tu Web?
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group bg-white dark:bg-zinc-900 border-2 border-black p-8 shadow-neobrutalism hover:shadow-neobrutalism-primary transition-all rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-icons text-9xl text-primary">devices</span>
                        </div>
                        <div className="w-14 h-14 bg-mint border-2 border-black rounded flex items-center justify-center mb-6 shadow-neobrutalism-sm group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <span className="material-icons text-black text-2xl">devices</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 uppercase">Diseño Responsive</h3>
                        <p className="font-medium text-gray-600 dark:text-gray-300">
                            Tu web se ve perfecta en celulares, tablets y computadoras. Tus clientes te encuentran desde cualquier dispositivo.
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="group bg-primary text-white border-2 border-black p-8 shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-icons text-9xl text-white">palette</span>
                        </div>
                        <div className="w-14 h-14 bg-white border-2 border-black rounded flex items-center justify-center mb-6 shadow-neobrutalism-sm">
                            <span className="material-icons text-black text-2xl">palette</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 uppercase">Diseño Personalizado</h3>
                        <p className="font-medium text-white/90">
                            Nada de plantillas genéricas. Diseñamos tu web con la identidad y los colores de tu marca para que sea única.
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="group bg-white dark:bg-zinc-900 border-2 border-black p-8 shadow-neobrutalism hover:shadow-neobrutalism-primary transition-all rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-icons text-9xl text-primary">speed</span>
                        </div>
                        <div className="w-14 h-14 bg-accent-yellow border-2 border-black rounded flex items-center justify-center mb-6 shadow-neobrutalism-sm group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <span className="material-icons text-black text-2xl">speed</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 uppercase">Carga Ultra Rápida</h3>
                        <p className="font-medium text-gray-600 dark:text-gray-300">
                            Tu web carga al instante. Los visitantes no esperan y Google te posiciona mejor por la velocidad.
                        </p>
                    </div>
                    {/* Card 4 */}
                    <div className="group bg-white dark:bg-zinc-900 border-2 border-black p-8 shadow-neobrutalism hover:shadow-neobrutalism-primary transition-all rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-icons text-9xl text-primary">search</span>
                        </div>
                        <div className="w-14 h-14 bg-purple-200 border-2 border-black rounded flex items-center justify-center mb-6 shadow-neobrutalism-sm group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <span className="material-icons text-black text-2xl">search</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 uppercase">SEO Incluido</h3>
                        <p className="font-medium text-gray-600 dark:text-gray-300">
                            Optimizamos tu web para que aparezca en Google cuando tus clientes busquen lo que ofrecés.
                        </p>
                    </div>
                    {/* Card 5 */}
                    <div className="group bg-white dark:bg-zinc-900 border-2 border-black p-8 shadow-neobrutalism hover:shadow-neobrutalism-primary transition-all rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-icons text-9xl text-primary">support_agent</span>
                        </div>
                        <div className="w-14 h-14 bg-blue-200 border-2 border-black rounded flex items-center justify-center mb-6 shadow-neobrutalism-sm group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <span className="material-icons text-black text-2xl">support_agent</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 uppercase">Soporte Incluido</h3>
                        <p className="font-medium text-gray-600 dark:text-gray-300">
                            No te dejamos solo después de entregar. Tenés soporte para cualquier duda o cambio que necesites.
                        </p>
                    </div>
                    {/* Card 6 */}
                    <div className="group bg-mint border-2 border-black p-8 shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-icons text-9xl text-black">build</span>
                        </div>
                        <div className="w-14 h-14 bg-white border-2 border-black rounded flex items-center justify-center mb-6 shadow-neobrutalism-sm">
                            <span className="material-icons text-black text-2xl">build</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 uppercase">Nosotros Tramitamos Todo</h3>
                        <p className="font-medium text-black/80">
                            Dominio, hosting, emails, certificado SSL. No te preocupés por nada técnico — lo resolvemos por vos.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
