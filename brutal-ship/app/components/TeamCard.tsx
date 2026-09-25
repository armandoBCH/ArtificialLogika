import Image from "next/image";

/**
 * Una agencia sin caras le pide a un desconocido que le confíe la cara pública de su
 * negocio. Para este público —no técnico, que evalúa desde el celular si esta gente es
 * seria— eso es una ausencia estructural, no un detalle.
 *
 * Fue una sección propia ("No somos una empresa con un formulario", 1,7 pantallas de
 * celular). Desde 2026-09 es esta ficha, dentro de Contacto: las caras aparecen en el
 * momento en que la persona decide escribir, que es cuando más pesan. El párrafo de
 * "Logika con K" se mudó al footer.
 *
 * Para sumar personas: agregar entradas a `EQUIPO`.
 *   - `foto`: el archivo va en /public/equipo/ y se apunta acá. Cuadrada, mínimo 400px.
 *   - Si `foto` queda vacío se muestran las iniciales sobre el violeta. No es un
 *     placeholder roto: es un estado válido y se ve bien.
 *   - La bajada nombra a Armando porque es quien contesta. Si eso cambia, cambia ahí.
 *
 * Nada de lo que dice es inventado: no hay años de trayectoria, ni cantidad de
 * clientes, ni premios. Solo quién hace el trabajo.
 */

interface Persona {
    nombre: string;
    rol: string;
    foto?: string;
    iniciales: string;
}

const EQUIPO: Persona[] = [
    {
        nombre: "Armando",
        rol: "Diseño y desarrollo",
        foto: "/equipo/armando.webp",
        iniciales: "A",
    },
    {
        nombre: "Fran Roquel",
        rol: "Redes y marketing",
        foto: "/equipo/fran.webp",
        iniciales: "F",
    },
];

export default function TeamCard() {
    return (
        // #quienes-somos era el id de la sección "Nosotros": los links viejos caen acá.
        <div id="quienes-somos" className="ficha bg-white rounded-xl shadow-neobrutalism p-6 pt-8 md:p-7 md:pt-9 text-ink-black">
            <span className="ficha-etiqueta text-ink-black">Quiénes somos</span>
            <p className="text-xl font-bold leading-snug">No somos una empresa con un formulario.</p>
            <p className="mt-2 font-medium leading-snug text-ink-black/75">
                Cuando escribís, te contesta Armando: el mismo que después diseña tu web, la publica y te
                atiende si algo se rompe.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-4">
                {EQUIPO.map((p) => (
                    <li key={p.nombre} className="flex items-center gap-3">
                        <span className="block w-14 h-14 shrink-0 rounded-full border-2 border-black overflow-hidden bg-primary">
                            {p.foto ? (
                                <Image
                                    src={p.foto}
                                    alt={`Foto de ${p.nombre}`}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-xl font-black text-white">
                                    {p.iniciales}
                                </span>
                            )}
                        </span>
                        <span>
                            <span className="block font-bold leading-tight">{p.nombre}</span>
                            <span className="block text-sm font-medium text-ink-black/70">{p.rol}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
