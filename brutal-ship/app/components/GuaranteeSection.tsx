import BlockReveal from "./BlockReveal";

/**
 * "Si no te gusta el primer diseño, te devolvemos la seña completa" es el mejor
 * activo de conversión que tiene Logika, y vivía en letra chica dentro de una
 * tarjeta de precios. Acá se le da el momento que merece: una sola idea, a escala
 * de titular, justo antes de que la persona vea los precios.
 *
 * No inventa nada. Los tres puntos están confirmados en PRODUCT.md y escritos en
 * /terminos: alcance de la garantía, mes de soporte incluido, y cancelación libre
 * del mantenimiento. La sección no agrega compromisos, los hace legibles.
 */
export default function GuaranteeSection() {
    return (
        <section
            id="garantia"
            aria-labelledby="garantia-heading"
            className="relative bg-ink-black border-y-4 border-black px-4 py-20 md:px-10 lg:px-20 overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-4 border-white/10 pointer-events-none"
            ></div>
            <div
                aria-hidden="true"
                className="absolute -left-16 bottom-[-4rem] w-56 h-56 border-4 border-white/10 rotate-12 pointer-events-none"
            ></div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <BlockReveal>
                    <p className="sello bg-accent-yellow text-ink-black text-sm shadow-neobrutalism-sm">
                        Sin riesgo para vos
                    </p>
                    <h2
                        id="garantia-heading"
                        className="mt-7 text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-white"
                    >
                        Si no te gusta el primer diseño,
                        <br />
                        <span className="bg-accent-yellow text-ink-black px-3 inline-block mt-3 border-4 border-white shadow-neobrutalism-white">
                            no pagás nada.
                        </span>
                    </h2>
                    <p className="mt-8 text-lg md:text-xl font-medium text-white/80 max-w-2xl mx-auto">
                        Arrancás con el 50% de seña. Te mostramos cómo va a quedar tu web antes de
                        construirla. Si no te convence, te devolvemos la seña completa y ahí termina.
                    </p>
                </BlockReveal>

                {/* Antes eran tres tarjetas blancas en grilla de 3. Dos problemas: rompian
                    el negro de la seccion justo donde el titular tiene que mandar, y hacian
                    que garantia y precios llegaran con el mismo ritmo de grilla en el
                    tramo donde la persona decide.

                    Una garantia no son tres items paralelos: es una sola declaracion con
                    tres clausulas. Asi que van como banda dividida por filetes, sin cajas.
                    El titular amarillo queda solo al frente. */}
                <ul className="mt-14 flex flex-col border-y-2 border-white/20 divide-y-2 divide-white/20 text-left md:flex-row md:divide-x-2 md:divide-y-0">
                    {[
                        {
                            icono: "undo",
                            titulo: "Seña reintegrable",
                            texto: "Hasta que apruebes el diseño inicial. Después arranca el desarrollo.",
                        },
                        {
                            icono: "support_agent",
                            titulo: "Un mes de soporte",
                            texto: "Incluido en todos los planes, sin costo extra ni letra chica.",
                        },
                        {
                            icono: "lock_open",
                            titulo: "Sin permanencia",
                            texto: "El mantenimiento mensual es opcional y lo cancelás cuando quieras.",
                        },
                    ].map((item) => (
                        <li key={item.titulo} className="flex-1 py-6 md:px-7 md:first:pl-0 md:last:pr-0">
                            <span className="flex items-center gap-2.5">
                                <span aria-hidden="true" className="material-icons text-xl text-accent-yellow">
                                    {item.icono}
                                </span>
                                <span className="text-lg font-bold uppercase tracking-tight text-white">
                                    {item.titulo}
                                </span>
                            </span>
                            <p className="mt-2 font-medium leading-snug text-white/70">{item.texto}</p>
                        </li>
                    ))}
                </ul>

                <a
                    href="#precios"
                    className="mt-12 inline-flex items-center gap-2 min-h-11 bg-primary text-white border-2 border-black font-bold text-lg py-4 px-8 rounded-lg shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    Ver precios
                    <span aria-hidden="true" className="material-icons">arrow_forward</span>
                </a>
            </div>
        </section>
    );
}
