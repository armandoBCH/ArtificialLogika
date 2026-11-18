import type { ReactNode } from "react";
import MagneticWrapper from "./MagneticWrapper";

/**
 * Hasta el 2026-11-06 la columna derecha era una maqueta animada: una web inventada
 * ("www.tunegocio.com") que se armaba sola en loop de 6s. Era lo más genérico de la
 * página, ocupaba el lugar donde la persona se pregunta "¿son reales?" y, como se movía
 * sin parar y sin pausa, incumplía WCAG 2.2.2. El dueño eligió, entre tres opciones
 * probadas en el sitio, mostrar trabajo real: `children` es <HeroTrabajos /> (page.tsx).
 *
 * Nada del hero se mueve en loop. Solo entra el titular, una vez.
 */
export default function HeroSection({ children }: { children?: ReactNode }) {
    // El titular dice el diferencial (lo que el cliente NO hace), no "Tu web profesional.":
    // sale de BRAND_CORE.md. El dueño lo eligió el 2026-11-17 y ese mismo día lo acortó:
    // "Vos atendé tu negocio. La web la hacemos nosotros." era largo para leer de un golpe.
    // Anima con keyframes CSS, no con framer-motion, para que el HTML del servidor ya llegue
    // con el texto pintado. Entra palabra por palabra detrás de una máscara (motion.md).
    const linea1 = ["Vos", "atendé."];
    const linea2 = ["Nosotros,", "la", "web."];
    // toFixed(2) y no la suma cruda: en punto flotante quedan decimales colgando, y ese
    // string termina en el HTML del servidor.
    const retraso = (index: number) => ({ animationDelay: `${(0.1 + index * 0.07).toFixed(2)}s` });
    const palabras = (lista: string[], desde: number) =>
        lista.map((p, i) => (
            <span key={p + i}>
                {/* Aire arriba y abajo dentro de la máscara: en mayúsculas la tilde de "ATENDÉ"
                    sube más que la altura de línea y se cortaba. */}
                <span className="inline-block overflow-hidden pt-[0.15em] -mt-[0.15em] pb-[0.1em] -mb-[0.1em] align-bottom">
                    <span style={retraso(desde + i)} className="hero-letter inline-block">{p}</span>
                </span>
                {i < lista.length - 1 && " "}
            </span>
        ));

    return (
        // pt-28 en celular: con pt-36 quedaban ~75px vacíos entre el menú flotante y el titular.
        <header className="relative overflow-hidden bg-background-light pt-28 sm:pt-32 lg:pt-36 pb-24 border-b-2 border-black">
            {/* Había además un cuadrado amarillo abajo a la izquierda: a 1024px tapaba la
                línea "Diseño previo y presupuesto sin cargo", que es la que más tranquiliza.
                El círculo queda quieto: antes latía y se desplazaba con el scroll. */}
            <div aria-hidden="true" className="absolute top-20 right-[-50px] w-64 h-64 bg-mint rounded-full border-2 border-black mix-blend-multiply opacity-80 hidden lg:block z-0"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h1
                            aria-label="Vos atendé. Nosotros, la web."
                            className="text-[clamp(2.75rem,13vw,5rem)] lg:text-[clamp(3.5rem,6.6vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.02em] uppercase"
                        >
                            <span aria-hidden="true" className="block">
                                {palabras(linea1, 0)}
                            </span>
                            {/* El marcador amarillo pasa una vez, cuando ya cayeron las palabras, y
                                subraya la mitad que es la promesa. Es el mismo gesto que los titulares
                                de cada sección (globals.css, "MARCADOR"). */}
                            <span aria-hidden="true" className="mt-1 block">
                                <span className="marcador marcador-entra text-primary text-stroke">
                                    {palabras(linea2, linea1.length)}
                                </span>
                            </span>
                        </h1>
                        {/* "o renovamos la que ya tenés" es lo que quedó de la sección "¿Tu web es
                            vieja?". El "nosotros nos encargamos de todo" ya lo dice el titular: la
                            bajada cuenta qué es ese "todo", en palabras del dueño de un negocio. */}
                        <p className="text-xl md:text-2xl font-medium py-2 max-w-lg">
                            Diseñamos tu página web, o renovamos la que ya tenés, y nos ocupamos de todo lo técnico: el dominio, el correo, el candadito de seguridad y que Google la encuentre.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-4">
                            <MagneticWrapper>
                                <a href="#contacto" className="boton boton-primario w-full sm:w-auto text-lg py-4 px-8">
                                    Quiero mi web
                                    <span aria-hidden="true" className="flecha material-icons">arrow_forward</span>
                                </a>
                            </MagneticWrapper>
                            {/* La oferta vivía en una banda propia debajo del hero: en un celular de
                                812px quedaba a 1.039px, fuera de la primera pantalla. Vuelve acá como
                                una línea de apoyo y no como chip, que era lo que competía con el botón.
                                En celular va pegada al botón; desde sm pasa a su propia fila. */}
                            <p className="text-center text-sm font-medium text-ink-black/75 sm:order-last sm:basis-full sm:text-left sm:text-base">
                                <span aria-hidden="true" className="material-icons mr-1 align-[-4px] text-lg text-primary">verified</span>
                                Diseño previo y presupuesto sin cargo. Lo ves antes de pagar nada.
                            </p>
                            {/* Lleva más abajo en la misma página: flecha hacia abajo, no el ícono de
                                "abre otra pestaña" que tenía. */}
                            <a href="#portafolio" className="md:hidden flex min-h-11 items-center justify-center gap-2 text-black font-bold text-lg mt-2 underline decoration-2 underline-offset-4">
                                Ver nuestro trabajo
                                <span aria-hidden="true" className="material-icons text-lg">arrow_downward</span>
                            </a>
                            <a href="#portafolio" className="hidden md:inline-flex boton boton-secundario text-lg py-4 px-8">
                                Ver nuestro trabajo
                            </a>
                        </div>
                    </div>
                    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </header>
    );
}
