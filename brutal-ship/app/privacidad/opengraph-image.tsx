import { DOCUMENTOS } from "@/app/legal/documentos";
import { tarjetaLegal } from "@/lib/og/legal";
import { TAMANIO } from "@/lib/og/piezas";

export const alt = "Política de Privacidad de Logika: qué datos guarda, para qué y cómo pedir que se borren.";
export const size = TAMANIO;
export const contentType = "image/png";

export default function Image() {
    return tarjetaLegal(DOCUMENTOS.privacidad, "logikaweb.com.ar/privacidad");
}
