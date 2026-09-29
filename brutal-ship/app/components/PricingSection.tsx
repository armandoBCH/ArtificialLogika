"use client";

import { m, Variants } from "framer-motion";
import type { MouseEvent } from "react";
import type { PricingPlan, PricingFeature } from "@/lib/types/database";
import type { SiteConfigMap } from "@/lib/types/database";
import { cuotaMensual, formatearPesos, formatearPrecio, separarCaracteristicas } from "@/lib/precios";
import { textoSobreFondo } from "@/lib/iconos-plan";

const containerVariants: Variants = {
    hidden: {},
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15
        }
    }
};

interface PricingSectionProps {
    plans: PricingPlan[];
    config: SiteConfigMap;
}

function FeatureItem({ feature }: { feature: PricingFeature }) {
    return (
        <div className="flex items-center gap-3">
            {/* El color del glifo sale del fondo: con fondos oscuros (coral, violeta,
                negro) va en blanco. Antes solo se contemplaba el coral. */}
            <div className={`w-6 h-6 ${feature.icon_bg} ${textoSobreFondo(feature.icon_bg)} border-2 border-black shadow-neobrutalism-sm flex items-center justify-center flex-shrink-0`}>
                <span aria-hidden="true" className="material-icons text-sm font-black">{feature.icon}</span>
            </div>
            <span className={feature.is_highlighted ? "font-bold underline decoration-hot-coral decoration-2 underline-offset-2" : "font-medium"}>
                {feature.text}
            </span>
        </div>
    );
}

// El mantenimiento mensual es opcional pero su monto tiene que estar en la tarjeta:
// un "+" sin número obliga a buscar la cifra 800px más abajo, dentro de un acordeón.
// Las cuotas viven en lib/precios.ts: el presupuestador del admin usa las mismas.

