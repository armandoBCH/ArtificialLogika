"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/precios", label: "Precios", icon: "💰" },
    { href: "/admin/servicios", label: "Servicios", icon: "⚡" },
    { href: "/admin/portafolio", label: "Portafolio", icon: "🎨" },
    { href: "/admin/testimonios", label: "Testimonios", icon: "💬" },
    { href: "/admin/faqs", label: "FAQs", icon: "❓" },
    { href: "/admin/config", label: "Configuración", icon: "⚙️" },
    { href: "/admin/leads", label: "Leads", icon: "📬" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#1e1530] border-r-2 border-white/10 min-h-screen flex flex-col sticky top-0">
            {/* Logo */}
            <div className="p-6 border-b-2 border-white/10">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-sm border-2 border-black shadow-neobrutalism-sm flex items-center justify-center">
                        <span className="text-white font-black text-lg font-display">L</span>
                    </div>
                    <div>
                        <h1 className="text-white font-black text-lg font-display tracking-tight">
                            LOGIKA
                        </h1>
                        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
                            Admin Panel
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-all ${isActive
                                    ? "bg-primary text-white border-2 border-black shadow-neobrutalism-sm"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t-2 border-white/10 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                    <span>🌐</span>
                    Ver sitio
                </Link>
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-2 text-hot-coral hover:bg-hot-coral/10 rounded-sm text-sm font-bold transition-all"
                    >
                        <span>🚪</span>
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </aside>
    );
}
