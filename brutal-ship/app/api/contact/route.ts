import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Rate limit: 5 submissions per minute per IP
const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const limiter = rateLimit(`contact:${ip}`, MAX_REQUESTS, WINDOW_MS);

        if (!limiter.success) {
            return NextResponse.json(
                { error: "Demasiados intentos. Intentá de nuevo en un minuto." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(Math.ceil(limiter.resetIn / 1000)),
                    },
                }
            );
        }

        const body = await request.json();
        const { name, contact, business_type, message } = body;

        // Honeypot field — bots will fill this hidden field
        if (body._hp_email) {
            // Silently accept but don't save — the bot thinks it worked
            return NextResponse.json(
                { success: true, message: "¡Mensaje recibido! Te contactamos pronto." },
                { status: 200 }
            );
        }

        // Validation
        if (!name || !contact || !message) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios: nombre, contacto y mensaje." },
                { status: 400 }
            );
        }

        // Type validation
        if (
            typeof name !== "string" ||
            typeof contact !== "string" ||
            typeof message !== "string"
        ) {
            return NextResponse.json(
                { error: "Formato de datos inválido." },
                { status: 400 }
            );
        }

        if (name.length > 200 || contact.length > 200 || message.length > 2000) {
            return NextResponse.json(
                { error: "Uno o más campos exceden la longitud máxima permitida." },
                { status: 400 }
            );
        }

        // Basic content sanitization — strip HTML tags
        const sanitize = (str: string) =>
            str.replace(/<[^>]*>/g, "").trim();

        // Save to Supabase
        try {
            const supabase = await createClient();
            const { error } = await supabase.from("contact_leads").insert({
                name: sanitize(name),
                contact: sanitize(contact),
                business_type: sanitize(business_type || "") || "No especificado",
                message: sanitize(message),
            });

            if (error) {
                console.error("Supabase insert error:", error);
            }
        } catch (dbError) {
            console.error("Database connection error:", dbError);
        }

        return NextResponse.json(
            { success: true, message: "¡Mensaje recibido! Te contactamos pronto." },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { error: "Error al procesar el formulario. Intentá de nuevo." },
            { status: 500 }
        );
    }
}
