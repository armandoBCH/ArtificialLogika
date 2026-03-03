import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Verify admin auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "armadobeatochang@gmail.com") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { image, filename } = await request.json();
    if (!image || !filename) {
        return NextResponse.json({ error: "image y filename requeridos" }, { status: 400 });
    }

    // Validate filename formatting
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    if (!safeFilename.match(/\.(png|jpg|jpeg|webp)$/i)) {
        return NextResponse.json({ error: "El archivo debe ser .png, .jpg o .webp" }, { status: 400 });
    }

    try {
        // Parse base64 string and detect content type
        const base64Data = image.includes(",") ? image.split(",")[1] : image;
        const detectedType = image.includes("image/jpeg") ? "image/jpeg"
            : image.includes("image/webp") ? "image/webp"
                : "image/png";
        const buffer = Buffer.from(base64Data, "base64");

        // Use the existing supabase client to upload to "Images" bucket
        const { data, error } = await supabase
            .storage
            .from("Images")
            .upload(`portfolio/${safeFilename}`, buffer, {
                contentType: detectedType,
                upsert: true,
            });

        if (error) {
            console.error("Supabase Storage error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: publicUrlData } = supabase
            .storage
            .from("Images")
            .getPublicUrl(`portfolio/${safeFilename}`);

        return NextResponse.json({
            url: publicUrlData.publicUrl,
            filename: safeFilename,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { error: `Error al subir a Supabase: ${err instanceof Error ? err.message : "desconocido"}` },
            { status: 500 }
        );
    }
}
