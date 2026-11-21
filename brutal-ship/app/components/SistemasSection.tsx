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
 * Cada producto muestra su acción en una escena dibujada con la estética del sitio
 * (bordes negros, sombra dura, ficha y sello): la compra en la tienda, los pedidos
 * que pasan a "Listo" en el sistema, la app que se abre y confirma un turno, la
 * receta que la IA lee y el asesor que responde. Las escenas van atadas al scroll
 * (globals.css, "LAS ESCENAS DE SISTEMAS"): pasan una vez mientras bajás, nada se
 * mueve solo, y sin soporte o con "reducir movimiento" quedan en su estado final.
 * Son ilustración: los productos, horarios y valores de receta son de ejemplo, por
 * eso van con aria-hidden y el texto de al lado dice lo mismo.
 *
 * Reglas del dueño:
 * - Apps solo para Android.
 * - Sistemas y apps "se cotizan", sin número. La tienda muestra el precio del plan
 *   E-commerce, leído de la base para que no quede viejo.
 * - Diseño previo gratis: sí para tiendas, no para apps ni sistemas.
 * - Las funciones con IA son las que ya están publicadas en AGB y Aliverti, con su
 *   OK. Se muestra lo que hacen; nada de prometer ventas ni horas ahorradas.
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
                    <p className="mt-6 mx-auto max-w-2xl text-lg font-medium leading-snug text-ink-black/80">
                        Para negocios que ya funcionan y quieren crecer en internet. Lo armamos para cómo trabajás y, donde sirve, le sumamos inteligencia artificial.
                    </p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Tienda: el producto de más valor, a lo ancho. */}
                    <article className="grid grid-cols-1 items-center gap-10 rounded-xl border-4 border-black bg-mint p-6 shadow-neobrutalism-lg sm:p-10 lg:col-span-2 lg:grid-cols-[1fr_1.1fr]">
                        <div>
                            <h3 className="text-3xl font-bold uppercase tracking-tight text-ink-black sm:text-4xl">Tienda online</h3>
                            <p className="mt-3 max-w-md text-lg font-medium leading-snug text-ink-black/85">
                                Tus clientes eligen, pagan y el pedido te aparece en tu panel. Sin anotar nada en un cuaderno.
                            </p>
                            <p className="mt-6 inline-block rounded-md border-2 border-black bg-white px-3 py-1.5 font-display text-xl font-bold text-ink-black shadow-neobrutalism-sm">
                                {tienda ? `Desde ${formatearPrecio(tienda.price, tienda.currency)}` : "Precio en Precios"}
                            </p>
                            <p className="mt-3 font-medium text-ink-black/80">Antes de pagar, te mostramos cómo quedaría.</p>
                            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                                <a href={wa(MENSAJES.tienda)} target="_blank" rel="noopener noreferrer" className="boton boton-primario">
                                    Quiero mi tienda
                                    <Flecha />
                                </a>
                                <Link href="/portafolio/optica-agb" className="font-display font-bold text-ink-black underline underline-offset-4 hover:no-underline">
                                    Ver la tienda de Óptica AGB
                                </Link>
                            </div>
                        </div>
                        <EscenaTienda />
                    </article>

                    <article className="flex flex-col rounded-xl border-4 border-black bg-accent-yellow p-6 shadow-neobrutalism-lg sm:p-8">
                        <h3 className="text-3xl font-bold uppercase tracking-tight text-ink-black">Sistema para tu negocio</h3>
                        <p className="mt-3 text-lg font-medium leading-snug text-ink-black/85">
                            Pedidos, stock, turnos o clientes en un solo lugar, armado para cómo trabajás.
                        </p>
                        <div className="my-8 flex flex-1 items-center">
                            <EscenaSistema />
                        </div>
                        <p className="font-display font-bold text-ink-black">Se cotiza según lo que necesites.</p>
                        <a href={wa(MENSAJES.sistema)} target="_blank" rel="noopener noreferrer" className="boton boton-secundario mt-5 self-start">
                            Quiero un sistema
                            <Flecha />
                        </a>
                    </article>

                    <article className="flex flex-col rounded-xl border-4 border-black bg-hot-coral p-6 shadow-neobrutalism-lg sm:p-8">
                        <h3 className="text-3xl font-bold uppercase tracking-tight text-ink-black">App para Android</h3>
                        <p className="mt-3 text-lg font-medium leading-snug text-ink-black">
                            Tus clientes piden, reservan o miran tu catálogo desde una app con tu nombre.
                        </p>
                        <div className="my-8 flex-1">
                            <EscenaApp />
                        </div>
                        <p className="font-display font-bold text-ink-black">Se cotiza según lo que necesites.</p>
                        <a href={wa(MENSAJES.app)} target="_blank" rel="noopener noreferrer" className="boton boton-secundario mt-5 self-start">
                            Quiero mi app
                            <Flecha />
                        </a>
                    </article>
                </div>

                {/* Inteligencia artificial: dos casos reales, publicados, con el OK de cada cliente. */}
                <div className="mt-8 rounded-xl border-4 border-black bg-ink-black p-6 text-white shadow-neobrutalism-primary sm:p-10">
                    <h3 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                        Inteligencia artificial <span className="text-accent-yellow">que ya está trabajando</span>
                    </h3>
                    <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="flex flex-col">
                            <p className="font-display text-xl font-bold uppercase">Óptica AGB</p>
                            <ul className="mt-3 space-y-2">
                                <li className="flex gap-2 font-medium leading-snug text-white/90">
                                    <span aria-hidden="true" className="material-icons text-lg text-secondary">check</span>
                                    Probador de anteojos con IA: te los probás con una selfie.
                                </li>
                                <li className="flex gap-2 font-medium leading-snug text-white/90">
                                    <span aria-hidden="true" className="material-icons text-lg text-secondary">check</span>
                                    Lector de recetas con IA: subís la foto de la receta y la tienda arma el par.
                                </li>
                            </ul>
                            <div className="my-8 flex-1">
                                <EscenaReceta />
                            </div>
                            <Link href="/portafolio/optica-agb" className="self-start font-display font-bold text-accent-yellow underline underline-offset-4 hover:no-underline">
                                Ver el proyecto
                            </Link>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-display text-xl font-bold uppercase">Aliverti</p>
                            <ul className="mt-3 space-y-2">
                                <li className="flex gap-2 font-medium leading-snug text-white/90">
                                    <span aria-hidden="true" className="material-icons text-lg text-secondary">check</span>
                                    Asesor de ventas con IA, que ayuda a elegir el equipo de montaña o de trabajo en altura.
                                </li>
                            </ul>
                            <div className="my-8 flex-1">
                                <EscenaChat />
                            </div>
                            <Link href="/portafolio/aliverti" className="self-start font-display font-bold text-accent-yellow underline underline-offset-4 hover:no-underline">
                                Ver el proyecto
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10 flex flex-col gap-4 border-t-2 border-white/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-md font-medium leading-snug text-white/90">
                            ¿Querés algo así en tu negocio? Contanos qué hacés y te decimos dónde puede ayudarte.
                        </p>
                        <a href={wa(MENSAJES.ia)} target="_blank" rel="noopener noreferrer" className="boton boton-amarillo boton-sobre-oscuro self-start sm:self-auto">
                            Quiero sumar IA
                            <Flecha />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- Escenas: ilustración de cada acción, sin texto que haga falta leer ---------- */

