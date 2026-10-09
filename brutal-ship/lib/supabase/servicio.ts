import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la clave de servicio: no pasa por RLS. Es solo para el aviso de
 * Mercado Pago, que llega sin sesión. La clave no lleva NEXT_PUBLIC_, así que
 * nunca llega al navegador; igual, esto se importa únicamente desde rutas de API.
 */
export function createServiceClient(): SupabaseClient {
    const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!clave) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY: sin ella el aviso de Mercado Pago no puede guardar los cobros.");
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, clave, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
}
