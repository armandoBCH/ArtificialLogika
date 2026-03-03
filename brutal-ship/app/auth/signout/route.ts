import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        await supabase.auth.signOut();
    }

    revalidatePath("/", "layout");

    // Use origin from request to prevent open redirect attacks
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(new URL("/admin/login", origin), {
        status: 302,
    });
}
