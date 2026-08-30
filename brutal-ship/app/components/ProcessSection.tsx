import BlockReveal from "./BlockReveal";

/**
 * Reconstruida desde cero. La versión anterior eran cuatro tarjetas idénticas con
 * número, título y texto — el formato más común que existe, y por lo tanto el que
 * menos dice sobre este producto en particular.
 *
 * La idea acá: el proceso no se explica, se REPARTE. Todo el posicionamiento de
 * Logika es cuánto trabajo NO hace el cliente, así que la línea de tiempo está
 * teñida por QUIÉN hace cada paso — amarillo lo tuyo, violeta lo nuestro — y el
 * punto donde cambia de color es el momento del traspaso, marcado explícitamente.
 *
 * El visitante entiende el argumento sin leer una palabra: dos estaciones cortas
 * de su lado, el traspaso, y todo lo demás del otro. La misma asimetría de
 * WhoDoesWhatSection, pero contada en el tiempo en vez de en el espacio.
 *
 * El paso 4 cierra con un sello, igual que "Fin de tu lista": los dos momentos en
 * que la página dice "esto ya está" usan el mismo gesto.
 */

type Duenio = "vos" | "nosotros";

interface Paso {
    n: string;
    duenio: Duenio;
    titulo: string;
    texto: string;
    icono: string;
    tiempo: string;
}

const PASOS: Paso[] = [
    {
        n: "01",
        duenio: "vos",
        titulo: "Contanos tu idea",
        texto: "Nos escribís por WhatsApp o completás el formulario. Nos contás de tu negocio y qué querés lograr.",
        icono: "chat",
        tiempo: "5 minutos",
    },
    {
        n: "02",
        duenio: "vos",
        titulo: "Mirá el diseño",
        texto: "Te mostramos un boceto de tu web. Lo revisás, decís qué cambiar, y lo ajustamos hasta que te guste.",
        icono: "visibility",
        tiempo: "Un rato",
    },
    {
        n: "03",
        duenio: "nosotros",
        titulo: "La armamos",
        texto: "Desarrollamos tu web completa. Vos seguís con tu negocio tranquilo mientras nosotros trabajamos.",
        icono: "handyman",
        tiempo: "1 a 2 semanas",
    },
    {
        n: "04",
        duenio: "nosotros",
        titulo: "Tu web online",
        texto: "Publicamos el sitio, configuramos dominio, correo y todo lo técnico. Te mostramos cómo usarlo y listo.",
        icono: "rocket_launch",
        tiempo: "El mismo día",
    },
];

const ESTILO: Record<Duenio, { chip: string; ficha: string; punto: string; icono: string; etiqueta: string }> = {
    vos: {
        chip: "bg-accent-yellow text-ink-black",
        ficha: "bg-white",
        punto: "bg-accent-yellow",
        // Negro sobre amarillo: 13.2:1
        icono: "text-ink-black",
        etiqueta: "Lo hacés vos",
    },
    nosotros: {
        chip: "bg-primary text-white",
        ficha: "bg-primary text-white",
        punto: "bg-primary",
        // Era text-ink-black: negro sobre violeta da 2.76:1 y el icono se perdia.
        // Blanco sobre el mismo violeta da 6.3:1.
        icono: "text-white",
        etiqueta: "Lo hacemos nosotros",
    },
};

