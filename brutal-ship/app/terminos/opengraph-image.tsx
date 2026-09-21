import { DOCUMENTOS } from "@/app/legal/documentos";
import { tarjetaLegal } from "@/lib/og/legal";
import { TAMANIO } from "@/lib/og/piezas";

export const alt = "Términos de Servicio de Logika: cómo trabaja, qué incluye cada plan y cuándo se paga.";
export const size = TAMANIO;
export const contentType = "image/png";

export default function Image() {
    return tarjetaLegal(DOCUMENTOS.terminos, "logikaweb.com.ar/terminos");
}
