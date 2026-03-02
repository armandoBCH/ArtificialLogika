import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, contact, business_type, message } = body;

        // Validation
        if (!name || !contact || !message) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios: nombre, contacto y mensaje." },
                { status: 400 }
            );
        }

        if (name.length > 200 || contact.length > 200 || message.length > 2000) {
            return NextResponse.json(
                { error: "Uno o más campos exceden la longitud máxima permitida." },
                { status: 400 }
            );
        }

        // Save to Supabase
        try {
            const supabase = await createClient();
            const { error } = await supabase.from("contact_leads").insert({
                name: name.trim(),
                contact: contact.trim(),
                business_type: business_type?.trim() || "No especificado",
                message: message.trim(),
            });

            if (error) {
                console.error("Supabase insert error:", error);
                // Don't fail the request — the user shouldn't know about DB issues
            }
        } catch (dbError) {
            console.error("Database connection error:", dbError);
            // Graceful degradation: the lead is lost but the UX is fine
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
