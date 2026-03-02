export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Override admin layout — login page has its own full-screen design
    return <>{children}</>;
}
