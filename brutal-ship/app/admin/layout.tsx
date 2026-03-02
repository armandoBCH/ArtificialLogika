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
        <div className="flex min-h-screen bg-[#191121] font-display">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
