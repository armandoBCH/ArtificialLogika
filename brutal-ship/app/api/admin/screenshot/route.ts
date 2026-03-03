import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30; // Allow up to 30s for screenshot

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
        const { chromium } = await import("playwright");
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1280, height: 900 },
            deviceScaleFactor: 2, // Retina quality
        });
        const page = await context.newPage();

        // Navigate and wait for the page to fully load
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

        // Extra wait for CSS animations, lazy images, etc.
        await page.waitForTimeout(3000);

        // Take screenshot of the viewport (what the user sees first)
        const screenshotBuffer = await page.screenshot({
            type: "png",
            clip: { x: 0, y: 0, width: 1280, height: 900 },
        });

        await browser.close();

        // Convert to base64 data URL
        const base64 = screenshotBuffer.toString("base64");
        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ image: dataUrl, width: 1280, height: 900 });
    } catch (err) {
        console.error("Screenshot error:", err);
        return NextResponse.json(
            { error: `Error al capturar screenshot: ${err instanceof Error ? err.message : "desconocido"}` },
            { status: 500 }
        );
    }
}
