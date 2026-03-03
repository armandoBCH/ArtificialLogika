export default function ContentSplit() {
    return (
        <section className="border-y-2 border-black bg-background-light dark:bg-background-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-20 flex flex-col justify-center border-b-2 lg:border-b-0 lg:border-r-2 border-black">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 leading-tight">
                        Vos Atendé Tu{" "}
                        <span className="bg-primary text-white px-2">Negocio</span>,
                        <br />
                        De la Web Nos Encargamos.
                    </h2>
                    <p className="text-xl font-medium mb-8">
                        Sabemos que no tenés tiempo para preocuparte por cosas técnicas. Por eso nos encargamos de todo el proceso: desde el primer boceto hasta la publicación. Vos solo nos decís qué necesitás.
                    </p>
                    <ul className="space-y-4 font-bold text-lg">
                        <li className="flex items-center gap-3">
                            <span className="bg-accent-yellow border-2 border-black p-1 rounded-sm">
                                <span className="material-icons text-sm">check</span>
                            </span>
                            <span>Sin conocimientos técnicos necesarios</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="bg-accent-yellow border-2 border-black p-1 rounded-sm">
                                <span className="material-icons text-sm">check</span>
                            </span>
                            <span>Proceso 100% guiado por nosotros</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="bg-accent-yellow border-2 border-black p-1 rounded-sm">
                                <span className="material-icons text-sm">check</span>
                            </span>
                            <span>Soporte después de la entrega</span>
                        </li>
                    </ul>
                </div>
                <div
                    className="bg-white dark:bg-zinc-900 relative h-96 lg:h-auto overflow-hidden flex items-center justify-center bg-cover bg-center grayscale contrast-125"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
                    }}
                    data-alt="Textura geométrica abstracta representando creatividad"
                >
                    <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
                    <div className="relative bg-white border-2 border-black p-8 shadow-neobrutalism rounded-xl max-w-sm rotate-3 hover:-rotate-1 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-full bg-gray-200 border border-black"
                                style={{
                                    backgroundImage:
                                        "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop')",
                                    backgroundSize: "cover",
                                }}
                                data-alt="Retrato de una clienta satisfecha"
                            ></div>
                            <div>
                                <div className="font-bold">Laura Gómez</div>
                                <div className="text-xs font-bold text-gray-500 uppercase">
                                    Dueña de Florería
                                </div>
                            </div>
                        </div>
                        <p className="font-medium italic">
                            &quot;Les dije lo que quería y en dos semanas tenía mi web lista. Yo no tuve que hacer nada. ¡Increíble!&quot;
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