function PlanCard({ plan }: { plan: PricingPlan }) {
    const isFeatured = plan.is_featured;
    const { aLaVista, enVerMas } = separarCaracteristicas(plan.features ?? []);

    // El énfasis visual se DERIVA de is_featured, no de `header_bg`/`cta_style`.
    // Esos campos vivían sueltos en la base y se habían desincronizado: la tarjeta
    // que decía "Recomendado" se veía como la común, y la que se veía destacada no
    // tenía etiqueta. Derivarlo hace que no puedan volver a separarse.
    const cabecera = isFeatured ? "bg-primary" : "bg-ink-black";

    return (
        <m.div
            variants={itemVariants}
            className={`group/plan relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-300 ${isFeatured
                ? "border-4 border-black shadow-neobrutalism-xl md:-translate-y-5 hover:-translate-y-6"
                : "border-2 border-black shadow-neobrutalism hover:shadow-neobrutalism-lg hover:-translate-y-1"
                }`}
        >
            {/* Franja de etiqueta con alto fijo en las TRES tarjetas. Antes la etiqueta
                iba absoluta y la destacada compensaba con `pt-11`, así que su cabecera
                arrancaba más abajo que las otras dos y quedaba un hueco blanco arriba.
                Reservando el espacio en todas, los tres encabezados alinean solos. */}
            <div className={`h-9 flex items-center justify-center border-b-2 border-black ${isFeatured ? "bg-accent-yellow" : cabecera}`}>
                {isFeatured && plan.featured_label && (
                    <span className="font-black uppercase text-[11px] tracking-[0.18em] text-ink-black">
                        {plan.featured_label}
                    </span>
                )}
            </div>
            <div className={`${cabecera} p-5 border-b-2 border-black relative overflow-hidden`}>
                {isFeatured && (
                    <span
                        aria-hidden="true"
                        className="absolute -right-8 -top-8 w-28 h-28 rounded-full border-4 border-white/20 pointer-events-none"
                    ></span>
                )}
                <h3 className="relative text-white text-2xl font-bold uppercase mt-1 tracking-tight">{plan.name}</h3>
                <p className="relative text-white/80 font-medium mt-1 text-sm">{plan.subtitle}</p>
            </div>
            <div className="p-6 flex flex-col flex-1">
                {plan.original_price && (
                    <div className="flex items-end justify-center gap-1 mb-1">
                        <span className="text-xl font-bold text-ink-black/60 line-through">{formatearPrecio(plan.original_price, plan.currency)}</span>
                    </div>
                )}
                <div className="flex flex-col items-center gap-1 mb-3 mt-2">
                    {/* En pesos la cifra tiene el doble de dígitos que en dólares: "una vez"
                        baja de renglón antes que desbordar la tarjeta. */}
                    <div className="flex flex-wrap items-end justify-center gap-x-1.5">
                        <span className="text-4xl lg:text-5xl font-bold tabular-nums">{formatearPrecio(plan.price, plan.currency)}</span>
                        <span className="text-base lg:text-lg font-bold text-ink-black/80 mb-1">una vez</span>
                    </div>
                    {cuotaMensual(plan) && (
                        <p className="text-sm font-bold text-ink-black/80">
                            + {formatearPesos(cuotaMensual(plan)!)}/mes de mantenimiento{" "}
                            <span className="font-medium text-ink-black/70">(opcional)</span>
                        </p>
                    )}
                </div>
                {plan.price_note && (
                    <p className="text-xs text-ink-black/70 font-medium mb-6 text-center">{plan.price_note}</p>
                )}
                {!plan.price_note && <div className="mb-4" />}
                <div className="mb-5 text-left border-l-2 border-primary pl-3">
                    <span className="block font-black uppercase tracking-wider text-xs text-ink-black mb-1">Elegí este si querés</span>
                    <p className="text-sm font-bold text-ink-black leading-snug">
                        {QUIERO[plan.name] ?? QUIERO_FALLBACK}
                    </p>
                    {EJEMPLOS[plan.name] && (
                        <p className="mt-1.5 text-xs font-medium text-ink-black/60 leading-snug">
                            {EJEMPLOS[plan.name]}
                        </p>
                    )}
                    {NOTA_PRECIO[plan.name] && (
                        <p className="mt-2 flex items-start gap-1.5 text-xs font-bold text-ink-black/70 leading-snug">
                            <span aria-hidden="true" className="material-icons text-sm leading-none mt-px">info</span>
                            {NOTA_PRECIO[plan.name]}
                        </p>
                    )}
                </div>
                {/* Ocho features por tarjeta x tres tarjetas eran 24 filas compitiendo en
                    la pantalla donde la persona decide. Unas pocas quedan a la vista y el
                    resto se abre a pedido. Nada se esconde: se ordena. Cuales van a la
                    vista se elige en el admin, caracteristica por caracteristica. */}
                {aLaVista.length > 0 && (
                    <div className="space-y-3 mb-4 text-left">
                        {aLaVista.map((feature, i) => (
                            <FeatureItem key={i} feature={feature} />
                        ))}
                    </div>
                )}
                {enVerMas.length > 0 && (
                    <details className="mb-6 text-left group/mas">
                        <summary className="cursor-pointer list-none inline-flex items-center gap-1 min-h-11 font-bold text-sm uppercase tracking-wider text-primary hover:underline decoration-2 underline-offset-2">
                            <span className="group-open/mas:hidden">Ver las {enVerMas.length} restantes</span>
                            <span className="hidden group-open/mas:inline">Ver menos</span>
                            <span aria-hidden="true" className="material-icons text-base transition-transform group-open/mas:rotate-180">expand_more</span>
                        </summary>
                        <div className="space-y-3 pt-3">
                            {enVerMas.map((feature, i) => (
                                <FeatureItem key={`mas-${i}`} feature={feature} />
                            ))}
                        </div>
                    </details>
                )}
                {/* El CTA también sale de is_featured: violeta lleno en el plan recomendado,
                    blanco en los otros. Un solo origen de verdad para todo el énfasis. */}
                <a
                    href="#contacto"
                    className={`cta mt-auto flex items-center justify-center gap-2 w-full min-h-12 font-black text-base uppercase tracking-wide border-2 border-black rounded transition-all ${isFeatured
                        ? "bg-primary text-white shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px]"
                        : "bg-white text-ink-black shadow-neobrutalism-sm hover:bg-accent-yellow hover:shadow-neobrutalism hover:-translate-y-[2px]"
                        }`}
                >
                    {plan.cta_text}
                    <span aria-hidden="true" className="material-icons text-lg transition-transform group-hover/plan:translate-x-1">arrow_forward</span>
                </a>
            </div>
        </m.div>
    );
}

