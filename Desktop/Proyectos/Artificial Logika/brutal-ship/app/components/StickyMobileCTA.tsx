"use client";

export default function StickyMobileCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-ink-black/95 backdrop-blur-md border-t-2 border-primary/50 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 max-w-lg mx-auto">
                <a
                    href="https://wa.me/5491112345678?text=Hola!%20Quiero%20consultar%20por%20una%20web%20para%20mi%20negocio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-black font-bold text-sm uppercase tracking-wider rounded border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all whitespace-nowrap"
                    aria-label="Chatear por WhatsApp"
                >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                    href="#contacto"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all"
                >
                    <span>Presupuesto Gratis</span>
                    <span className="material-icons text-sm">arrow_forward</span>
                </a>
            </div>
        </div>
    );
}
