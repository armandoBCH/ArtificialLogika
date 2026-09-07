"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useReducedMotion } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";
import LogikaLogo from "./LogikaLogo";
import type { SiteConfigMap } from "@/lib/types/database";

interface NavbarProps {
    config: SiteConfigMap;
}

/** Una sola lista para escritorio y móvil: cuando se mantienen por separado
 *  siempre terminan divergiendo (ya había pasado: la nav apuntaba a #servicios,
 *  una sección que ya no existe). `soloMovil` marca las que caben en el panel
 *  pero saturarían la barra horizontal. */
/* Dos etiquetas no coincidian con su seccion:

   - "Como funciona" apuntaba a #quien-hace-que, cuyo titulo es "Tu parte del
     trabajo". Como funciona describe al PROCESO, asi que habia dos entradas que
     sonaban igual y la primera llevaba al lugar equivocado.
   - "Planes" apuntaba a #precios, titulado "Que recibis y cuanto sale". Precios
     es la palabra que la gente busca y la que usa la seccion.

   Los colores de hover tambien se limpiaron. Habia cinco hex sueltos, uno de
   ellos (#4A90FF) fuera de la paleta y otro (#FF6B6B) un casi-acierto del token
   hot-coral (#FF5A5F). Un color por entrada no comunicaba nada: era un arcoiris
   arbitrario. Ahora hay un solo acento, que es el de la marca. */
const SECCIONES = [
    { href: "#quien-hace-que", etiqueta: "Quién hace qué", soloMovil: false },
    { href: "#proceso", etiqueta: "Cómo funciona", soloMovil: true },
    { href: "/portafolio", etiqueta: "Trabajos", soloMovil: false },
    { href: "#quienes-somos", etiqueta: "Nosotros", soloMovil: true },
    { href: "#clientes", etiqueta: "Clientes", soloMovil: true },
    { href: "#garantia", etiqueta: "Garantía", soloMovil: true },
    { href: "#precios", etiqueta: "Precios", soloMovil: false },
    { href: "#faq", etiqueta: "Preguntas", soloMovil: false },
];

