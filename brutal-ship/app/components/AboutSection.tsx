import Image from "next/image";
import BlockReveal from "./BlockReveal";

/**
 * Una agencia sin caras le pide a un desconocido que le confíe la cara pública de su
 * negocio. Para este público —no técnico, que evalúa desde el celular si esta gente
 * es seria— eso es una ausencia estructural, no un detalle.
 *
 * PENDIENTE DEL USUARIO: reemplazar `EQUIPO` con las personas reales.
 *   - `foto`: poner el archivo en /public/equipo/ y apuntar acá. Cuadrada, mínimo 400px.
 *   - Si `foto` queda vacío, se muestran las iniciales sobre el violeta. No es un
 *     placeholder roto: es un estado válido y se ve bien. Pero una foto real convierte
 *     mucho más que dos letras.
 *
 * Nada de lo que dice esta sección es inventado: no hay años de trayectoria, ni
 * cantidad de clientes, ni premios. Solo quién hace el trabajo y por qué.
 */

interface Persona {
    nombre: string;
    rol: string;
    linea: string;
    foto?: string;
    iniciales: string;
}

const EQUIPO: Persona[] = [
    {
        nombre: "Armando",
        rol: "Diseño y desarrollo",
        linea: "Hago las webs de punta a punta. Si te contesta alguien, soy yo.",
        foto: "",
        iniciales: "A",
    },
];

export default function AboutSection() {
    const solo = EQUIPO.length === 1;

    return (
        <section
            id="quienes-somos"
            aria-labelledby="quienes-somos-heading"
            className="relative bg-white border-b-2 border-black px-4 py-20 md:px-10 lg:px-20 overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 pattern-dots opacity-[0.05] pointer-events-none"
            ></div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    <div className="lg:col-span-7">
                        <BlockReveal>
                            <h2
                                id="quienes-somos-heading"
                                className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-ink-black"
                            >
                                No somos una empresa
                                <br />
                                <span className="text-primary">con un formulario.</span>
                            </h2>
                            <p className="mt-7 text-lg md:text-xl font-medium text-ink-black/80 medida-comoda">
                                Cuando escribís, te contesta una persona. La misma que después diseña
                                tu web, la publica y te atiende si algo se rompe. Sin intermediarios,
                                sin cuentas que rebotan, sin &ldquo;el área correspondiente&rdquo;.
                            </p>
                            <p className="mt-4 text-lg md:text-xl font-medium text-ink-black/80 medida-comoda">
                                Por eso el trato es directo por WhatsApp: es más rápido para vos y
                                para nosotros.
                            </p>
                        </BlockReveal>

                        <a
                            href="#contacto"
                            className="mt-9 inline-flex items-center gap-2 min-h-11 bg-primary text-white border-2 border-black font-bold text-lg py-4 px-8 rounded-lg shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            Quiero mi web
                            <span aria-hidden="true" className="material-icons">arrow_forward</span>
                        </a>
                    </div>

                    <div className="lg:col-span-5">
                        <ul className={`grid gap-6 ${solo ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
                            {EQUIPO.map((p) => (
                                <li
                                    key={p.nombre}
                                    className="ficha bg-white rounded-xl shadow-neobrutalism-lg p-7 pt-9 text-center"
                                >
                                    <span className="ficha-etiqueta text-ink-black">{p.rol}</span>

                                    <span className="mx-auto block w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-primary shadow-neobrutalism">
                                        {p.foto ? (
                                            <Image
                                                src={p.foto}
                                                alt={`Foto de ${p.nombre}`}
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-full w-full items-center justify-center text-5xl font-black text-white">
                                                {p.iniciales}
                                            </span>
                                        )}
                                    </span>

                                    <h3 className="mt-5 text-2xl font-bold leading-tight">{p.nombre}</h3>
                                    <p className="mt-2 font-medium text-ink-black/70 leading-snug">{p.linea}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
