import Link from "next/link";
import type { PricingPlan, SiteConfigMap } from "@/lib/types/database";
import { formatearPrecio } from "@/lib/precios";

/**
 * Tiendas, sistemas y apps para negocios que ya funcionan (dueño, 2026-11-21).
 *
 * La campaña 2 de Meta le habla a negocios establecidos que quieren crecer en
 * internet; el que entra a la web desde ese aviso tiene que encontrar qué más
 * hacemos además de la web. Va después de Precios.
 *
 * Cada producto se explica con una animación corta, no con texto: la compra en
 * la tienda, los pedidos que pasan a "Listo", la app que se abre y confirma un
 * turno, la receta que lee la IA y el asesor que responde. Arrancan al entrar en
 * pantalla, duran menos de 2 s y pasan una vez (AnimaAlVer.tsx y globals.css,
 * "LAS ESCENAS DE SISTEMAS"). Son ilustración: el producto, los horarios y los
 * valores de la receta son de ejemplo, por eso van con aria-hidden.
 *
 * Reglas del dueño:
 * - Apps solo para Android. Sistemas y apps "se cotizan", sin número.
 * - La tienda muestra el precio del plan E-commerce, leído de la base.
 * - Diseño previo gratis: sí para tiendas, no para apps ni sistemas.
 * - Las funciones con IA son las publicadas en AGB y Aliverti, con su OK. Se
 *   muestra lo que hacen; nada de prometer ventas ni horas ahorradas.
 * - El panel aparece solo atado a la tienda online.
 */

const MENSAJES = {
    tienda: "Hola! Quiero una tienda online para mi negocio.",
    sistema: "Hola! Quiero un sistema para mi negocio.",
    app: "Hola! Quiero una app para mi negocio.",
    ia: "Hola! Quiero sumar funciones con IA a mi negocio.",
};

function Flecha() {
    return <span aria-hidden="true" className="flecha material-icons">arrow_forward</span>;
}

