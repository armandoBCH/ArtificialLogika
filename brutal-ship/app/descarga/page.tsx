import type { Metadata } from "next";
import { BUSINESS } from "@/lib/seo/constants";

// Pagina oculta: no esta en el sitemap ni enlazada desde ningun lado, y pide no
// ser indexada. Se le pasa el link al cliente por WhatsApp.
export const metadata: Metadata = {
    title: "Tu aplicación está lista",
    description: "Tu aplicación ya está terminada. Tocá el botón para descargarla.",
    robots: { index: false, follow: false },
};

// El archivo de la app. Cambiar este link cuando haya una version nueva.
// Es el link directo de Drive (usercontent + confirm=t), no el de "ver": ese abre
// la vista previa y, por ser un .exe, un cartel de "no se pudo analizar".
const DOWNLOAD_URL =
    "https://drive.usercontent.google.com/download?id=1WffqYLjVXQYT7Erot-5Gn7hn6IgYIBYA&export=download&confirm=t";

const PASOS = [
    "Tocá el botón Descargar.",
    "Abrí el archivo Aliverti.exe que se bajó.",
    "Si Windows muestra un cartel azul, tocá «Más información» y después «Ejecutar de todas formas».",
];

const whatsappUrl = `https://wa.me/${BUSINESS.phone.replace("+", "")}?text=${encodeURIComponent("Hola! Tengo una consulta sobre la descarga de mi aplicación")}`;

export default function Descarga() {
    return (
        <main id="contenido" className="min-h-screen bg-background-light flex items-center justify-center px-4 py-16">
            <div className="text-center max-w-lg">
                <div className="bg-secondary border-4 border-black p-4 inline-flex transform -rotate-3 shadow-neobrutalism-lg mb-8">
                    <span aria-hidden="true" className="material-icons text-black !text-6xl md:!text-7xl">check_circle</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
                    Tu aplicación está lista
                </h1>
                <p className="text-lg text-ink-black/70 mb-10">
                    Ya terminamos tu aplicación. Para descargarla, tocá el botón de abajo
                    desde tu computadora con Windows.
                </p>
                <a
                    href={DOWNLOAD_URL}
                    className="cta inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-primary text-white border-4 border-black font-bold text-xl md:text-2xl uppercase py-5 px-12 shadow-neobrutalism-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all rounded-lg"
                >
                    <span aria-hidden="true" className="material-icons !text-3xl">download</span>
                    Descargar
                </a>
                <ol className="mt-12 space-y-4 text-left bg-white border-4 border-black rounded-lg p-6 shadow-neobrutalism">
                    {PASOS.map((paso, i) => (
                        <li key={paso} className="flex gap-4 items-start">
                            <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-accent-yellow border-2 border-black rounded-full font-black">
                                {i + 1}
                            </span>
                            <span className="text-base md:text-lg pt-0.5">{paso}</span>
                        </li>
                    ))}
                </ol>
                <p className="text-base text-ink-black/70 mt-10">
                    ¿Tenés alguna duda?{" "}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline">
                        Escribinos por WhatsApp
                    </a>
                </p>
            </div>
        </main>
    );
}
