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
        // En el celular el menú va arriba (columna); desde lg, a la izquierda.
        <div className="flex min-h-screen flex-col bg-[#191121] font-body lg:flex-row print:block print:min-h-0 print:bg-white">
            <AdminSidebar />
            <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-x-clip print:p-0">{children}</main>
        </div>
    );
}