export default function Navbar({ config }: NavbarProps) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const getHref = (hash: string) => isHome ? hash : `/${hash}`;

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || 'Hola! Quiero consultar por una web para mi negocio')}`;
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // El stagger del panel entra en cascada. Con reduced-motion las entradas
    // aparecen ya puestas, sin desplazamiento ni retardo.
    const sinMovimiento = useReducedMotion();

    const menuRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Esconder al bajar, revelar al subir: subir es el gesto que pide el menú.
        // Antes había dos ramas idénticas separadas por `isMobile`, que no distinguían nada.
        setHidden(latest > previous && latest > 100);
    });

    // Salidas del menú móvil. Sin esto, la única forma de cerrarlo era volver a
    // encontrar la hamburguesa: ni Escape, ni tocar afuera, y el foco se escapaba
    // del panel abierto hacia el resto de la página.
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const cerrar = () => {
            setIsMobileMenuOpen(false);
            hamburgerRef.current?.focus();
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                cerrar();
                return;
            }
            if (e.key !== "Tab" || !menuRef.current) return;
            const focusables = menuRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusables.length === 0) return;
            const primero = focusables[0];
            const ultimo = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primero.focus();
            }
        };

        const onPointerDown = (e: PointerEvent) => {
            const t = e.target as Node;
            if (menuRef.current?.contains(t) || hamburgerRef.current?.contains(t)) return;
            cerrar();
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [isMobileMenuOpen]);

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-150%" }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-3 sm:top-4 md:top-6 left-0 right-0 z-50 px-3 sm:px-4 flex justify-center w-full pointer-events-none"
        >
            <div className="w-full max-w-7xl pointer-events-auto relative">
                <div className="bg-white border-2 border-black rounded-xl shadow-neobrutalism flex justify-between h-14 sm:h-16 md:h-20 items-center px-3 sm:px-4 md:px-6 transition-all overflow-hidden">
                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0 min-w-0">
                        <Link href="/" aria-label="Logika — ir al inicio" className="flex items-center gap-2 min-h-11">
                            <LogikaLogo className="h-8 sm:h-10 md:h-14 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {SECCIONES.filter((x) => !x.soloMovil).map((x) => {
                            const clase = "cta inline-flex items-center min-h-11 px-3 xl:px-4 py-2 text-sm xl:text-base font-bold uppercase tracking-wider text-ink-black border-2 border-transparent hover:border-black hover:bg-primary hover:text-white rounded-lg hover:shadow-neobrutalism-sm hover:-translate-y-[2px] transition-all";
                            return x.href.startsWith("/") ? (
                                <Link key={x.href} className={clase} href={x.href}>{x.etiqueta}</Link>
                            ) : (
                                <a key={x.href} className={clase} href={getHref(x.href)}>{x.etiqueta}</a>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                        <AnimatePresence>
                            {!isMobileMenuOpen && (
                                <motion.div
                                    // Solo opacidad: con `scale` el ancestro quedaba en 0.9 si la
                                    // animación no completaba, y el CTA medía 40px en vez de 44.
                                    // El tamaño táctil de un control no puede depender de una animación.
                                    initial={false}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MagneticWrapper>
                                        <a href={getHref("#contacto")} className="cta bg-primary hover:bg-primary/90 text-white border-2 border-black font-bold min-h-11 flex items-center py-2 px-4 sm:py-2.5 sm:px-6 xl:px-8 text-xs sm:text-sm xl:text-base uppercase tracking-wider rounded-xl transition-all block whitespace-nowrap shadow-neobrutalism-sm sm:shadow-neobrutalism-sm hover:shadow-neobrutalism-sm hover:translate-y-[2px] hover:translate-x-[2px]">
                                            Quiero mi web
                                        </a>
                                    </MagneticWrapper>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hamburger Button for Mobile */}
                        <button
                            ref={hamburgerRef}
                            className="lg:hidden w-11 h-11 border-2 border-black bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-neobrutalism-sm sm:shadow-neobrutalism-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            <span aria-hidden="true" className="material-icons text-[20px] sm:text-[24px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        // `initial` no declaraba opacity, asi que el panel aparecia de golpe
                        // y recien al cerrarse hacia fade. Entrada y salida son simetricas.
                        <motion.div
                            initial={sinMovimiento ? false : { opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            ref={menuRef}
                            id="mobile-menu"
                            className="lg:hidden absolute top-[110%] left-0 right-0 bg-white border-2 border-black rounded-xl shadow-neobrutalism flex flex-col p-4 z-40"
                        >
                            {/* Antes cada entrada llevaba su propia flecha: ocho flechas
                                identicas apiladas que no distinguian nada entre si.

                                Y todo el peso visual estaba en :hover, que en un telefono no
                                existe. El menu se veia como ocho lineas de texto sueltas hasta
                                que alguien tocaba una. Ahora los filetes separan las entradas
                                sin depender del puntero, y el estado presionado da la
                                devolucion que el hover daba en escritorio. */}
                            <ul className="flex flex-col divide-y-2 divide-black/10 px-2">
                                {SECCIONES.map((x, i) => {
                                    const clase = "cta flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-lg font-bold uppercase tracking-wide text-ink-black transition-colors hover:bg-primary hover:text-white";
                                    const contenido = (
                                        <>
                                            <span>{x.etiqueta}</span>
                                            <span
                                                aria-hidden="true"
                                                className="h-2 w-2 shrink-0 rounded-full bg-primary opacity-0 transition-opacity group-hover/item:opacity-100"
                                            />
                                        </>
                                    );
                                    return (
                                        <motion.li
                                            key={x.href}
                                            className="group/item"
                                            initial={sinMovimiento ? false : { opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.22, delay: sinMovimiento ? 0 : 0.03 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            {x.href.startsWith("/") ? (
                                                <Link href={x.href} onClick={() => setIsMobileMenuOpen(false)} className={clase}>{contenido}</Link>
                                            ) : (
                                                <a href={getHref(x.href)} onClick={() => setIsMobileMenuOpen(false)} className={clase}>{contenido}</a>
                                            )}
                                        </motion.li>
                                    );
                                })}
                            </ul>
                            <div className="px-2">
                                <div className="mt-4">
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-ink-black border-2 border-black font-extrabold py-4 px-6 text-xl shadow-neobrutalism active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 rounded-xl transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
