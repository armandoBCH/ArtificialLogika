import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

// Verify admin auth
async function checkAdminAuth() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    return user.email === "armadobeatochang@gmail.com";
}

export async function POST(request: NextRequest) {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "URL requerida" }, { status: 400 });
    }

    // Validate URL format
    try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            return NextResponse.json({ error: "URL inválida: solo HTTP/HTTPS" }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    try {
        // Use Microlink API — free screenshot service, no binaries needed
        const microlinkUrl = new URL("https://api.microlink.io");
        microlinkUrl.searchParams.set("url", url);
        microlinkUrl.searchParams.set("screenshot", "true");
        microlinkUrl.searchParams.set("meta", "false");
        microlinkUrl.searchParams.set("waitForTimeout", "3000");
        microlinkUrl.searchParams.set("viewport.width", "1280");
        microlinkUrl.searchParams.set("viewport.height", "900");
        microlinkUrl.searchParams.set("viewport.deviceScaleFactor", "2");

        const apiRes = await fetch(microlinkUrl.toString());
        if (!apiRes.ok) {
            throw new Error(`Microlink API respondió con ${apiRes.status}`);
        }

        const data = await apiRes.json();

        if (data.status !== "success" || !data.data?.screenshot?.url) {
            throw new Error(data.message || "No se pudo obtener el screenshot");
        }

        // Fetch the actual screenshot image
        const imgRes = await fetch(data.data.screenshot.url);
        if (!imgRes.ok) {
            throw new Error("No se pudo descargar la imagen del screenshot");
        }

        const imgBuffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(imgBuffer).toString("base64");
        const contentType = imgRes.headers.get("content-type") || "image/png";
        const dataUrl = `data:${contentType};base64,${base64}`;

        return NextResponse.json({ image: dataUrl, width: 1280, height: 900 });
    } catch (err) {
        console.error("Screenshot error:", err);
        return NextResponse.json(
            { error: `Error al capturar screenshot: ${err instanceof Error ? err.message : "desconocido"}` },
            { status: 500 }
        );
    }
}
