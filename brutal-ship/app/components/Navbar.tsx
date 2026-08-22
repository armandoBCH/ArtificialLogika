"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";
import LogikaLogo from "./LogikaLogo";
import { trackWhatsAppClick } from "@/lib/analytics-events";
import type { SiteConfigMap } from "@/lib/types/database";

interface NavbarProps {
    config: SiteConfigMap;
}

const NAV_ITEMS = [
    { label: "Servicios", hash: "#servicios" },
    { label: "Proceso", hash: "#proceso" },
    { label: "Trabajos", href: "/portafolio" },
    { label: "Precios", hash: "#precios" },
    { label: "Clientes", hash: "#clientes" },
    { label: "FAQ", hash: "#faq" },
] as const;

export default function Navbar({ config }: NavbarProps) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const getHref = (hash: string) => (isHome ? hash : `/${hash}`);

    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    /**
     * Ocultar al bajar, mostrar al subir — en TODOS los tamaños.
     *
     * Antes la rama mobile estaba invertida: ocultaba la navbar al
     * scrollear hacia arriba, que es el gesto con el que el usuario
     * busca volver al menú. Encima StickyMobileCTA aparece con ese mismo
     * gesto, así que el menú se iba justo cuando aparecía la barra.
     * Ahora las dos siguen la convención de iOS, Chrome Android y el
     * patrón "scroll-away top app bar" de Material.
     */
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (isMobileMenuOpen) return; // con el menú abierto la navbar no se mueve
        setHidden(latest > previous && latest > 100);
    });

    const closeMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
        triggerRef.current?.focus();
    }, []);

    // Escape cierra, Tab queda atrapado dentro del menú mientras está abierto.
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                closeMenu();
                return;
            }
            if (e.key !== "Tab" || !menuRef.current) return;

            const focusables = menuRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        // El primer link recibe el foco al abrir.
        menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isMobileMenuOpen, closeMenu]);

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(
        config.whatsapp_message || "Hola! Quiero consultar por una web para mi negocio"
    )}`;

    /**
     * Un solo tratamiento de hover para los seis ítems.
     * Antes cada uno tenía un color distinto (#8523E1, #00D68F, #FF6B6B,
     * #4A90FF, #FFD93D) sin ningún significado: el violeta dejaba de
     * leerse como "acá se hace clic" y el azul con texto blanco daba
     * 3.12:1, por debajo del mínimo AA.
     */
    const linkClass =
        "px-3 xl:px-4 py-2 text-sm xl:text-base font-bold uppercase tracking-wider " +
        "text-ink-black dark:text-white border-2 border-transparent rounded-lg " +
        "hover:border-black dark:hover:border-white hover:bg-primary hover:text-white " +
        "hover:shadow-elev-1 hover:-translate-y-[2px] transition-all duration-150";

    return (
        <motion.nav
            variants={{ visible: { y: 0 }, hidden: { y: "-150%" } }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            aria-label="Navegación principal"
            className="fixed top-3 sm:top-4 md:top-6 left-0 right-0 z-50 px-3 sm:px-4 flex justify-center w-full pointer-events-none"
        >
            <div className="w-full max-w-7xl pointer-events-auto relative">
                <div className="bg-white dark:bg-night-raised border-2 border-black rounded-2xl shadow-elev-2 flex justify-between h-14 sm:h-16 md:h-20 items-center px-3 sm:px-4 md:px-6 transition-all overflow-hidden">
                    <div className="flex items-center gap-2 shrink-0 min-w-0">
                        <Link href="/" className="flex items-center gap-2" aria-label="Logika — Inicio">
                            <LogikaLogo className="h-8 sm:h-10 md:h-14 w-auto" />
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {NAV_ITEMS.map((item) => (
                            "href" in item ? (
                                <Link key={item.label} className={linkClass} href={item.href}>
                                    {item.label}
                                </Link>
                            ) : (
                                <a key={item.label} className={linkClass} href={getHref(item.hash!)}>
                                    {item.label}
                                </a>
                            )
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <AnimatePresence>
                            {!isMobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MagneticWrapper>
                                        <a
                                            href={getHref("#contacto")}
                                            className="bg-primary hover:bg-primary-dark text-white border-2 border-black font-bold py-2 px-4 sm:py-2.5 sm:px-6 xl:px-8 text-xs sm:text-sm xl:text-base uppercase tracking-wider rounded-xl transition-all block whitespace-nowrap shadow-elev-1 hover:shadow-elev-0 hover:translate-y-[2px] hover:translate-x-[2px]"
                                        >
                                            Contactanos
                                        </a>
                                    </MagneticWrapper>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 44x44 (Apple HIG / Material 48dp). Antes era 36x36. */}
                        <button
                            ref={triggerRef}
                            type="button"
                            className="lg:hidden w-11 h-11 border-2 border-black dark:border-white bg-white dark:bg-night-raised dark:text-white rounded-xl flex items-center justify-center shadow-elev-1 active:shadow-elev-0 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                            onClick={() => (isMobileMenuOpen ? closeMenu() : setIsMobileMenuOpen(true))}
                            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="menu-mobile"
                        >
                            {/* SVG inline, no ligadura: es el unico acceso al
                                menu en mobile y no puede depender de que
                                cargue una fuente externa. */}
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                {isMobileMenuOpen ? (
                                    <path d="M6 6l12 12M18 6L6 18" />
                                ) : (
                                    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            id="menu-mobile"
                            ref={menuRef}
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="lg:hidden absolute top-[110%] left-0 right-0 bg-white dark:bg-night-raised border-2 border-black dark:border-white rounded-2xl shadow-elev-2 flex flex-col p-4 z-40"
                        >
                            <div className="flex flex-col gap-2 p-2">
                                {NAV_ITEMS.map((item) => (
                                    <a
                                        key={item.label}
                                        href={"href" in item ? item.href : getHref(item.hash!)}
                                        onClick={closeMenu}
                                        className="text-xl font-bold uppercase py-3 px-4 border-2 border-transparent rounded-xl text-ink-black dark:text-white hover:border-black dark:hover:border-white hover:bg-primary hover:text-white hover:shadow-elev-2 hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all flex items-center justify-between"
                                    >
                                        {item.label}
                                        <span aria-hidden="true" className="material-icons opacity-70">
                                            arrow_forward
                                        </span>
                                    </a>
                                ))}

                                <div className="mt-2">
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                            trackWhatsAppClick("navbar_mobile");
                                            closeMenu();
                                        }}
                                        className="w-full bg-whatsapp hover:bg-[#20BD5A] text-ink-black border-2 border-black font-extrabold py-4 px-6 text-xl shadow-elev-2 active:shadow-elev-0 active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 rounded-xl transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Escribinos
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
