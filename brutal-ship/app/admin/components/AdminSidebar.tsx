"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/presupuestos", label: "Presupuestos", icon: "🧾" },
    { href: "/admin/clientes", label: "Clientes", icon: "👥" },
    { href: "/admin/precios", label: "Precios", icon: "💰" },
    { href: "/admin/portafolio", label: "Portafolio", icon: "🎨" },
    { href: "/admin/testimonios", label: "Testimonios", icon: "💬" },
    { href: "/admin/faqs", label: "FAQs", icon: "❓" },
    { href: "/admin/config", label: "Configuración", icon: "⚙️" },
    { href: "/admin/leads", label: "Leads", icon: "📬" },
];

/**
 * En compu es la columna de la izquierda. En el celular no entra: pasa a ser una
 * barra arriba, con el logo y las salidas en una fila y el menú en otra que se
 * desliza de costado.
 */
export default function AdminSidebar() {
    const pathname = usePathname();
    const nav = useRef<HTMLElement>(null);

    // En el celular el menú se desliza de costado: que la sección abierta quede a la vista.
    useEffect(() => {
        nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [pathname]);

    return (
        <aside className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b-2 border-white/10 bg-[#1e1530] print:hidden lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r-2">
            {/* Logo */}
            <div className="px-4 py-3 lg:border-b-2 lg:border-white/10 lg:p-6">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-sm border-2 border-black shadow-neobrutalism-sm flex items-center justify-center">
                        <span className="text-white font-black text-lg font-body">L</span>
                    </div>
                    <div>
                        <h1 className="text-white font-black text-lg font-body tracking-tight">
                            LOGIKA
                        </h1>
                        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
                            Admin Panel
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav ref={nav} className="col-span-2 row-start-2 flex gap-1 overflow-x-auto px-4 pb-3 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:overflow-visible lg:p-4">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-sm border-2 px-3 py-2 text-sm font-bold transition-all lg:gap-3 lg:px-4 lg:py-3 ${isActive
                                    ? "bg-primary text-white border-black shadow-neobrutalism-sm"
                                    : "border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="flex items-center gap-1 px-4 lg:block lg:space-y-2 lg:border-t-2 lg:border-white/10 lg:p-4">
                <Link
                    href="/"
                    target="_blank"
                    aria-label="Ver sitio"
                    className="flex items-center gap-3 rounded-sm px-3 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors lg:px-4"
                >
                    <span aria-hidden="true">🌐</span>
                    <span className="hidden lg:inline">Ver sitio</span>
                </Link>
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        aria-label="Cerrar sesión"
                        className="w-full flex items-center gap-3 px-3 py-2 text-hot-coral hover:bg-hot-coral/10 rounded-sm text-sm font-bold transition-all lg:px-4"
                    >
                        <span aria-hidden="true">🚪</span>
                        <span className="hidden lg:inline">Cerrar sesión</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
