export default function MarqueeBanner() {
    return (
        <div className="border-y-2 border-black bg-ink-black py-4 overflow-hidden whitespace-nowrap group">
            {/* translateX(-50%) exige que las dos mitades sean idénticas: con 7 ítems
                (4 + 3) el loop saltaba cada 20s. Ahora son 4 + 4.
                Se pausa al pasar el mouse — antes no había forma de detenerlo. */}
            <div className="inline-flex animate-marquee items-center gap-12 group-hover:[animation-play-state:paused]">
                <span className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">brush</span> Diseño Atractivo
                </span>
                <span className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">handshake</span> Sin Complicaciones
                </span>
                <span className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">verified</span> Resultados Reales
                </span>
                <span className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">rocket_launch</span> Entrega Rápida
                </span>
                <span aria-hidden="true" className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">brush</span> Diseño Atractivo
                </span>
                <span aria-hidden="true" className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">handshake</span> Sin Complicaciones
                </span>
                <span aria-hidden="true" className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">verified</span> Resultados Reales
                </span>
                <span aria-hidden="true" className="text-white font-bold text-2xl uppercase tracking-widest flex items-center gap-2">
                    <span aria-hidden="true" className="material-icons">rocket_launch</span> Entrega Rápida
                </span>
            </div>
        </div>
    );
}
