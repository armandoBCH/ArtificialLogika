import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    /*
     * Solo donde hay una sesion que cuidar: el panel, su API y el cierre de sesion.
     *
     * Antes corria en todas las rutas, asi que cada visita a una pagina publica
     * (y cada bot que arma una vista previa: LinkedIn, WhatsApp, Slack) pagaba
     * una ejecucion extra antes de recibir una pagina que no usa sesion.
     * `/admin/:path*` tambien cubre `/admin` a secas.
     */
    matcher: ["/admin/:path*", "/api/admin/:path*", "/auth/:path*"],
};
