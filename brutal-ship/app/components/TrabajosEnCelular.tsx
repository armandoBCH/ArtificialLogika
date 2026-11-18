import Image from "next/image";
import type { PortfolioProject } from "@/lib/types/database";
import { esMuestra } from "@/lib/data/portfolio";
import { CAPTURAS_CELULAR } from "@/lib/data/capturas-celular";

/**
 * Las webs reales de los clientes tal como abren en un teléfono, que es donde las mira
 * quien llega. Va dentro de "Nuestro trabajo": las tarjetas muestran la captura de
 * computadora; esta tira, la del celular, con el enlace a la web publicada.
 *
 * Solo clientes reales con web publicada y captura cargada (lib/data/capturas-celular.ts).
 * Sin cifras: no hay un dato medido de cuántos entran desde el celular.
 */
export default function TrabajosEnCelular({ projects }: { projects: PortfolioProject[] }) {
    const webs = projects.filter((p) => !esMuestra(p) && p.external_url && CAPTURAS_CELULAR[p.id]);
    if (webs.length === 0) return null;

    return (
        <div className="mt-12 md:mt-16">
            <h3 className="text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">
                Y así se ven en el celular
            </h3>
            <p className="mt-2 max-w-xl text-base font-medium text-white/75 md:text-lg">
                Las webs de nuestros clientes, tal como abren en un teléfono. Tocá una para verla publicada.
            </p>
            {/* Se desliza de costado en celular. Es una zona con scroll: lleva tabIndex y nombre
                para que se pueda mover con el teclado. El pt-2 es aire para el teléfono que se
                levanta al pasar el mouse: la zona con scroll también recorta arriba. */}
            <ul
                role="list"
                tabIndex={0}
                aria-label="Webs de clientes vistas en un celular"
                className="-mx-4 mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pt-2 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-6 lg:overflow-visible lg:px-0"
            >
                {webs.map((p) => (
                    // `relative`: el texto para lectores de pantalla (sr-only) es absoluto. Sin un
                    // ancestro posicionado se ubicaba respecto de la sección, escapaba del scroll de
                    // la tira y estiraba la página a 917px en celular.
                    <li key={p.id} className="relative w-40 shrink-0 snap-start sm:w-44 lg:w-auto">
                        <a
                            href={p.external_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                        >
                            {/* Al pasar el mouse el teléfono se levanta y se inclina apenas, como
                                quien lo agarra de la mesa; al tocarlo vuelve a apoyarse. */}
                            <span className="block rounded-[1.6rem] border-2 border-white bg-black p-1.5 shadow-neobrutalism-white transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:-rotate-2 group-active:translate-y-0 group-active:rotate-0">
                                <span className="relative block aspect-[375/812] overflow-hidden rounded-[1.15rem] bg-background-light">
                                    <Image
                                        src={CAPTURAS_CELULAR[p.id]}
                                        alt=""
                                        fill
                                        sizes="(max-width: 1023px) 176px, 190px"
                                        className="object-cover object-top"
                                    />
                                </span>
                            </span>
                            <span className="mt-3 block font-bold leading-tight text-white">{p.title}</span>
                            <span className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-accent-yellow underline decoration-2 underline-offset-4 group-hover:text-white">
                                Ver la web
                                <span aria-hidden="true" className="material-icons text-base">open_in_new</span>
                                <span className="sr-only">(se abre en otra pestaña)</span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
