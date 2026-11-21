import Link from "next/link";
import type { PricingPlan, SiteConfigMap } from "@/lib/types/database";
import { formatearPrecio } from "@/lib/precios";

/**
 * Tiendas, sistemas y apps para negocios que ya funcionan (dueño, 2026-11-21).
 *
 * La campaña 2 de Meta le habla a negocios establecidos que quieren crecer en
 * internet; el que entra a la web desde ese aviso tiene que encontrar qué más
 * hacemos además de la web. Va después de Precios: responde "¿y si necesito más
 * que una web?" con lo que ya cotizan los planes.
 *
 * Reglas que vienen del dueño:
 * - Apps solo para Android.
 * - Sistemas y apps "se cotizan", sin número. La tienda muestra el precio del plan
 *   E-commerce, leído de la base para que no quede viejo.
 * - Las funciones con IA son las que ya están publicadas en AGB y Aliverti, con su
 *   OK. Se muestra lo que hacen; nada de prometer ventas ni horas ahorradas.
 * - El panel aparece solo atado a la tienda online.
 */

const CONSULTA = "Hola! Tengo un negocio y quiero consultar por una tienda, un sistema o una app.";

const CASOS_IA = [
    {
        cliente: "Óptica AGB",
        href: "/portafolio/optica-agb",
        funciones: [
            "Probador de anteojos con IA: te los probás con una selfie.",
            "Lector de recetas con IA: subís la foto de la receta y la tienda arma el par.",
        ],
    },
    {
        cliente: "Aliverti",
        href: "/portafolio/aliverti",
        funciones: ["Asesor de ventas con IA, que ayuda a elegir el equipo de montaña o de trabajo en altura."],
    },
];

export default function SistemasSection({ plans, config }: { plans: PricingPlan[]; config: SiteConfigMap }) {
    const tienda = plans.find((p) => p.name.startsWith("E-commerce"));
    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(CONSULTA)}`;

    const ofertas = [
        {
            icono: "storefront",
            titulo: "Tienda online",
            texto: "Carrito, pagos online y tu panel para ver cada pedido, cargar productos y cambiar precios.",
            precio: tienda ? `Desde ${formatearPrecio(tienda.price, tienda.currency)}` : "Ver en Precios",
        },
        {
            icono: "inventory_2",
            titulo: "Sistema para tu negocio",
            texto: "Pedidos, stock, turnos o clientes, ordenados en un sistema pensado para cómo trabajás.",
            precio: "Se cotiza según lo que necesites",
        },
        {
            icono: "phone_android",
            titulo: "App para Android",
            texto: "Tu app en el celular Android de tus clientes, para pedidos, turnos o catálogo.",
            precio: "Se cotiza según lo que necesites",
        },
    ];

    return (
        <section id="sistemas" aria-labelledby="sistemas-heading" className="relative bg-white border-b-2 border-black px-4 py-20 md:px-10 lg:px-20 overflow-clip">
            <div className="max-w-6xl mx-auto">
                <div className="text-center">
                    <p className="sello bg-ink-black text-white text-sm shadow-neobrutalism-sm">Para negocios que ya funcionan</p>
                    <h2 id="sistemas-heading" className="titular-seccion mt-7 text-ink-black">
                        Más que una web:
                        <br />
                        <span className="marcador text-primary">tiendas, sistemas y apps</span>
                    </h2>
                    <p className="mt-6 mx-auto max-w-2xl text-lg font-medium leading-snug text-ink-black/75">
                        Si tu negocio ya tiene clientes, el próximo paso puede ser vender online, ordenar los pedidos o tener tu propia app. Lo armamos para cómo trabajás y, donde sirve, le sumamos inteligencia artificial.
                    </p>
                </div>

                <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ofertas.map((o) => (
                        <li key={o.titulo} className="flex flex-col rounded-xl border-4 border-black bg-background-light p-6 shadow-neobrutalism">
                            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-accent-yellow">
                                <span className="material-icons text-2xl text-ink-black">{o.icono}</span>
                            </span>
                            <h3 className="mt-4 text-2xl font-bold uppercase tracking-tight text-ink-black">{o.titulo}</h3>
                            <p className="mt-2 flex-1 font-medium leading-snug text-ink-black/75">{o.texto}</p>
                            <p className="mt-5 border-t-2 border-black/15 pt-4 font-display font-bold text-primary">{o.precio}</p>
                        </li>
                    ))}
                </ul>

                <div className="mt-12 rounded-xl border-4 border-black bg-ink-black p-6 text-white shadow-neobrutalism-primary sm:p-8">
                    <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-accent-yellow">
                        <span aria-hidden="true" className="material-icons text-xl">auto_awesome</span>
                        Funciones con IA, ya andando
                    </p>
                    <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {CASOS_IA.map((c) => (
                            <div key={c.cliente}>
                                <h3 className="text-xl font-bold uppercase tracking-tight">{c.cliente}</h3>
                                <ul className="mt-2 space-y-2">
                                    {c.funciones.map((f) => (
                                        <li key={f} className="flex gap-2 font-medium leading-snug text-white/85">
                                            <span aria-hidden="true" className="material-icons text-lg text-secondary">check</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={c.href} className="mt-3 inline-flex items-center gap-1 font-display font-bold text-accent-yellow underline underline-offset-4 hover:no-underline">
                                    Ver el proyecto
                                    <span aria-hidden="true" className="material-icons text-base">arrow_forward</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border-4 border-black bg-primary px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-neobrutalism transition-transform hover:-translate-y-0.5"
                    >
                        <span aria-hidden="true" className="material-icons">chat</span>
                        Contanos qué necesitás
                    </a>
                    <p className="mt-3 text-sm font-medium text-ink-black/60">Te respondemos por WhatsApp y te decimos cuánto sale.</p>
                </div>
            </div>
        </section>
    );
}
