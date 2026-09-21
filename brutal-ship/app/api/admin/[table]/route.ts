import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Generic CRUD API for admin tables
const ALLOWED_TABLES = [
    "site_config",
    "pricing_plans",
    "portfolio_projects",
    "testimonials",
    "faqs",
    "contact_leads",
    "quotes",
    "quote_catalog",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

// Allowed fields per table (whitelist approach)
const ALLOWED_FIELDS: Record<AllowedTable, string[]> = {
    site_config: ["key", "value", "type", "description", "is_active"],
    pricing_plans: [
        "name", "subtitle", "price", "original_price", "currency",
        "payment_type", "price_note", "features", "is_featured",
        "featured_label", "monthly_price", "cta_text", "cta_style", "header_bg",
        "display_order", "is_active",
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
    // `number` no esta: lo asigna la base y es el correlativo que ve el cliente.
    quotes: ["client_name", "title", "status", "total", "data"],
    quote_catalog: [
        "name", "description", "price", "unit", "category",
        "is_recurring", "display_order", "is_active",
    ],
};

function isAllowedTable(table: string): table is AllowedTable {
    return ALLOWED_TABLES.includes(table as AllowedTable);
}

// Tablas que se ven en el sitio publico. Las paginas publicas son estaticas
// (ISR): sin esto, un cambio guardado en el panel tardaba hasta que vencia el
// `revalidate` de cada una en aparecer. Se regenera todo el arbol, incluidas
// las imagenes de vista previa, porque site_config toca el navbar y el footer
// de todas las paginas.
const TABLAS_PUBLICAS: ReadonlySet<AllowedTable> = new Set([
    "site_config",
    "pricing_plans",
    "portfolio_projects",
    "testimonials",
    "faqs",
]);

function refrescarSitioPublico(table: AllowedTable) {
    if (TABLAS_PUBLICAS.has(table)) revalidatePath("/", "layout");
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

// Tope defensivo del reordenamiento masivo: ningun listado del admin se acerca.
const MAX_REORDER_ITEMS = 200;

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

    // El desempate va ascendente igual que en el sitio publico (lib/data/*).
    // Hoy los proyectos comparten display_order 0, asi que el desempate es el
    // orden real: con `descending` el admin mostraba la lista al reves de lo que
    // ve el visitante. Esta rama solo corre para las tablas que tienen
    // display_order; el resto cae al fallback de abajo, que sigue siendo
    // "lo mas nuevo primero".
    const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

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

    refrescarSitioPublico(table);
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

    refrescarSitioPublico(table);
    return NextResponse.json(data);
}

// PATCH — Bulk reorder (display_order only)
//
// Un drag & drop toca N filas de una. Mandarlas como N PUT choca con el rate
// limit de 30/min y deja el orden a medio guardar si una falla. Por eso el
// reordenamiento entra por un solo request, y solo puede escribir display_order.
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;
    if (!isAllowedTable(table)) {
        return NextResponse.json({ error: "Tabla inválida" }, { status: 400 });
    }

    if (!ALLOWED_FIELDS[table].includes("display_order")) {
        return NextResponse.json({ error: "Esta tabla no se puede reordenar" }, { status: 400 });
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

    const body = await request.json();
    const rawItems: unknown = body?.items;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
        return NextResponse.json({ error: "Se esperaba una lista de items" }, { status: 400 });
    }
    if (rawItems.length > MAX_REORDER_ITEMS) {
        return NextResponse.json(
            { error: `No se pueden reordenar más de ${MAX_REORDER_ITEMS} items a la vez` },
            { status: 400 }
        );
    }

    const items: { id: string; display_order: number }[] = [];
    const seen = new Set<string>();
    for (const raw of rawItems) {
        const id = (raw as { id?: unknown })?.id;
        const order = (raw as { display_order?: unknown })?.display_order;
        if (typeof id !== "string" || !id) {
            return NextResponse.json({ error: "ID válido requerido en cada item" }, { status: 400 });
        }
        if (seen.has(id)) {
            return NextResponse.json({ error: "IDs repetidos en la lista" }, { status: 400 });
        }
        if (typeof order !== "number" || !Number.isInteger(order) || order < 0 || order > 100000) {
            return NextResponse.json({ error: "display_order debe ser un entero válido" }, { status: 400 });
        }
        seen.add(id);
        items.push({ id, display_order: order });
    }

    // De a tandas para no abrir cien conexiones de golpe contra Supabase.
    const CHUNK = 25;
    for (let i = 0; i < items.length; i += CHUNK) {
        const chunk = items.slice(i, i + CHUNK);
        const results = await Promise.all(
            chunk.map(({ id, display_order }) =>
                supabase.from(table).update({ display_order }).eq("id", id)
            )
        );
        const failed = results.find((r) => r.error);
        if (failed?.error) {
            console.error(`Admin PATCH ${table} reorder error:`, failed.error);
            return NextResponse.json({ error: "Error al guardar el orden" }, { status: 500 });
        }
    }

    refrescarSitioPublico(table);
    return NextResponse.json({ success: true, updated: items.length });
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

    refrescarSitioPublico(table);
    return NextResponse.json({ success: true });
}