function EscenaTienda() {
    return (
        <div aria-hidden="true" className="escena relative mx-auto w-full max-w-md pb-10">
            <div className="overflow-clip rounded-xl border-4 border-black bg-white shadow-neobrutalism">
                <div className="flex items-center gap-1.5 border-b-2 border-black bg-background-light px-3 py-2">
                    <span className="h-3 w-3 rounded-full border-2 border-black bg-hot-coral" />
                    <span className="h-3 w-3 rounded-full border-2 border-black bg-accent-yellow" />
                    <span className="h-3 w-3 rounded-full border-2 border-black bg-secondary" />
                    <span className="ml-2 flex-1 truncate rounded-md border-2 border-black bg-white px-2 py-0.5 font-display text-xs font-bold text-ink-black/70">tunegocio.com.ar</span>
                    <span className="relative ml-1 inline-flex">
                        <span className="material-icons text-2xl text-ink-black">shopping_cart</span>
                        <span className="anima t-cuenta absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-primary font-display text-xs font-bold text-white">1</span>
                    </span>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-4 p-4">
                    <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-black bg-accent-yellow">
                        <span className="material-icons text-6xl text-ink-black">backpack</span>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="font-display text-lg font-bold leading-tight text-ink-black">Mochila urbana</p>
                            <p className="mt-1 font-display font-bold text-primary">$ 38.500</p>
                        </div>
                        <span className="anima t-boton relative mt-3 grid rounded-lg border-2 border-black bg-primary px-3 py-2 text-center font-display text-sm font-bold uppercase text-white">
                            <span className="anima t-sale col-start-1 row-start-1">Agregar al carrito</span>
                            <span className="anima t-entra col-start-1 row-start-1 inline-flex items-center justify-center gap-1">
                                <span className="material-icons text-base">check</span>
                                Agregado
                            </span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t-2 border-black px-4 py-3">
                    <span className="font-display text-sm font-bold uppercase text-ink-black/70">Total</span>
                    <span className="font-display font-bold text-ink-black">$ 38.500</span>
                </div>
            </div>
            {/* El sello va envuelto: `.sello` fija position: relative y le gana a absolute. */}
            <div className="absolute -right-3 -top-5">
                <span className="anima t-pago sello bg-white text-sm text-ink-black">Pago aprobado</span>
            </div>
            <div className="anima t-aviso absolute bottom-0 left-4 right-4 flex items-center gap-3 rounded-lg border-2 border-black bg-ink-black px-4 py-3 text-white shadow-neobrutalism-sm sm:left-10 sm:right-auto">
                <span className="material-icons text-accent-yellow">notifications</span>
                <span className="font-display text-sm font-bold">Tu panel: nuevo pedido #1043</span>
            </div>
        </div>
    );
}

