/**
 * "Si no te gusta el primer diseño, te devolvemos la seña completa" es el mejor activo
 * de conversión que tiene Logika. Tuvo su propia sección, con párrafo y un botón "Ver
 * precios" que llevaba... a la sección siguiente.
 *
 * Desde 2026-09 es la franja que abre Precios: el titular conserva la escala, y todo lo
 * demás son condiciones de una línea, pegadas al número donde aparece la duda. Es el
 * patrón de los estudios que venden paquetes fijos (Designjoy pone su "probalo una
 * semana" debajo mismo del precio). Sin botón: los precios empiezan abajo.
 *
 * Va en el amarillo de Precios y no en negro: después del portafolio, que es oscuro,
 * una franja negra se fundía con él y la garantía se leía como el final de los trabajos
 * en vez del principio de los precios. En amarillo, garantía y planes son una sola zona.
 *
 * Las condiciones juntan lo que antes estaba repartido entre esta sección y las tres
 * promesas de la ProcessSection que se eliminó. Todas salen de PRODUCT.md y /terminos,
 * MENOS "Plazo firme": esa promesa vivía solo en el proceso y no figura en /terminos.
 * Está pendiente de que el dueño confirme que es política (.impeccable/TUS-TAREAS.md).
 * Si no lo es, se borra esa entrada y listo.
 */
const CONDICIONES = [
    {
        icono: "undo",
        titulo: "Seña del 50%",
        texto: "Reintegrable hasta que apruebes el diseño. El resto, al entregar.",
    },
    {
        icono: "event_available",
        titulo: "Plazo firme",
        texto: "Si nos atrasamos, sumamos funciones sin cargo.",
    },
    {
        icono: "support_agent",
        titulo: "Un mes de soporte",
        texto: "Incluido en todos los planes.",
    },
    {
        icono: "lock_open",
        titulo: "Sin permanencia",
        texto: "El mantenimiento mensual es opcional.",
    },
];

export default function GuaranteeSection() {
    return (
        <section
            id="garantia"
            aria-labelledby="garantia-heading"
            className="relative bg-accent-yellow border-t-4 border-black px-4 pt-16 pb-6 md:px-10 lg:px-20 overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-4 border-black/10 pointer-events-none"
            ></div>

            <div className="relative z-10 max-w-6xl mx-auto text-center">
                <p className="sello bg-ink-black text-white text-sm shadow-neobrutalism-sm">
                    Sin riesgo para vos
                </p>
                <h2
                    id="garantia-heading"
                    className="mt-7 text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] text-ink-black"
                >
                    Si no te gusta el primer diseño,
                    <br />
                    <span className="bg-white text-ink-black px-3 inline-block mt-3 border-4 border-black shadow-neobrutalism">
                        no pagás nada.
                    </span>
                </h2>

                <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 border-y-2 border-black/15 py-8 text-left">
                    {CONDICIONES.map((c) => (
                        <li key={c.titulo}>
                            <span className="flex items-center gap-2">
                                <span aria-hidden="true" className="material-icons text-xl text-primary">
                                    {c.icono}
                                </span>
                                <span className="text-lg font-bold uppercase tracking-tight text-ink-black">{c.titulo}</span>
                            </span>
                            <p className="mt-1 font-medium leading-snug text-ink-black/75">{c.texto}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
