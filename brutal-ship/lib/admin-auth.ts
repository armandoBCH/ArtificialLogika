import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * El middleware protege las PÁGINAS de /admin, pero no las rutas de /api.
 * Cada handler tiene que validar por su cuenta.
 *
 * Esto vivía copiado en cada archivo, y esa fue exactamente la causa del
 * problema: /api/admin/analytics quedó sin la verificación y publicaba las
 * métricas de Google Analytics a cualquiera que pidiera la URL. Con una sola
 * definición compartida, agregar una ruta nueva sin guardia requiere olvidarse
 * de importarla, que se nota mucho más que olvidarse de copiar veinte líneas.
 */

const ADMIN_EMAIL = "armadobeatochang@gmail.com";
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

interface Guardia {
    /** Respuesta ya armada cuando la petición no pasa. `null` si pasó. */
    rechazo: NextResponse | null;
}

/**
 * Aplica rate limit y verifica que quien pide sea el admin.
 * Devolvé `rechazo` inmediatamente si no es `null`.
 */
export async function guardarRutaAdmin(request: NextRequest): Promise<Guardia> {
    const ip = getClientIp(request);
    const limiter = rateLimit(`admin:${ip}`, RATE_LIMIT, WINDOW_MS);
    if (!limiter.success) {
        return {
            rechazo: NextResponse.json(
                { error: "Demasiadas solicitudes" },
                {
                    status: 429,
                    headers: { "Retry-After": String(Math.ceil(limiter.resetIn / 1000)) },
                }
            ),
        };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
        return { rechazo: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
    }

    return { rechazo: null };
}
