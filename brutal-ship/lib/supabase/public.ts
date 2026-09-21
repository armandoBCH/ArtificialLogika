import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el contenido publico: precios, portafolio,
 * testimonios, preguntas y configuracion del sitio.
 *
 * No toca cookies, y ese es todo el punto. El cliente de `server.ts` llama a
 * `cookies()`, y con eso Next marca la ruta como dinamica: el `revalidate` de
 * cada pagina quedaba sin efecto y la home se renderizaba de cero en cada
 * visita. En produccion tardaba entre 0,6 y 12 segundos en responder, y el bot
 * de LinkedIn se cansaba antes: "no se puede generar una vista previa".
 *
 * Nada de lo que se lee aca necesita sesion (la anon key tiene lectura publica
 * por RLS). Lo que si depende del admin logueado sigue usando `server.ts`.
 */
let cliente: SupabaseClient | null = null;

export function createPublicClient(): SupabaseClient {
    cliente ??= createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        }
    );
    return cliente;
}
