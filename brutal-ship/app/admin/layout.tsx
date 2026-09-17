import AdminSidebar from "./components/AdminSidebar";

export const metadata = {
    title: "Admin — Logika",
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // `overflow-x-clip` y no `overflow-auto`: un contenedor con scroll propio anula
        // el `sticky` de adentro, y la barra de acciones del presupuestador lo necesita.
        <div className="flex min-h-screen bg-[#191121] font-body print:block print:min-h-0 print:bg-white">
            <AdminSidebar />
            <main className="min-w-0 flex-1 p-8 overflow-x-clip print:p-0">{children}</main>
        </div>
    );
}
