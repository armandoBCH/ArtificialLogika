import Image from "next/image";
import type { PortfolioProject } from "@/lib/types/database";
import { esMuestra } from "@/lib/data/portfolio";
import CarruselCelular from "./CarruselCelular";

/** Hasta esta cantidad entran todas a la vista en computadora (grilla de 6); más, carrusel. */
const ENTRAN_EN_GRILLA = 6;

/**
 * Las webs tal como abren en un teléfono, que es donde las mira quien llega. Va dentro de
 * "Nuestro trabajo": las tarjetas muestran la captura de computadora; esta tira, la del
 * celular, con el enlace a la web publicada.
 *
 * Entra solo todo proyecto activo con web publicada y captura de celular cargada en el
 * panel (`image_url_mobile`). Primero los clientes reales; después los diseños previos,
 * con el sello "Muestra" para que nadie los tome por clientes.
 * Sin cifras: no hay un dato medido de cuántos entran desde el celular.
 */
export default function TrabajosEnCelular({ projects }: { projects: PortfolioProject[] }) {
    const webs = projects
        .filter((p) => p.external_url && p.image_url_mobile)
        .sort((a, b) => Number(esMuestra(a)) - Number(esMuestra(b)));
    if (webs.length === 0) return null;
    const hayMuestras = webs.some((p) => esMuestra(p));
    const carrusel = webs.length > ENTRAN_EN_GRILLA;

    return (
        <div className="mt-12 md:mt-16">
            <h3 className="text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">
                Y así se ven en el celular
            </h3>
            <p className="mt-2 max-w-xl text-base font-medium text-white/75 md:text-lg">
                {hayMuestras
                    ? "Las webs que hicimos, tal como abren en un teléfono. Las que dicen Muestra son diseños previos. Tocá una para verla publicada."
                    : "Las webs de nuestros clientes, tal como abren en un teléfono. Tocá una para verla publicada."}
            </p>
            <CarruselCelular carrusel={carrusel} etiqueta="Webs vistas en un celular">
                {webs.map((p) => (
                    // `relative`: el texto para lectores de pantalla (sr-only) es absoluto. Sin un
                    // ancestro posicionado se ubicaba respecto de la sección, escapaba del scroll de
                    // la tira y estiraba la página a 917px en celular.
                    <li
                        key={p.id}
                        className={`relative w-40 shrink-0 snap-start sm:w-44 ${carrusel ? "lg:w-[calc((100%-7.5rem)/6)]" : "lg:w-auto"}`}
                    >
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
                                        src={p.image_url_mobile!}
                                        alt=""
                                        fill
                                        sizes="(max-width: 1023px) 176px, 190px"
                                        className="object-cover object-top"
                                    />
                                    {esMuestra(p) && (
                                        <span className="sello absolute left-2 top-2 z-[1] bg-accent-yellow text-ink-black text-xs shadow-neobrutalism-sm">
                                            Muestra
                                        </span>
                                    )}
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
            </CarruselCelular>
        </div>
    );
}