export default function ProcessSection() {
    return (
        <section
            id="proceso"
            aria-labelledby="proceso-heading"
            className="relative bg-background-light border-b-2 border-black px-4 py-20 md:px-10 lg:px-20 overflow-hidden"
        >
            <div aria-hidden="true" className="absolute inset-0 pattern-dots opacity-[0.05] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <BlockReveal>
                    <h2
                        id="proceso-heading"
                        className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] max-w-3xl"
                    >
                        Dos pasos tuyos.
                        <br />
                        <span className="text-primary">Después soltá.</span>
                    </h2>
                    <p className="mt-6 text-lg md:text-xl font-medium max-w-xl text-ink-black/70">
                        Mirá de qué color son los pasos: los primeros dos te tocan a vos y duran un
                        rato. Del tercero en adelante ya no tenés que hacer nada.
                    </p>
                </BlockReveal>

                {/* La vía. En escritorio corre horizontal; en celular, vertical. */}
                <ol className="mt-16 relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-5">
                    {/* Riel de fondo: amarillo la mitad tuya, violeta la nuestra. */}
                    <li
                        aria-hidden="true"
                        className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-1.5 border-y-2 border-black pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to right, #FDE047 0%, #FDE047 50%, #8523e1 50%, #8523e1 100%)",
                        }}
                    ></li>

                    {PASOS.map((p, i) => {
                        const e = ESTILO[p.duenio];
                        const esTraspaso = i === 2;
                        const esUltimo = i === PASOS.length - 1;
                        return (
                            <li key={p.n} className="relative flex flex-col">
                                {/* Estación sobre el riel */}
                                <div className="relative flex items-center gap-3 lg:justify-center mb-5">
                                    <span
                                        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-black ${e.punto} shadow-neobrutalism-sm`}
                                    >
                                        <span aria-hidden="true" className={`material-icons text-xl ${e.icono}`}>
                                            {p.icono}
                                        </span>
                                    </span>
                                    <span className="lg:hidden font-black text-sm uppercase tracking-[0.15em] text-ink-black/60">
                                        Paso {p.n}
                                    </span>
                                </div>

                                {/* El traspaso: el único momento marcado de la secuencia. */}
                                {esTraspaso && (
                                    <span
                                        aria-hidden="true"
                                        className="hidden lg:flex absolute -left-3 top-2 z-20 items-center gap-1 bg-ink-black text-white text-[10px] font-black uppercase tracking-[0.18em] px-2 py-1 border-2 border-black rounded shadow-neobrutalism-sm -rotate-3"
                                    >
                                        Soltás acá
                                    </span>
                                )}

                                <div
                                    className={`ficha ${p.duenio === "nosotros" ? "ficha-primary" : ""} flex-1 rounded-xl p-6 pt-8 shadow-neobrutalism ${e.ficha}`}
                                >
                                    <span className={`ficha-etiqueta ${p.duenio === "nosotros" ? "text-white" : "text-ink-black"}`}>
                                        {p.n} · {e.etiqueta}
                                    </span>

                                    <h3 className="text-xl md:text-2xl font-bold leading-tight">{p.titulo}</h3>
                                    <p
                                        className={`mt-3 font-medium leading-snug ${p.duenio === "nosotros" ? "text-white/85" : "text-ink-black/70"
                                            }`}
                                    >
                                        {p.texto}
                                    </p>

                                    <p
                                        className={`mt-5 pt-4 border-t-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${p.duenio === "nosotros"
                                            ? "border-white/25 text-white/80"
                                            : "border-black/15 text-ink-black/60"
                                            }`}
                                    >
                                        <span aria-hidden="true" className="material-icons text-base">schedule</span>
                                        {p.tiempo}
                                    </p>

                                    {/* Cierre: el mismo gesto que "Fin de tu lista". */}
                                    {esUltimo && (
                                        <span className="sello sello-cae mt-5 inline-flex bg-accent-yellow text-ink-black text-[11px] shadow-neobrutalism-sm">
                                            Entregado
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>

                {/* Las tres promesas que sostienen el proceso. */}
                <ul className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icono: "schedule", t: "Entrega en 1–2 semanas", d: "Y si no cumplimos, sumamos funciones sin cargo." },
                        { icono: "support_agent", t: "Un mes de soporte", d: "Incluido, sin costo extra ni letra chica." },
                        { icono: "credit_card", t: "50% para arrancar", d: "El resto recién cuando la web está lista." },
                    ].map((b) => (
                        <li key={b.t} className="bg-white border-2 border-black rounded-xl p-5 shadow-neobrutalism-sm flex items-start gap-3">
                            <span aria-hidden="true" className="material-icons text-primary shrink-0">{b.icono}</span>
                            <span>
                                <span className="block font-bold leading-tight">{b.t}</span>
                                <span className="block mt-1 text-sm font-medium text-ink-black/70 leading-snug">{b.d}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
