import BlockReveal from "./BlockReveal";

/**
 * El diferencial de Logika no es la estética ni el precio: es cuánto trabajo NO hace el cliente.
 * La composición tiene que argumentar eso sola.
 *
 * Versión anterior: cada tarea del cliente traía título + párrafo + chip numerado con
 * `space-y-8`. Medido a 1280px, la columna del cliente terminaba 142px MÁS ALTA que la de
 * Logika — la página pedía comparar tamaños y mostraba la pila del cliente como la mayor.
 * Ahora el cliente son cuatro líneas y Logika once en una sola columna, así que la
 * diferencia de altura va para el lado correcto. El aclarador del logo vive en una nota
 * al pie de la lista para no volver a inflar la columna.
 *
 * El encabezado tampoco puede depender de que haya columnas: en celular se apilan. Por eso
 * la bajada cuenta ítems ("Cuatro de tu lado. Once del nuestro") en vez de señalar una
 * disposición espacial que en móvil no existe.
 */

const CLIENTE = [
    "Contanos qué necesitás",
    "Pasanos tus fotos y tu logo",
    "Mirá el diseño y decinos qué cambiar",
    "Listo. Seguí atendiendo tu negocio.",
];

const LOGIKA = [
    "Diseño de la web completa",
    "Desarrollo y programación",
    "Que se vea perfecta en el celular",
    "El dominio (tunegocio.com.ar)",
    "El hosting donde vive tu web",
    "Correo con tu propio dominio",
    "El candadito verde de seguridad",
    "Redacción y carga de todos los textos",
    "Que Google la encuentre",
    "Publicarla y dejarla andando",
    "Un mes de soporte incluido",
];

export default function WhoDoesWhatSection() {
    return (
        <section
            id="quien-hace-que"
            aria-labelledby="quien-hace-que-heading"
            className="relative bg-background-light border-b-2 border-black px-4 py-20 md:px-10 lg:px-20 overflow-hidden"
        >
            <div className="absolute inset-0 pattern-dots opacity-[0.06] pointer-events-none" aria-hidden="true"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <BlockReveal>
                    <h2
                        id="quien-hace-que-heading"
                        className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] max-w-3xl"
                    >
                        Tu parte del trabajo
                        <br />
                        <span className="text-primary">entra en cuatro renglones.</span>
                    </h2>
                    <p className="mt-6 text-lg md:text-xl font-medium max-w-xl text-black/70">
                        Cuatro cosas de tu lado. Once del nuestro. Esa diferencia es el producto.
                    </p>
                </BlockReveal>

                <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                    {/* Lo que pone el cliente: cuatro líneas y se termina. */}
                    <div className="ficha lg:col-span-2 bg-white rounded-xl shadow-neobrutalism p-7 md:p-9 pt-9 md:pt-11">
                        <span className="ficha-etiqueta text-ink-black">Lo que ponés vos</span>
                        <ol className="space-y-3">
                            {CLIENTE.map((paso, i) => (
                                <li key={paso} className="flex items-start gap-3 text-lg font-bold leading-snug">
                                    <span
                                        aria-hidden="true"
                                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-accent-yellow text-sm font-black"
                                    >
                                        {i + 1}
                                    </span>
                                    {paso}
                                </li>
                            ))}
                        </ol>
                        <p className="mt-6 text-sm font-medium text-black/60">
                            ¿No tenés logo? Lo charlamos antes de arrancar.
                        </p>
                        {/* El chiste visual del sitio vivía en letra chica. Acá pasa a ser
                            el momento: la lista del cliente se CIERRA con un sello que cae
                            —el gesto de "trámite terminado"— mientras la columna de Logika
                            sigue. Es el único elemento de la página que se comporta como
                            un objeto físico, y por eso se recuerda. */}
                        <div className="mt-7 pt-6 border-t-2 border-dashed border-black/20 flex justify-center">
                            <p className="sello-cae sello bg-ink-black text-white text-xs shadow-neobrutalism">
                                Fin de tu lista
                            </p>
                        </div>
                    </div>

                    {/* Lo que hace Logika: once ítems en una sola columna. La altura es el argumento. */}
                    <div className="ficha ficha-primary lg:col-span-3 bg-primary text-white rounded-xl shadow-neobrutalism p-7 md:p-9 pt-9 md:pt-11 relative">
                        {/* El círculo va en su propia capa recortada: la ficha no puede llevar
                            overflow-hidden porque la etiqueta tiene que salirse del borde. */}
                        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border-4 border-white/20"></div>
                        </div>
                        <span className="ficha-etiqueta text-white">Lo que ponemos nosotros</span>
                        <ul className="relative space-y-3">
                            {LOGIKA.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-lg font-medium leading-snug">
                                    <span
                                        aria-hidden="true"
                                        className="material-icons shrink-0 text-secondary text-xl leading-7"
                                    >
                                        check_circle
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="relative mt-8 pt-6 border-t-2 border-white/20 text-lg font-bold">
                            Y si algo se rompe, nos llamás a nosotros. No a tres proveedores distintos.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