/* "¿Para quién es?" — venía de la sección de servicios, que decía lo mismo que esta
   con otras palabras. Ahora acompaña al precio, que es donde la persona compara. */
// Antes esto describia QUIEN SOS ("emprendedores, freelancers"). Habia ademas una
// seccion entera arriba, "Elegi que queres que haga", que preguntaba QUE QUERES y
// repetia los tres planes con sus tres precios: la misma decision contada dos veces
// a dos pantallas de distancia.
//
// La pregunta del selector era la mejor de las dos. El dueno de una peluqueria sabe
// que quiere que lo encuentren; no sabe si es "emprendedor" o "negocio completo".
// Asi que la pregunta se muda aca, junto al precio, y la seccion se elimina.
const QUIERO: Record<string, string> = {
    "Landing Page": "Que la gente me encuentre y me escriba.",
    "Sitio Institucional": "Mostrar todo lo que ofrezco y verme serio.",
    "E-commerce": "Vender o tomar pedidos online.",
    "E-commerce / Plataforma": "Vender o tomar pedidos online.",
};

// Los ejemplos concretos venian del selector y hacian trabajo real: aterrizan el
// plan en un rubro que la persona reconoce.
const EJEMPLOS: Record<string, string> = {
    "Landing Page": "Peluqueria, entrenador, fotografo, oficios",
    "Sitio Institucional": "Clinica, estudio juridico, constructora, PyME",
    "E-commerce": "Tienda, heladeria, distribuidora, turnos",
    "E-commerce / Plataforma": "Tienda, heladeria, distribuidora, turnos",
};

// La advertencia del E-commerce vivia en una caja suelta al pie de la seccion,
// a 2000px del precio que califica. Va donde corresponde: pegada al precio.
const NOTA_PRECIO: Record<string, string> = {
    "E-commerce": "Precio base. Puede variar segun el alcance de tu proyecto.",
    "E-commerce / Plataforma": "Precio base. Puede variar segun el alcance de tu proyecto.",
};

const QUIERO_FALLBACK = "Una web que trabaje para tu negocio.";

// Titulo en lenguaje llano (lo que gana el cliente); el termino tecnico va en el detalle. Antes era
// una lista de siete renglones largos con el mismo peso: habia que leerla toda.
const INCLUYE = [
    { icon: "dns", titulo: "Tu web siempre online", detalle: "Hosting en servidores rápidos" },
    { icon: "language", titulo: "Tu dirección web", detalle: "tu-marca.com, renovada cada año" },
    { icon: "lock", titulo: "Sitio seguro", detalle: "Candado de seguridad (SSL)" },
    { icon: "cloud_done", titulo: "Tu información guardada", detalle: "Datos y archivos en la nube" },
    { icon: "backup", titulo: "Copias de respaldo", detalle: "Si algo falla, lo recuperamos" },
    { icon: "autorenew", titulo: "Siempre al día", detalle: "Actualizaciones técnicas" },
];

// Se abre a mano y no con el toggle nativo: al desplegarse, el scroll anchoring de
// Chrome se anclaba a algo de abajo y tiraba la pagina al final del bloque.
function abrirSinSalto(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    const details = e.currentTarget.parentElement as HTMLDetailsElement;
    const html = document.documentElement;
    html.style.overflowAnchor = "none";
    details.open = !details.open;
    if (details.open) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        details.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    window.setTimeout(() => { html.style.overflowAnchor = ""; }, 800);
}

