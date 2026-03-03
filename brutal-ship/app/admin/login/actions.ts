"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// Rate limit: 5 login attempts per minute per IP
const LOGIN_RATE_LIMIT = 5;
const LOGIN_WINDOW_MS = 60_000;

export async function login(formData: FormData) {
    // Rate limiting by IP
    const headersList = await headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headersList.get("x-real-ip") ??
        "unknown";

    const limiter = rateLimit(`login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_WINDOW_MS);
    if (!limiter.success) {
        return { error: "Demasiados intentos. Esperá un momento." };
    }

    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email y contraseña son requeridos" };
    }

    // Basic type/length validation
    if (typeof email !== "string" || typeof password !== "string") {
        return { error: "Formato inválido" };
    }

    if (email.length > 254 || password.length > 128) {
        return { error: "Credenciales inválidas" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Generic message — don't reveal if email exists or not
        return { error: "Credenciales inválidas" };
    }

    revalidatePath("/", "layout");
    redirect("/admin");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/admin/login");
}
