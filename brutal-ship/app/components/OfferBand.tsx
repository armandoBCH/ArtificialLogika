/**
 * "Mockup y presupuesto sin cargo" vivía adentro del hero, como un chip rotado
 * debajo de los botones. Ahí hacía dos cosas mal: era un cuarto elemento apilado
 * en la columna donde la persona tiene que leer una idea y apretar un botón, y
 * competía por atención justo con el CTA principal.
 *
 * Es la mejor oferta de la página, así que en vez de achicarla se le da su propia
 * banda a ancho completo. Gana peso y el hero baja a tres elementos.
 *
 * Es una banda, no un segundo marquee: verde, quieta, centrada. El marquee que
 * viene abajo es negro y se mueve. Se leen como dos cosas distintas.
 */
export default function OfferBand() {
    return (
        <aside
            aria-label="Oferta sin cargo"
            className="border-b-4 border-black bg-secondary px-4 py-3 text-ink-black sm:py-4"
        >
            {/* En un telefono de 320px las tres partes envolvian en tres lineas y la
                banda se comia 152px, el 21% de la pantalla. La aclaracion aparece
                recien desde sm, donde hay ancho para que entre en la misma linea. */}
            <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center">
                <span aria-hidden="true" className="material-icons text-lg leading-none sm:text-xl">
                    verified
                </span>
                <span className="text-sm font-black uppercase tracking-wide sm:text-lg">
                    Mockup y presupuesto sin cargo
                </span>
                <span className="hidden text-sm font-bold text-ink-black/70 sm:inline">
                    Sin compromiso, y lo ves antes de pagar nada.
                </span>
            </p>
        </aside>
    );
}
