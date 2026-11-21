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
 *
 * Desde 2026-09 es la única sección de "Cómo funciona". Hubo además una ProcessSection
 * con la misma asimetría contada como línea de tiempo, y la página explicaba el proceso
 * tres veces seguidas antes de mostrar un solo trabajo. De esa sección queda lo único que
 * esta no decía: cuánto tarda cada parte (la línea del reloj, al pie). Sus tres promesas
 * pasaron a la franja de garantía, pegada a los precios.
 */

const CLIENTE = [
    "Contanos qué necesitás",
    "Pasanos tus fotos y tu logo",
    "Mirá el diseño y decinos qué cambiar",
    "Listo. Seguí atendiendo tu negocio.",
];

// La pregunta que se hace quien duda: "¿y si la hago yo?". Una tabla y no un párrafo:
// se lee de un vistazo, fila por fila. Nada exagerado sobre las plantillas (traen el
// candadito y tienen soporte propio) y nada que /terminos no sostenga: el soporte
// incluido es un mes (§2) y el alojamiento sigue después con el mensual o por tu cuenta (§9).
const COMPARACION: [string, string, string][] = [
    ["Quién la arma", "Vos, de a ratos", "Nosotros"],
    ["Los textos", "Los escribís vos", "Los escribimos nosotros"],
    ["Dominio y correo", "Los contratás y configurás vos", "Por nuestra cuenta"],
    ["Si algo se rompe", "Te arreglás con el soporte de la plataforma", "Nos escribís: el primer mes va incluido, después con el mensual"],
    // Cortas a propósito: a 375px una palabra larga ("mantenimiento") no entraba en la columna.
    ["Cómo se paga", "Un plan todos los meses", "La web, una sola vez; el alojamiento, aparte"],
    ["Antes de pagar", "La armás y recién ahí la ves", "Ves el diseño previo, gratis"],
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
            id="como-funciona"
            aria-labelledby="como-funciona-heading"
            // overflow-clip y no overflow-hidden: `hidden` vuelve a la sección una caja con scroll
            // propio, y las animaciones atadas al scroll (el sello, las tildes, el marcador) miraban
            // esa caja quieta en vez de la página. Recorta igual.
            className="relative bg-background-light border-b-2 border-black px-4 py-20 md:px-10 lg:px-20 overflow-clip"
        >
            {/* Anclas de antes: #quien-hace-que era el id de esta sección y #proceso el de la
                que se fundió acá. Un link guardado o compartido sigue cayendo en su lugar. */}
            <span id="quien-hace-que" aria-hidden="true" className="absolute top-0"></span>
            <span id="proceso" aria-hidden="true" className="absolute top-0"></span>
            <div className="absolute inset-0 patron-puntos pointer-events-none" aria-hidden="true"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Hasta 2026-11-17 el titular salía de atrás de una cortina violeta (BlockReveal).
                    Competía con el marcador: los dos querían ser la entrada del titular, y la cortina
                    lo tapaba mientras se pintaba. Quedó el marcador, que además dice cuál es la idea. */}
                <h2
                    id="como-funciona-heading"
                    className="titular-seccion max-w-3xl"
                >
                    Tu parte del trabajo
                    <br />
                    <span className="marcador text-primary">entra en cuatro renglones.</span>
                </h2>
                <p className="mt-6 text-lg md:text-xl font-medium max-w-xl text-black/70">
                    Cuatro cosas de tu lado. Once del nuestro. Esa diferencia es el producto.
                </p>

                <div data-anima="como-funciona" className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                    {/* Lo que pone el cliente: cuatro líneas y se termina. */}
                    <div className="ficha lg:col-span-2 bg-white rounded-xl shadow-neobrutalism p-7 md:p-9 pt-9 md:pt-11">
                        <span className="ficha-etiqueta text-ink-black">Lo que ponés vos</span>
                        <ol className="space-y-3">
                            {CLIENTE.map((paso, i) => (
                                <li key={paso} className="flex items-start gap-3 text-lg font-bold leading-snug">
                                    <span
                                        aria-hidden="true"
                                        className="numero-cae shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-accent-yellow text-sm font-black"
                                        style={{ "--i": i } as React.CSSProperties}
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
                        {/* Las tildes se marcan en fila cuando la lista entra en pantalla (globals.css,
                            "ANIMA AL VER"). El texto no se mueve: se lee desde el primer momento. */}
                        <ul className="relative space-y-3">
                            {LOGIKA.map((item, i) => (
                                <li key={item} className="flex items-start gap-2.5 text-lg font-medium leading-snug">
                                    <span
                                        aria-hidden="true"
                                        className="tilde-cae material-icons shrink-0 text-secondary text-xl leading-7"
                                        style={{ "--i": i } as React.CSSProperties}
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

                {/* Los tiempos que traía la línea de tiempo del proceso, en una sola línea.
                    "De 1 a 4 semanas" y no "1 a 2": la landing tarda 1–2 y el sitio o la
                    tienda 2–4, que es lo que dice la pregunta frecuente de plazos. */}
                <p className="mt-10 flex items-start gap-3 max-w-3xl text-lg font-medium leading-snug text-ink-black/80">
                    <span aria-hidden="true" className="material-icons shrink-0 text-2xl leading-6 text-primary">schedule</span>
                    <span>
                        <strong className="font-bold text-ink-black">Tu parte:</strong> 5 minutos para contarnos y un rato para
                        mirar el diseño. <strong className="font-bold text-ink-black">La nuestra:</strong> de 1 a 4 semanas según
                        el plan, hasta dejar tu web online.
                    </span>
                </p>

                <div className="mt-14">
                    <h3 className="text-2xl font-bold uppercase tracking-[-0.01em] md:text-3xl">
                        ¿Y si la hago yo con una plantilla?
                    </h3>
                    <div className="mt-6 overflow-hidden rounded-xl border-2 border-black bg-white shadow-neobrutalism">
                        <table className="w-full table-fixed text-left text-sm sm:text-base">
                            <caption className="sr-only">Hacer la web con una plantilla o con Logika</caption>
                            <colgroup>
                                <col className="w-[30%]" />
                                <col className="w-[35%]" />
                                <col className="w-[35%]" />
                            </colgroup>
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th scope="col" className="p-3 sm:p-4"><span className="sr-only">Tema</span></th>
                                    <th scope="col" className="etiqueta p-3 align-bottom text-ink-black/75 sm:p-4">Con una plantilla</th>
                                    <th scope="col" className="etiqueta bg-primary p-3 align-bottom text-white sm:p-4">Con Logika</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black/10">
                                {COMPARACION.map(([tema, plantilla, logika]) => (
                                    <tr key={tema}>
                                        <th scope="row" className="p-3 align-top font-bold leading-snug sm:p-4">{tema}</th>
                                        <td className="p-3 align-top leading-snug text-ink-black/80 sm:p-4">
                                            <span className="flex items-start gap-1.5">
                                                <span aria-hidden="true" className="material-icons mt-px shrink-0 text-base text-ink-black/50 sm:text-lg">close</span>
                                                {plantilla}
                                            </span>
                                        </td>
                                        <td className="bg-primary/10 p-3 align-top font-bold leading-snug sm:p-4">
                                            <span className="flex items-start gap-1.5">
                                                <span aria-hidden="true" className="material-icons mt-px shrink-0 text-base text-primary sm:text-lg">check_circle</span>
                                                {logika}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