function MantenimientoMensual({ conCuota }: { conCuota: { plan: PricingPlan; cuota: number }[] }) {
    const desde = Math.min(...conCuota.map((x) => x.cuota));

    return (
        <details
            className="group mt-16 max-w-5xl mx-auto w-full relative z-10 text-left"
            style={{ scrollMarginTop: "6rem" }}
        >
            <summary
                onClick={abrirSinSalto}
                className="cursor-pointer list-none flex items-center gap-4 bg-white border-4 border-black rounded-xl shadow-neobrutalism px-5 py-4 sm:px-6 sm:py-5 transition-transform hover:-translate-y-0.5"
            >
                <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold uppercase tracking-tight text-lg sm:text-xl leading-tight">
                        ¿Para qué es el pago mensual?
                    </span>
                    {/* Lo esencial sin abrir: que es opcional y desde cuanto. */}
                    <span className="mt-1 block text-sm font-medium text-ink-black/75">
                        Opcional · desde <strong className="font-display font-bold text-ink-black tabular-nums">{formatearPesos(desde)}/mes</strong>
                    </span>
                </span>
                <span aria-hidden="true" className="shrink-0 w-9 h-9 flex items-center justify-center border-2 border-black rounded-full bg-accent-yellow transition-transform duration-300 group-open:rotate-45"><span className="material-icons">add</span></span>
            </summary>

            <div className="mt-4 group-open:animate-[cuota-reveal_0.4s_cubic-bezier(0.22,1,0.36,1)]">
                <div className="bg-white border-4 border-black rounded-xl shadow-neobrutalism-lg overflow-hidden">
                    <div className="bg-primary text-white px-5 py-6 sm:px-8 sm:py-8 border-b-4 border-black">
                        <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter leading-[1.05]">
                            Para que tu web{" "}
                            <span className="inline-block bg-accent-yellow text-ink-black px-2 -rotate-2 border-2 border-black shadow-neobrutalism-sm">siga viva</span>
                        </h3>
                        <p className="mt-3 max-w-xl text-base sm:text-lg font-medium text-white/90 leading-snug">
                            Nos ocupamos de lo técnico para que funcione rápida y segura. Vos, de tu negocio.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5">
                        <div className="p-5 sm:p-8 lg:col-span-3 lg:border-r-4 border-black">
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-black/70">Qué incluye</h4>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 sm:gap-3">
                                {INCLUYE.map((item) => (
                                    <li key={item.titulo} className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 rounded-lg border-2 border-black bg-background-light p-3">
                                        <span aria-hidden="true" className="shrink-0 w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center rounded-md border-2 border-black bg-white text-primary"><span className="material-icons text-xl lg:text-2xl">{item.icon}</span></span>
                                        <span className="min-w-0 flex flex-col gap-1">
                                            <span className="font-display font-bold text-sm sm:text-base leading-tight">{item.titulo}</span>
                                            <span className="text-xs text-ink-black/70 leading-snug">{item.detalle}</span>
                                        </span>
                                    </li>
                                ))}
                                {/* El soporte es lo unico humano de la lista: va entero y en menta. */}
                                <li className="col-span-full flex items-center gap-3 rounded-lg border-2 border-black bg-mint p-3 shadow-neobrutalism-sm">
                                    <span aria-hidden="true" className="shrink-0 w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center rounded-md border-2 border-black bg-white"><span className="material-icons text-xl lg:text-2xl">support_agent</span></span>
                                    <span className="min-w-0">
                                        <span className="block font-display font-bold text-sm sm:text-base leading-tight">Soporte directo por WhatsApp</span>
                                        <span className="block text-xs text-ink-black/80 leading-snug">Nos escribís y lo resolvemos.</span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col p-5 sm:p-8 lg:col-span-2 border-t-4 lg:border-t-0 border-black bg-background-light">
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-black/70">Cuánto sale, según tu plan</h4>
                            {/* Sale de los planes: cada uno con cuota aparece aca, en el orden del sitio. */}
                            <dl className="overflow-hidden rounded-lg border-2 border-black bg-white shadow-neobrutalism divide-y-2 divide-black">
                                {conCuota.map(({ plan, cuota }) => (
                                    <div key={plan.id} className={`flex items-center justify-between gap-3 px-4 py-3.5 ${plan.is_featured ? "bg-accent-yellow" : ""}`}>
                                        <dt className="min-w-0">
                                            <span className="block font-display font-bold uppercase text-sm leading-tight">{plan.name}</span>
                                            {plan.is_featured && plan.featured_label && (
                                                <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-wider text-primary">{plan.featured_label}</span>
                                            )}
                                        </dt>
                                        <dd className="shrink-0 text-right font-display leading-none">
                                            {plan.payment_type === "Precio Base" && (
                                                <span className="block mb-1 text-[11px] font-bold uppercase tracking-wider text-ink-black/70">desde</span>
                                            )}
                                            <span className="text-2xl sm:text-3xl font-bold tabular-nums">{formatearPesos(cuota)}</span>
                                            <span className="ml-0.5 text-sm font-bold text-ink-black/70">/mes</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <ul className="mt-6 space-y-3 text-sm leading-snug">
                                <li className="flex items-start gap-2.5">
                                    <span aria-hidden="true" className="material-icons shrink-0 text-lg leading-none text-primary">lock_open</span>
                                    <span><strong className="font-bold">Cancelás cuando quieras.</strong> Sin penalidad.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span aria-hidden="true" className="material-icons shrink-0 text-lg leading-none text-primary">key</span>
                                    <span><strong className="font-bold">¿Preferís no tomarlo?</strong> Te dejamos tu dirección web y el alojamiento a tu nombre, listos para que sigas por tu cuenta.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </details>
    );
}

export default function PricingSection({ plans, config }: PricingSectionProps) {
    const conCuota = plans
        .map((plan) => ({ plan, cuota: cuotaMensual(plan) }))
        .filter((x): x is { plan: PricingPlan; cuota: number } => x.cuota !== null);
    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola, tengo dudas sobre los planes web")}`;

    return (
        <section id="precios" aria-labelledby="precios-heading" className="pt-12 pb-20 bg-accent-yellow border-b-2 border-black relative overflow-hidden">
            <span id="servicios" className="block relative -top-28" aria-hidden="true"></span>
            {/* Decoration */}
            <div className="absolute top-10 left-10 text-9xl opacity-10 font-bold rotate-12 pointer-events-none">✦</div>
            <div className="absolute bottom-10 right-10 text-9xl opacity-10 font-bold -rotate-12 pointer-events-none">✦</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <m.div
                    initial={{ y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 id="precios-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] mb-4">Qué recibís<br /><span className="text-primary">y cuánto sale</span></h2>
                    <p className="text-xl font-medium mb-12 max-w-xl mx-auto">Todo en un solo lugar. Sin sorpresas, sin letra chica.</p>
                </m.div>

                <m.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl lg:max-w-[85rem] mx-auto items-start relative z-10"
                >
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </m.div>

                {/* El mantenimiento mensual es opcional. Mostrarlo abierto en el momento de decidir
                    sumaba tres compromisos de precio mas a los tres planes. Queda plegado, pero el
                    resumen ya dice lo esencial (opcional, desde cuanto) sin tener que abrirlo. */}
                {conCuota.length > 0 && <MantenimientoMensual conCuota={conCuota} />}

                {/* Aca habia dos cajas rotadas. La del E-commerce se mudo a la tarjeta de
                    ese plan, pegada al precio que califica. La de "50% de sena + garantia"
                    repetia la garantia, que hoy es la franja que abre esta seccion, con
                    un emoji de advertencia que ademas era el unico de la pagina. */}

                {/* Acá había un banner violeta con su propio botón de WhatsApp, casi igual al
                    que cerraba las preguntas frecuentes. Dos banners de WhatsApp a mitad de
                    página, más la barra fija y el widget, que ya lo dejan a un toque todo el
                    tiempo. Queda la línea: la duda se nombra y la salida está en el texto. */}
                <p className="mt-12 text-lg font-medium text-ink-black">
                    ¿No sabés cuál elegir?{" "}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 font-bold underline decoration-2 underline-offset-4 hover:text-primary transition-colors"
                    >
                        Escribinos por WhatsApp
                    </a>{" "}
                    y te asesoramos gratis.
                </p>
            </div>
        </section>
    );
}
