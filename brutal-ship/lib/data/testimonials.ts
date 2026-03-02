import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types/database";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        id: "1",
        name: "María López",
        role: "Dueña de Peluquería",
        quote: "Yo no sabía nada de páginas web, pero ellos se encargaron de absolutamente todo. En dos semanas ya tenía mi sitio funcionando y ahora mis clientes me encuentran por Google. Antes ni existía online.",
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkYW0Flt0xW1Z3HB3NQwCqzJaGgTOWrUXGCNluYmymfDWoJiDh-UQh0Hdx9NWuTx_qiQdr2KzeaMkZ7N-QQl-4dkzIoTTSGaeaZ2tbzIGEJElJLhGWd7ydROujN0ENIj2UpffcTf9t4guY8he-CwCnCEMKa7QKx-3PXBAKeNM6IVxxsNb5-fd8qJOzrfCMg5_jfSEb9mfICiqS2r2p2IlfH-kkOZFsh6HwhgsxB1gpdvi7ThCjXF-CiziTu_MG8QUi-jcjVj54rUI",
        badge_text: "Servicios",
        badge_color: "bg-electric-blue/20 text-electric-blue",
        display_order: 1,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "2",
        name: "Carlos Ruiz",
        role: "Dueño de Restaurante",
        quote: "Les pasé las fotos, el menú y ellos hicieron todo. Ahora recibo reservas directo desde la web y por WhatsApp. Antes dependía 100% del boca a boca.",
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQAEL7ldXO17P2zxbs1YngIHQKE24NCKGj4oHGt_U2jG0qZlQJYr5_JnXBJDR2YGgjx92YrRE0A1VBRzREbR7mT3awaWFn2PLGLhFbdroVUJNp2fTW9nA2xy0EXhcPunUx9Os-ruZSBCW7eK-AEGwD9FP-TnJ6vU27MmbXLnT3QBUELyLnEkDzq5PyYCWaZaiA2RMtrwwH9Qhr4aeOIBEk5InS3zW5OPrNNoCM6Tsy1tH3DmPWRd3ajGeYXrv4ejWcHDK3jjmO13U",
        badge_text: "Gastronomía",
        badge_color: "bg-mint/20 text-teal-700",
        display_order: 2,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "3",
        name: "Ana Torres",
        role: "Abogada Independiente",
        quote: "Tenía una web vieja que no generaba confianza. Me hicieron una nueva profesional y las consultas por WhatsApp se triplicaron en el primer mes. Ahora la gente me contacta sin que yo busque clientes.",
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwUxH3A7ZLuocQWfDb9tQet8_f_6u-oQQpVWTMjdpLmOS5ImkWGQ2yJOHKDj85TOdQwFhcPYptf-mugD8IWQ-w4sNC4AtJZ9J_ffQF2JxVbGqj6YfDTGIfTt3X-3p2TRPQA6g8DHQcqy6mRejoSOGIYJXeeyvv8idqZO85dwqI2a8ODmJu4qRIbVLPKefJoPsqoWl_70pqnl3Vn55pSEj4bF0QYnlSAdTcnI_Si2joxXY0K-47AmnvN-m4KWktQo8UD4nWuZCLBgQ",
        badge_text: "Profesional",
        badge_color: "bg-hot-coral/20 text-red-700",
        display_order: 3,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
];

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error || !data || data.length === 0) {
            return DEFAULT_TESTIMONIALS;
        }

        return data as Testimonial[];
    } catch {
        return DEFAULT_TESTIMONIALS;
    }
}
