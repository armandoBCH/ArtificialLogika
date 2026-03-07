import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
    title: "Página no encontrada",
    description:
        "La página que buscás no existe. Volvé al inicio para explorar nuestros servicios de diseño web.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                <div className="bg-accent-yellow border-4 border-black p-3 inline-block transform -rotate-3 shadow-[6px_6px_0_#000] mb-8">
                    <span className="text-6xl md:text-8xl font-black text-black">
                        404
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                    Página No Encontrada
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    La página que buscás no existe o fue movida. Pero no te preocupes,
                    podés volver al inicio y explorar nuestros servicios.
                </p>
                <a
                    href={SITE_URL}
                    className="inline-flex items-center gap-2 bg-primary text-white border-2 border-black font-bold text-lg py-3 px-8 shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg"
                >
                    <span className="material-icons">home</span>
                    Volver al Inicio
                </a>
            </div>
        </main>
    );
}
