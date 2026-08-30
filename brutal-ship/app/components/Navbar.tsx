"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
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
const SECCIONES = [
    { href: "#quien-hace-que", etiqueta: "Cómo funciona", soloMovil: false, hover: "hover:bg-[#8523E1] hover:text-white" },
    { href: "#proceso", etiqueta: "Proceso", soloMovil: true, hover: "hover:bg-[#00D68F] hover:text-black" },
    { href: "/portafolio", etiqueta: "Trabajos", soloMovil: false, hover: "hover:bg-[#FF6B6B] hover:text-black" },
    { href: "#quienes-somos", etiqueta: "Nosotros", soloMovil: true, hover: "hover:bg-[#FDE047] hover:text-black" },
    { href: "#clientes", etiqueta: "Clientes", soloMovil: true, hover: "hover:bg-[#00D68F] hover:text-black" },
    { href: "#garantia", etiqueta: "Garantía", soloMovil: true, hover: "hover:bg-[#FDE047] hover:text-black" },
    { href: "#precios", etiqueta: "Planes", soloMovil: false, hover: "hover:bg-[#4A90FF] hover:text-white" },
    { href: "#faq", etiqueta: "FAQ", soloMovil: false, hover: "hover:bg-[#8523E1] hover:text-white" },
];

export default function Navbar({ config }: NavbarProps) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const getHref = (hash: string) => isHome ? hash : `/${hash}`;

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || 'Hola! Quiero consultar por una web para mi negocio')}`;
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                            const clase = `cta inline-flex items-center min-h-11 px-3 xl:px-4 py-2 text-sm xl:text-base font-bold uppercase tracking-wider text-ink-black border-2 border-transparent hover:border-black ${x.hover} rounded-lg hover:shadow-neobrutalism-sm hover:-translate-y-[2px] transition-all`;
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
                        <motion.div
                            initial={{ y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            ref={menuRef}
                            id="mobile-menu"
                            className="lg:hidden absolute top-[110%] left-0 right-0 bg-white border-2 border-black rounded-xl shadow-neobrutalism flex flex-col p-4 z-40"
                        >
                            <div className="flex flex-col gap-2 p-2">
                                {SECCIONES.map((x) => {
                                    const clase = `cta text-xl font-bold uppercase py-3 px-4 border-2 border-transparent hover:border-black ${x.hover} rounded-xl hover:shadow-neobrutalism hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all flex items-center justify-between text-ink-black`;
                                    const contenido = (
                                        <>
                                            {x.etiqueta}
                                            <span aria-hidden="true" className="material-icons opacity-70">arrow_forward</span>
                                        </>
                                    );
                                    return x.href.startsWith("/") ? (
                                        <Link key={x.href} href={x.href} onClick={() => setIsMobileMenuOpen(false)} className={clase}>{contenido}</Link>
                                    ) : (
                                        <a key={x.href} href={getHref(x.href)} onClick={() => setIsMobileMenuOpen(false)} className={clase}>{contenido}</a>
                                    );
                                })}

                                <div className="mt-4 pt-2">
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