export default function SistemasSection({ plans, config }: { plans: PricingPlan[]; config: SiteConfigMap }) {
    const tienda = plans.find((p) => p.name.startsWith("E-commerce"));
    const wa = (texto: string) => `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(texto)}`;

    return (
        <section id="sistemas" aria-labelledby="sistemas-heading" className="relative bg-white border-b-2 border-black px-4 py-20 md:px-10 lg:px-20 overflow-clip">
            <div className="max-w-6xl mx-auto">
                <div className="text-center">
                    <h2 id="sistemas-heading" className="titular-seccion text-ink-black">
                        Más que una web:
                        <br />
                        <span className="marcador text-primary">tiendas, sistemas y apps</span>
                    </h2>
                    <p className="mt-5 text-lg font-medium text-ink-black/80">Para negocios que ya funcionan y quieren crecer en internet.</p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <article className="flex flex-col rounded-xl border-4 border-black bg-mint p-6 shadow-neobrutalism-lg">
                        <h3 className="text-2xl font-bold uppercase tracking-tight text-ink-black">Tienda online</h3>
                        <p className="mt-2 font-medium leading-snug text-ink-black/85">Te compran y el pedido llega a tu panel.</p>
                        <div className="my-7 flex flex-1 items-center">
                            <EscenaTienda />
                        </div>
                        <p className="font-display text-lg font-bold text-ink-black">
                            {tienda ? `Desde ${formatearPrecio(tienda.price, tienda.currency)}` : "Precio en Precios"}
                            <span className="block text-sm font-medium text-ink-black/75">Antes de pagar, la ves.</span>
                        </p>
                        <a href={wa(MENSAJES.tienda)} target="_blank" rel="noopener noreferrer" className="boton boton-primario mt-4 self-start">
                            Quiero mi tienda
                            <Flecha />
                        </a>
                    </article>

                    <article className="flex flex-col rounded-xl border-4 border-black bg-accent-yellow p-6 shadow-neobrutalism-lg">
                        <h3 className="text-2xl font-bold uppercase tracking-tight text-ink-black">Sistema</h3>
                        <p className="mt-2 font-medium leading-snug text-ink-black/85">Pedidos, stock y turnos en un solo lugar.</p>
                        <div className="my-7 flex flex-1 items-center">
                            <EscenaSistema />
                        </div>
                        <p className="font-display text-lg font-bold text-ink-black">Se cotiza</p>
                        <a href={wa(MENSAJES.sistema)} target="_blank" rel="noopener noreferrer" className="boton boton-secundario mt-4 self-start">
                            Quiero un sistema
                            <Flecha />
                        </a>
                    </article>

                    <article className="flex flex-col rounded-xl border-4 border-black bg-hot-coral p-6 shadow-neobrutalism-lg">
                        <h3 className="text-2xl font-bold uppercase tracking-tight text-ink-black">App Android</h3>
                        <p className="mt-2 font-medium leading-snug text-ink-black">Tu negocio en el celular de tus clientes.</p>
                        <div className="my-7 flex flex-1 items-center">
                            <EscenaApp />
                        </div>
                        <p className="font-display text-lg font-bold text-ink-black">Se cotiza</p>
                        <a href={wa(MENSAJES.app)} target="_blank" rel="noopener noreferrer" className="boton boton-secundario mt-4 self-start">
                            Quiero mi app
                            <Flecha />
                        </a>
                    </article>
                </div>

                {/* IA: dos casos reales, publicados, con el OK de cada cliente. */}
                <div className="mt-8 grid grid-cols-1 items-center gap-8 rounded-xl border-4 border-black bg-ink-black p-6 text-white shadow-neobrutalism-primary sm:p-8 lg:grid-cols-[1fr_1fr_auto]">
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight">
                            Con <span className="text-accent-yellow">inteligencia artificial</span>
                        </h3>
                        <a href={wa(MENSAJES.ia)} target="_blank" rel="noopener noreferrer" className="boton boton-amarillo boton-sobre-oscuro mt-5">
                            Quiero sumar IA
                            <Flecha />
                        </a>
                    </div>
                    <div>
                        <EscenaReceta />
                        <p className="mt-3 text-sm font-medium text-white/85">
                            <Link href="/portafolio/optica-agb" className="font-display font-bold text-accent-yellow underline underline-offset-4 hover:no-underline">Óptica AGB</Link>: lee la receta desde una foto.
                        </p>
                    </div>
                    <div className="lg:w-72">
                        <EscenaChat />
                        <p className="mt-3 text-sm font-medium text-white/85">
                            <Link href="/portafolio/aliverti" className="font-display font-bold text-accent-yellow underline underline-offset-4 hover:no-underline">Aliverti</Link>: un asesor que ayuda a elegir.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- Escenas: cada una cuenta una acción en menos de 2 s ---------- */

function EscenaTienda() {
    return (
        <div aria-hidden="true" data-anima="escena" className="escena relative mx-auto w-full max-w-xs pb-8">
            <div className="overflow-clip rounded-xl border-4 border-black bg-white shadow-neobrutalism">
                <div className="flex items-center justify-between border-b-2 border-black bg-background-light px-3 py-2">
                    <span className="font-display text-xs font-bold text-ink-black/70">tunegocio.com.ar</span>
                    <span className="relative inline-flex">
                        <span className="material-icons text-2xl text-ink-black">shopping_cart</span>
                        <span className="anima t-cuenta absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-primary font-display text-xs font-bold text-white">1</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 p-3">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-accent-yellow">
                        <span className="material-icons text-4xl text-ink-black">backpack</span>
                    </span>
                    <span className="flex-1">
                        <span className="block font-display font-bold leading-tight text-ink-black">Mochila</span>
                        <span className="anima t-boton mt-2 grid rounded-md border-2 border-black bg-primary shadow-neobrutalism-sm px-2 py-1.5 text-center font-display text-xs font-bold uppercase text-white">
                            <span className="anima t-sale col-start-1 row-start-1">Comprar</span>
                            <span className="anima t-entra col-start-1 row-start-1 inline-flex items-center justify-center gap-1">
                                <span className="material-icons text-sm">check</span>
                                Listo
                            </span>
                        </span>
                    </span>
                </div>
            </div>
            {/* El sello va envuelto: `.sello` fija position: relative y le gana a absolute. */}
            <div className="absolute -right-2 top-12">
                <span className="anima t-pago sello bg-white text-xs text-ink-black">Pagado</span>
            </div>
            <div className="anima t-aviso absolute bottom-0 left-3 right-3 flex items-center gap-2 rounded-lg border-2 border-black bg-ink-black px-3 py-2 text-white shadow-neobrutalism-sm">
                <span className="material-icons text-lg text-accent-yellow">notifications</span>
                <span className="font-display text-xs font-bold">Nuevo pedido en tu panel</span>
            </div>
        </div>
    );
}

const PEDIDOS = [
    { canal: "WhatsApp", icono: "chat" },
    { canal: "Mostrador", icono: "storefront" },
    { canal: "Tienda", icono: "shopping_cart" },
];

function EscenaSistema() {
    return (
        <div aria-hidden="true" data-anima="escena" className="escena w-full overflow-clip rounded-xl border-4 border-black bg-white shadow-neobrutalism">
            <div className="border-b-2 border-black bg-ink-black px-3 py-2 font-display text-xs font-bold uppercase text-white">Pedidos de hoy</div>
            <ul className="divide-y-2 divide-black/10">
                {PEDIDOS.map((p, i) => (
                    <li key={p.canal} className={`s-fila-${i + 1} flex items-center gap-2.5 px-3 py-2.5`}>
                        <span className="material-icons text-xl text-ink-black">{p.icono}</span>
                        <span className="flex-1 font-display text-sm font-bold text-ink-black">{p.canal}</span>
                        <span className="grid">
                            <span className="anima s-nuevo col-start-1 row-start-1 rounded-md border-2 border-black bg-accent-yellow px-2 py-0.5 text-center font-display text-xs font-bold uppercase text-ink-black">Nuevo</span>
                            <span className="anima s-listo col-start-1 row-start-1 inline-flex items-center justify-center gap-0.5 rounded-md border-2 border-black bg-secondary px-2 py-0.5 font-display text-xs font-bold uppercase text-ink-black">
                                <span className="material-icons text-sm">check</span>
                                Listo
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function EscenaApp() {
    return (
        <div aria-hidden="true" data-anima="escena" className="escena mx-auto w-40">
            <div className="rounded-[1.9rem] border-4 border-black bg-ink-black p-1.5 shadow-neobrutalism-lg">
                <div className="relative aspect-[9/16] overflow-clip rounded-[1.5rem] bg-background-light">
                    <div className="grid grid-cols-3 gap-2.5 p-3 pt-6">
                        {Array.from({ length: 9 }, (_, i) =>
                            i === 4 ? (
                                <span key={i} className="anima a-icono flex aspect-square items-center justify-center rounded-lg border-2 border-black bg-primary">
                                    <span className="material-icons text-xl text-white">storefront</span>
                                </span>
                            ) : (
                                <span key={i} className="aspect-square rounded-lg border-2 border-black/25 bg-white" />
                            ),
                        )}
                    </div>
                    <div className="anima a-pantalla absolute inset-0 flex flex-col bg-white">
                        <div className="border-b-2 border-black bg-primary px-3 pb-2 pt-5 font-display text-xs font-bold uppercase text-white">Tu negocio</div>
                        <div className="flex flex-1 flex-col gap-2 p-2.5">
                            <span className="font-display text-xs font-bold text-ink-black">Elegí tu turno</span>
                            <div className="grid grid-cols-2 gap-1.5">
                                {["10:00", "10:30", "11:00", "11:30"].map((h) => (
                                    <span
                                        key={h}
                                        className={`rounded-md border-2 border-black py-0.5 text-center font-display text-xs font-bold ${h === "10:30" ? "anima a-hora bg-primary text-white" : "bg-white text-ink-black"}`}
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-auto flex justify-center pb-2">
                                <span className="anima a-sello sello bg-white text-xs text-ink-black">Listo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EscenaReceta() {
    return (
        <div aria-hidden="true" data-anima="escena" className="escena flex items-center gap-3">
            <div className="relative w-36 shrink-0 overflow-clip rounded-lg border-4 border-black bg-white p-3 shadow-neobrutalism-white">
                <span className="flex items-center justify-between font-display text-xs font-bold uppercase text-ink-black">
                    Receta
                    <span className="material-icons text-lg text-primary">photo_camera</span>
                </span>
                <span className="mt-2 block space-y-2">
                    <span className="block h-2 w-11/12 rounded-full bg-ink-black/20" />
                    <span className="block h-2 w-8/12 rounded-full bg-ink-black/20" />
                    <span className="block h-2 w-10/12 rounded-full bg-ink-black/20" />
                </span>
                <span className="anima r-scan pointer-events-none absolute inset-0">
                    <span className="block h-1 w-full bg-secondary shadow-[0_2px_0_#1A1A1A]" />
                </span>
            </div>
            <span className="flex flex-col gap-2">
                <span className="anima r-dato r-dato-1 rounded-md border-2 border-black bg-mint px-2 py-0.5 font-display text-xs font-bold text-ink-black">OD −1,25</span>
                <span className="anima r-dato r-dato-2 rounded-md border-2 border-black bg-mint px-2 py-0.5 font-display text-xs font-bold text-ink-black">OI −1,00</span>
            </span>
        </div>
    );
}

function EscenaChat() {
    return (
        <div aria-hidden="true" data-anima="escena" className="escena flex flex-col gap-2">
            <p className="anima c-pregunta self-end rounded-2xl rounded-br-sm border-2 border-black bg-white px-3 py-2 text-sm font-medium leading-snug text-ink-black">
                ¿Qué arnés me sirve?
            </p>
            <span className="anima c-escribe flex gap-1 self-start rounded-2xl border-2 border-black bg-mint px-3 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-black" />
                <span className="h-1.5 w-1.5 rounded-full bg-ink-black" />
                <span className="h-1.5 w-1.5 rounded-full bg-ink-black" />
            </span>
            <p className="anima c-respuesta self-start rounded-2xl rounded-bl-sm border-2 border-black bg-mint px-3 py-2 text-sm font-medium leading-snug text-ink-black">
                Este kit: arnés, cabo y mosquetón.
            </p>
        </div>
    );
}
