import { createPublicClient } from "@/lib/supabase/public";
import type { Testimonial } from "@/lib/types/database";

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error) {
            console.error("[getTestimonials]", error.message);
            return [];
        }

        return (data as Testimonial[]) ?? [];
    } catch {
        return [];
    }
}
