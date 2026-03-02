import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

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

function isAllowedTable(table: string): table is AllowedTable {
    return ALLOWED_TABLES.includes(table as AllowedTable);
}

async function checkAuth() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
}

// GET — List all records
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;
    if (!isAllowedTable(table)) {
        return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const { supabase, user } = await checkAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        // fallback ordering if sort_order doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
            .from(table)
            .select("*")
            .order("created_at", { ascending: false });

        if (fallbackError) {
            return NextResponse.json({ error: fallbackError.message }, { status: 500 });
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
        return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const { supabase, user } = await checkAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
        .from(table)
        .insert(body)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
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
        return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const { supabase, user } = await checkAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
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
        return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const { supabase, user } = await checkAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
