"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";
import type { SiteConfigMap } from "@/lib/types/database";

interface NavbarProps {
    config: SiteConfigMap;
}

export default function Navbar({ config }: NavbarProps) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const getHref = (hash: string) => isHome ? hash : `/${hash}`;

    const whatsappUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || 'Hola! Quiero consultar por una web para mi negocio')}`;
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (isMobile) {
            // Mobile: Hide navbar if scrolling up and past the hero section
            if (latest < previous && latest > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
        } else {
            // Desktop: Hide navbar if scrolling down and past the hero section
            if (latest > previous && latest > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
        }
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-150%" }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 flex justify-center w-full pointer-events-none"
        >
            <div className="w-full max-w-7xl pointer-events-auto relative">
                <div className="bg-white dark:bg-background-dark border-2 border-black rounded-2xl shadow-neobrutalism flex justify-between h-16 md:h-20 items-center px-4 md:px-6 transition-all">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary border-2 border-black rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg md:text-xl">A</span>
                        </div>
                        <a href="/" className="text-xl md:text-2xl font-bold tracking-tighter uppercase hidden sm:block text-ink-black dark:text-white">
                            Artificial<span className="text-primary">Logika</span>
                        </a>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center space-x-6 lg:space-x-8">
                        <a className="text-black dark:text-white font-bold hover:text-primary transition-colors text-sm uppercase tracking-wide" href={getHref("#servicios")}>Servicios</a>
                        <a className="text-black dark:text-white font-bold hover:text-primary transition-colors text-sm uppercase tracking-wide" href={getHref("#proceso")}>Proceso</a>
                        <a className="text-black dark:text-white font-bold hover:text-primary transition-colors text-sm uppercase tracking-wide" href="/portafolio">Trabajos</a>
                        <a className="text-black dark:text-white font-bold hover:text-primary transition-colors text-sm uppercase tracking-wide" href={getHref("#precios")}>Precios</a>
                        <a className="text-black dark:text-white font-bold hover:text-primary transition-colors text-sm uppercase tracking-wide" href={getHref("#clientes")}>Clientes</a>
                        <a className="text-black dark:text-white font-bold hover:text-primary transition-colors text-sm uppercase tracking-wide" href={getHref("#faq")}>FAQ</a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <AnimatePresence>
                            {!isMobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MagneticWrapper>
                                        <a href={getHref("#contacto")} className="bg-primary hover:bg-primary/90 text-white border-2 border-black font-bold py-2 px-4 md:px-6 text-sm md:text-base rounded-xl transition-all block whitespace-nowrap shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-y-[1px] hover:translate-x-[1px]">
                                            Contactanos
                                        </a>
                                    </MagneticWrapper>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hamburger Button for Mobile */}
                        <button
                            className="lg:hidden w-10 h-10 border-2 border-black bg-white dark:bg-zinc-800 dark:text-white rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="lg:hidden absolute top-[110%] left-0 right-0 bg-white dark:bg-background-dark border-2 border-black rounded-2xl shadow-neobrutalism flex flex-col p-4 z-40"
                        >
                            <div className="flex flex-col gap-2">
                                <a href={getHref("#servicios")} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase py-3 border-b-2 border-gray-100 flex items-center justify-between hover:text-primary transition-colors text-ink-black dark:text-white">Servicios <span className="material-icons text-gray-400">arrow_forward</span></a>
                                <a href={getHref("#proceso")} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase py-3 border-b-2 border-gray-100 flex items-center justify-between hover:text-primary transition-colors text-ink-black dark:text-white">Proceso <span className="material-icons text-gray-400">arrow_forward</span></a>
                                <a href="/portafolio" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase py-3 border-b-2 border-gray-100 flex items-center justify-between hover:text-primary transition-colors text-ink-black dark:text-white">Trabajos <span className="material-icons text-gray-400">arrow_forward</span></a>
                                <a href={getHref("#precios")} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase py-3 border-b-2 border-gray-100 flex items-center justify-between hover:text-primary transition-colors text-ink-black dark:text-white">Precios <span className="material-icons text-gray-400">arrow_forward</span></a>
                                <a href={getHref("#clientes")} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase py-3 border-b-2 border-gray-100 flex items-center justify-between hover:text-primary transition-colors text-ink-black dark:text-white">Clientes <span className="material-icons text-gray-400">arrow_forward</span></a>
                                <a href={getHref("#faq")} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase py-3 border-b-2 border-gray-100 flex items-center justify-between hover:text-primary transition-colors text-ink-black dark:text-white">FAQ <span className="material-icons text-gray-400">arrow_forward</span></a>

                                <div className="mt-4 pt-2">
                                    <a
                                        href={getHref("#contacto")}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-ink-black border-2 border-black font-extrabold py-4 px-6 text-xl shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 rounded-xl transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
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
