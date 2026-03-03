import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Generic CRUD API for admin tables
const ALLOWED_TABLES = [
    "site_config",
    "pricing_plans",
    "services",
    "portfolio_projects",
    "testimonials",
    "faqs",
    "contact_leads",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

// Allowed fields per table (whitelist approach)
const ALLOWED_FIELDS: Record<AllowedTable, string[]> = {
    site_config: ["key", "value", "type", "description", "is_active"],
    pricing_plans: [
        "name", "subtitle", "price", "original_price", "currency",
        "payment_type", "price_note", "features", "is_featured",
        "featured_label", "cta_text", "cta_style", "header_bg",
        "display_order", "is_active",
    ],
    services: [
        "name", "description", "price_from", "icon", "icon_color",
        "accent_color", "features", "is_popular", "popular_label",
        "cta_text", "cta_style", "display_order", "is_active",
    ],
    portfolio_projects: [
        "title", "category", "categories", "tags", "description", "description_long",
        "image_url", "image_url_wide", "image_alt", "accent_color", "stats",
        "display_order", "is_active", "is_sample", "external_url",
        "applied_services", "applied_features",
    ],
    testimonials: [
        "name", "role", "quote", "avatar_url", "badge_text",
        "badge_color", "display_order", "is_active",
    ],
    faqs: ["question", "answer", "display_order", "is_active"],
    contact_leads: [], // Read-only + delete only, no inserts/updates from admin
};

function isAllowedTable(table: string): table is AllowedTable {
    return ALLOWED_TABLES.includes(table as AllowedTable);
}

/** Strip any fields not in the whitelist for a given table */
function sanitizeBody(table: AllowedTable, body: Record<string, unknown>): Record<string, unknown> {
    const allowed = ALLOWED_FIELDS[table];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowed) {
        if (key in body) {
            sanitized[key] = body[key];
        }
    }
    return sanitized;
}

/** Verify user is authenticated AND is the admin */
async function checkAdminAuth() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { supabase, user: null, isAdmin: false };
    }

    // Only allow the specific admin email
    const isAdmin = user.email === "armadobeatochang@gmail.com";
    return { supabase, user, isAdmin };
}

// Rate limit: 30 requests per minute per IP for admin operations
const ADMIN_RATE_LIMIT = 30;
const ADMIN_WINDOW_MS = 60_000;

// GET — List all records
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;
    if (!isAllowedTable(table)) {
        return NextResponse.json({ error: "Tabla inválida" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const limiter = rateLimit(`admin:${ip}`, ADMIN_RATE_LIMIT, ADMIN_WINDOW_MS);
    if (!limiter.success) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes" },
            { status: 429, headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) } }
        );
    }

    const { supabase, isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        // fallback ordering if display_order doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
            .from(table)
            .select("*")
            .order("created_at", { ascending: false });

        if (fallbackError) {
            console.error(`Admin GET ${table} error:`, fallbackError);
            return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
        }
        return NextResponse.json(fallbackData);
    }

    return NextResponse.json(data);
}

// POST — Create a record
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;
    if (!isAllowedTable(table)) {
        return NextResponse.json({ error: "Tabla inválida" }, { status: 400 });
    }

    if (table === "contact_leads") {
        return NextResponse.json({ error: "Operación no permitida" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const limiter = rateLimit(`admin:${ip}`, ADMIN_RATE_LIMIT, ADMIN_WINDOW_MS);
    if (!limiter.success) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes" },
            { status: 429, headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) } }
        );
    }

    const { supabase, isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const rawBody = await request.json();
    const body = sanitizeBody(table, rawBody);

    if (Object.keys(body).length === 0) {
        return NextResponse.json({ error: "No hay campos válidos para insertar" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from(table)
        .insert(body)
        .select()
        .single();

    if (error) {
        console.error(`Admin POST ${table} error:`, error);
        return NextResponse.json({ error: "Error al crear registro" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}

// PUT — Update a record
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;
    if (!isAllowedTable(table)) {
        return NextResponse.json({ error: "Tabla inválida" }, { status: 400 });
    }

    if (table === "contact_leads") {
        return NextResponse.json({ error: "Operación no permitida" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const limiter = rateLimit(`admin:${ip}`, ADMIN_RATE_LIMIT, ADMIN_WINDOW_MS);
    if (!limiter.success) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes" },
            { status: 429, headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) } }
        );
    }

    const { supabase, isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const rawBody = await request.json();
    const { id, ...rawUpdates } = rawBody;

    if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "ID válido requerido" }, { status: 400 });
    }

    const updates = sanitizeBody(table, rawUpdates);

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No hay campos válidos para actualizar" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`Admin PUT ${table} error:`, error);
        return NextResponse.json({ error: "Error al actualizar registro" }, { status: 500 });
    }

    return NextResponse.json(data);
}

// DELETE — Delete a record
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;
    if (!isAllowedTable(table)) {
        return NextResponse.json({ error: "Tabla inválida" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const limiter = rateLimit(`admin:${ip}`, ADMIN_RATE_LIMIT, ADMIN_WINDOW_MS);
    if (!limiter.success) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes" },
            { status: 429, headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) } }
        );
    }

    const { supabase, isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "ID válido requerido" }, { status: 400 });
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
        console.error(`Admin DELETE ${table} error:`, error);
        return NextResponse.json({ error: "Error al eliminar registro" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
