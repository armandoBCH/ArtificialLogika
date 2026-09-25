"use client";

import { motion, Variants } from "framer-motion";
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
        <motion.div
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
        </motion.div>
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

// Una sombra por fila, en el orden en que estaban: menta, negra, violeta.
const SOMBRAS_CUOTA = [
    "shadow-neobrutalism-mint",
    "shadow-neobrutalism sm:shadow-neobrutalism-lg",
    "shadow-neobrutalism-primary",
];

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
                <motion.div
                    initial={{ y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 id="precios-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] mb-4">Qué recibís<br /><span className="text-primary">y cuánto sale</span></h2>
                    <p className="text-xl font-medium mb-12 max-w-xl mx-auto">Todo en un solo lugar. Sin sorpresas, sin letra chica.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl lg:max-w-[85rem] mx-auto items-start relative z-10"
                >
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </motion.div>

                {/* Monthly Fee Section */}
                {/* El mantenimiento mensual es opcional. Mostrarlo abierto en el momento de decidir
                    sumaba tres compromisos de precio mas a los tres planes. Sigue estando completo y
                    findable, pero ya no compite con la decision principal. */}
                {conCuota.length > 0 && (
                <details className="mt-16 max-w-5xl mx-auto w-full px-4 sm:px-0 relative z-10 group">
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-4 bg-white border-4 border-black rounded-xl shadow-neobrutalism px-6 py-5 font-black uppercase tracking-tight text-lg sm:text-xl transition-all hover:-translate-y-0.5">
                        <span>¿Para qué es el pago mensual?</span>
                        <span aria-hidden="true" className="material-icons shrink-0 border-2 border-black rounded-full bg-accent-yellow transition-transform group-open:rotate-45">add</span>
                    </summary>
                    <motion.div
                        initial={{ y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        /* Antes repetia las mismas clases de layout que el <details> que lo
                           envuelve — max-w-5xl, mx-auto, w-full, px-4. Abajo de 640px el px-4
                           se aplicaba DOS veces y, sumado a los border-4 y los p-6/p-4 de
                           adentro, a 320px dejaba 128px de contenido: los textos de la lista
                           se desbordaban de su fila. El contenedor de afuera ya se ocupa del
                           ancho y del padding. */
                        className="mt-6 relative z-10"
                    >
                        <div className="bg-white border-4 border-black shadow-neobrutalism-lg overflow-hidden flex flex-col lg:flex-row rounded-xl relative">
                            <div className="bg-primary p-5 sm:p-6 md:p-10 lg:p-12 lg:w-3/5 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center relative">
                                {/* Decorative element hidden on mobile */}
                                <div className="absolute -left-4 -top-4 w-12 h-12 bg-accent-yellow border-4 border-black rounded-full shadow-neobrutalism z-20 hidden sm:block"></div>

                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 sm:mb-5 text-white relative z-10 leading-none mt-2 sm:mt-0">
                                    Para que tu web<br />
                                    <span className="bg-accent-yellow text-black px-2 mt-2 inline-block -rotate-2 border-4 border-black shadow-neobrutalism-sm sm:shadow-neobrutalism">siga viva</span>
                                </h3>
                                <p className="text-lg sm:text-xl font-bold mb-6 text-white/90 relative z-10">
                                    Tu web es un ecosistema vivo. Nosotros nos hacemos cargo de la parte técnica para que funcione rapidísima y segura las 24 horas.
                                </p>

                                <div className="bg-white/10 p-3 sm:p-5 border-4 border-black rounded-xl shadow-neobrutalism relative z-10">
                                    <p className="font-extrabold uppercase text-xs sm:text-sm mb-4 text-white border-b-2 border-white/20 pb-2">Todo esto está incluido:</p>
                                    <div className="space-y-3">
                                        {[
                                            "Hosting en servidores ultrarrápidos",
                                            "Dominio web anual (www.tu-marca.com)",
                                            "Base de datos y almacenamiento en la nube",
                                            "Certificado de Seguridad SSL (candado HTTPS)",
                                            "Backups automáticos periódicos",
                                            "Actualizaciones y mantenimiento continuo",
                                            "Soporte directo por WhatsApp"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 bg-mint border-2 border-black shadow-neobrutalism-sm flex items-center justify-center flex-shrink-0">
                                                    <span aria-hidden="true" className="material-icons text-black text-[12px] sm:text-[14px] font-black leading-none">check</span>
                                                </div>
                                                <span className="min-w-0 font-bold text-white text-sm sm:text-base md:text-lg leading-snug">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-background-light p-6 md:p-10 lg:p-12 lg:w-2/5 flex flex-col justify-center relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                <h4 className="text-xl sm:text-2xl font-black uppercase mb-6 sm:mb-8 text-center decoration-wavy underline decoration-hot-coral decoration-2 underline-offset-4 relative z-10 bg-white inline-block px-3 py-1 sm:px-4 sm:py-2 border-2 border-black -rotate-1 shadow-neobrutalism mx-auto leading-tight">
                                    Valores Mensuales<br />
                                    <span className="text-[10px] sm:text-xs tracking-wide bg-black text-white px-2 py-0.5 mt-2 inline-block rotate-1 rounded-sm border border-black shadow-neobrutalism-primary">DE SOPORTE Y MANTENIMIENTO</span>
                                </h4>
                                <div className="space-y-4 sm:space-y-5 relative z-10">
                                    {/* Sale de los planes: cada uno con cuota aparece aca, en el
                                        orden del sitio. Antes eran tres filas escritas a mano con
                                        nombres fijos, y un plan nuevo o renombrado no aparecia. */}
                                    {conCuota.map(({ plan, cuota }, i) => (
                                        <div
                                            key={plan.id}
                                            className={`bg-white border-4 border-black ${SOMBRAS_CUOTA[i % SOMBRAS_CUOTA.length]} p-4 sm:p-5 rounded-xl flex flex-col justify-between transform transition-transform hover:-translate-y-1 relative overflow-hidden`}
                                        >
                                            {plan.payment_type === "Precio Base" && (
                                                <div className="absolute top-0 right-0 bg-accent-yellow text-black text-[9px] sm:text-[10px] font-black px-2 py-0.5 border-b-2 border-l-2 border-black shadow-neobrutalism-sm rounded-bl-lg z-10 uppercase tracking-wider">
                                                    Precio Base
                                                </div>
                                            )}
                                            <div className={`flex flex-wrap justify-between items-center gap-2 w-full ${plan.payment_type === "Precio Base" ? "mt-2" : ""}`}>
                                                <span className="font-bold text-sm sm:text-base md:text-lg uppercase min-w-0">{plan.name}</span>
                                                <div className="flex items-end text-black relative bg-background-light px-2 sm:px-3 py-1 border-2 border-black rounded-lg shadow-neobrutalism-sm">
                                                    <span className="font-black text-xl sm:text-2xl md:text-3xl">{formatearPesos(cuota)}</span>
                                                    <span className="font-bold text-ink-black/70 mb-0.5 sm:mb-1 ml-1 text-[10px] sm:text-xs md:text-sm">/mes</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 sm:mt-10 flex w-full relative z-10">
                                    <div className="flex-1 items-center justify-center gap-2 sm:gap-3 bg-hot-coral border-4 border-black px-4 py-3 sm:py-4 rounded-xl shadow-neobrutalism flex flex-row hover:-translate-y-1 hover:shadow-neobrutalism-lg transition-transform cursor-default">
                                        <span aria-hidden="true" className="material-icons text-ink-black text-xl sm:text-2xl font-black">lock_open</span>
                                        <p className="text-[11px] sm:text-sm md:text-base font-black text-ink-black uppercase tracking-wider text-center">¡Sin ataduras! Cancelá cuando quieras.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </details>
                )}

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