const PEDIDOS = [
    { numero: "#218", canal: "WhatsApp", icono: "chat" },
    { numero: "#219", canal: "Mostrador", icono: "storefront" },
    { numero: "#220", canal: "Tienda online", icono: "shopping_cart" },
];

function EscenaSistema() {
    return (
        <div aria-hidden="true" className="escena w-full overflow-clip rounded-xl border-4 border-black bg-white shadow-neobrutalism">
            <div className="flex items-center justify-between border-b-2 border-black bg-ink-black px-4 py-2.5 text-white">
                <span className="font-display text-sm font-bold uppercase">Pedidos de hoy</span>
                <span className="material-icons text-xl text-accent-yellow">inventory_2</span>
            </div>
            <ul className="divide-y-2 divide-black/10">
                {PEDIDOS.map((p, i) => (
                    <li key={p.numero} className={`s-fila s-fila-${i + 1} flex items-center gap-3 px-4 py-3`}>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-black bg-background-light">
                            <span className="material-icons text-lg text-ink-black">{p.icono}</span>
                        </span>
                        <span className="flex-1 leading-tight">
                            <span className="block font-display font-bold text-ink-black">{p.numero}</span>
                            <span className="block text-sm font-medium text-ink-black/70">{p.canal}</span>
                        </span>
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
        <div aria-hidden="true" className="escena mx-auto w-48">
            <div className="rounded-[2.2rem] border-4 border-black bg-ink-black p-2 shadow-neobrutalism-lg">
                <div className="relative aspect-[9/16] overflow-clip rounded-[1.7rem] bg-background-light">
                    {/* Pantalla de inicio: el ícono violeta es la app del negocio. */}
                    <div className="grid grid-cols-3 gap-3 p-4 pt-8">
                        {Array.from({ length: 9 }, (_, i) =>
                            i === 4 ? (
                                <span key={i} className="anima a-icono flex aspect-square items-center justify-center rounded-xl border-2 border-black bg-primary">
                                    <span className="material-icons text-2xl text-white">storefront</span>
                                </span>
                            ) : (
                                <span key={i} className="aspect-square rounded-xl border-2 border-black/25 bg-white" />
                            ),
                        )}
                    </div>
                    {/* La app abierta: crece desde el ícono. */}
                    <div className="anima a-pantalla absolute inset-0 flex flex-col bg-white">
                        <div className="border-b-2 border-black bg-primary px-3 pb-3 pt-7 text-white">
                            <span className="font-display text-sm font-bold uppercase">Tu negocio</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-3">
                            <span className="font-display text-sm font-bold text-ink-black">Reservá tu turno</span>
                            <div className="grid grid-cols-2 gap-2">
                                {["10:00", "10:30", "11:00", "11:30"].map((h) => (
                                    <span
                                        key={h}
                                        className={`rounded-md border-2 border-black px-1 py-1 text-center font-display text-xs font-bold ${h === "10:30" ? "anima a-hora bg-primary text-white" : "bg-white text-ink-black"}`}
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-auto flex justify-center pb-3">
                                <span className="anima a-sello sello bg-white text-xs text-ink-black">Turno confirmado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const RENGLONES = ["w-11/12", "w-8/12", "w-10/12", "w-7/12"];
const DATOS_RECETA = ["Ojo derecho −1,25", "Ojo izquierdo −1,00", "Monofocales"];

function EscenaReceta() {
    return (
        <div aria-hidden="true" className="escena grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="relative overflow-clip rounded-lg border-4 border-black bg-white p-4 text-ink-black shadow-neobrutalism-white">
                <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold uppercase">Receta</span>
                    <span className="material-icons text-xl text-primary">photo_camera</span>
                </div>
                <div className="mt-3 space-y-2.5">
                    {RENGLONES.map((w, i) => (
                        <span key={i} className={`block h-2.5 rounded-full bg-ink-black/20 ${w}`} />
                    ))}
                </div>
                {/* La línea que lee la receta baja una vez y desaparece. */}
                <div className="anima r-scan pointer-events-none absolute inset-0">
                    <span className="block h-1 w-full bg-secondary shadow-[0_2px_0_#1A1A1A]" />
                </div>
            </div>
            <ul className="flex flex-wrap gap-2 sm:flex-col">
                {DATOS_RECETA.map((d, i) => (
                    <li key={d} className={`anima r-dato r-dato-${i + 1} rounded-md border-2 border-black bg-mint px-3 py-1 font-display text-sm font-bold text-ink-black`}>
                        {d}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function EscenaChat() {
    return (
        <div aria-hidden="true" className="escena flex flex-col gap-3">
            <p className="anima c-pregunta self-end max-w-[85%] rounded-2xl rounded-br-sm border-2 border-black bg-white px-4 py-2.5 font-medium leading-snug text-ink-black">
                Trabajo en altura. ¿Qué arnés me sirve?
            </p>
            <span className="anima c-escribe flex gap-1.5 self-start rounded-2xl border-2 border-black bg-mint px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-ink-black" />
                <span className="h-2 w-2 rounded-full bg-ink-black" />
                <span className="h-2 w-2 rounded-full bg-ink-black" />
            </span>
            <p className="anima c-respuesta self-start max-w-[85%] rounded-2xl rounded-bl-sm border-2 border-black bg-mint px-4 py-2.5 font-medium leading-snug text-ink-black">
                Para trabajo en altura te armo un kit con arnés, cabo y mosquetón.
            </p>
            <div className="anima c-kit flex flex-wrap gap-2 self-start">
                {["Arnés", "Cabo", "Mosquetón"].map((k) => (
                    <span key={k} className="rounded-md border-2 border-black bg-accent-yellow px-2.5 py-0.5 font-display text-sm font-bold text-ink-black">
                        {k}
                    </span>
                ))}
            </div>
        </div>
    );
}
