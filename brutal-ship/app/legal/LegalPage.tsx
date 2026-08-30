import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { SiteConfigMap } from "@/lib/types/database";

/**
 * Shell compartida por las páginas legales. Hereda el mundo neobrutalista de la
 * home pero baja el volumen: acá el trabajo es leer, no decidir.
 */
export default function LegalPage({
    config,
    titulo,
    actualizado,
    intro,
    children,
}: {
    config: SiteConfigMap;
    titulo: string;
    actualizado: string;
    intro: string;
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar config={config} />
            <main id="contenido" className="bg-background-light">
                <header className="border-b-2 border-black px-4 pt-36 pb-14 md:px-10 lg:px-20">
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 min-h-11 font-bold uppercase tracking-wider text-sm text-black/60 hover:text-primary transition-colors"
                        >
                            <span aria-hidden="true" className="material-icons text-base">arrow_back</span>
                            Volver al inicio
                        </Link>
                        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95]">
                            {titulo}
                        </h1>
                        <p className="mt-5 text-lg font-medium text-black/70">{intro}</p>
                        <p className="mt-6 inline-block border-2 border-black bg-accent-yellow px-3 py-1 text-sm font-bold uppercase tracking-wider shadow-neobrutalism-sm rounded">
                            Última actualización: {actualizado}
                        </p>
                    </div>
                </header>

                <div className="px-4 py-16 md:px-10 lg:px-20">
                    <div className="legal-prose max-w-3xl mx-auto">{children}</div>
                </div>
            </main>
            <Footer config={config} />
        </>
    );
}
