/**
 * Iconos y fondos de las caracteristicas de cada plan de precios.
 *
 * El sitio dibuja cualquier nombre de Material Icons (la fuente se sirve
 * completa, ver app/layout.tsx), asi que esta lista no limita nada: es el
 * catalogo que el admin ofrece para elegir sin tener que saberse los nombres.
 * Antes el admin ofrecia cuatro iconos fijos y los que ya estaban en uso
 * ("draw" en Mockup previo gratis, "request_quote" en Presupuesto sin cargo)
 * no se podian volver a elegir.
 *
 * Los fondos van escritos enteros a proposito: Tailwind genera solo las clases
 * que encuentra literales en el codigo, y `icon_bg` llega de la base.
 */

export type FondoIcono = {
    value: string;
    label: string;
    /** El glifo va en blanco sobre este fondo. */
    oscuro: boolean;
};

export const FONDOS_ICONO: FondoIcono[] = [
    { value: "bg-accent-yellow", label: "Amarillo", oscuro: false },
    { value: "bg-hot-coral", label: "Coral", oscuro: true },
    { value: "bg-secondary", label: "Verde", oscuro: false },
    { value: "bg-mint", label: "Menta", oscuro: false },
    { value: "bg-primary", label: "Violeta", oscuro: true },
    { value: "bg-white", label: "Blanco", oscuro: false },
    { value: "bg-ink-black", label: "Negro", oscuro: true },
];

export const FONDO_POR_DEFECTO = "bg-accent-yellow";
export const ICONO_POR_DEFECTO = "check";

/** Color del glifo que se lee sobre el fondo elegido. */
export function textoSobreFondo(fondo: string): string {
    return FONDOS_ICONO.find((f) => f.value === fondo)?.oscuro ? "text-white" : "text-ink-black";
}

export type IconoSugerido = {
    name: string;
    /** Palabras en castellano para encontrarlo buscando ("mockup", "gratis"). */
    tags: string;
};

export type GrupoIconos = { titulo: string; iconos: IconoSugerido[] };

export const GRUPOS_ICONOS: GrupoIconos[] = [
    {
        titulo: "Básicos",
        iconos: [
            { name: "check", tags: "tilde incluido si ok listo" },
            { name: "check_circle", tags: "tilde incluido listo circulo" },
            { name: "done_all", tags: "doble tilde todo incluido" },
            { name: "star", tags: "estrella destacado favorito" },
            { name: "bolt", tags: "rayo rapido energia" },
            { name: "diamond", tags: "diamante premium calidad" },
            { name: "add", tags: "mas suma extra" },
            { name: "info", tags: "informacion nota" },
        ],
    },
    {
        titulo: "Diseño",
        iconos: [
            { name: "draw", tags: "mockup boceto dibujo lapiz diseño previo" },
            { name: "brush", tags: "pincel diseño arte" },
            { name: "palette", tags: "paleta colores marca branding" },
            { name: "design_services", tags: "diseño servicios regla" },
            { name: "auto_awesome", tags: "magia animaciones efectos brillo" },
            { name: "web", tags: "web pagina sitio" },
            { name: "devices", tags: "dispositivos responsive pantallas" },
            { name: "smartphone", tags: "celular movil telefono responsive" },
            { name: "photo_library", tags: "fotos galeria imagenes" },
            { name: "view_quilt", tags: "secciones paginas estructura layout" },
            { name: "edit_note", tags: "textos contenido redaccion copy" },
        ],
    },
    {
        titulo: "Precio y regalos",
        iconos: [
            { name: "request_quote", tags: "presupuesto cotizacion sin cargo" },
            { name: "redeem", tags: "regalo gratis bonus" },
            { name: "card_giftcard", tags: "regalo gratis tarjeta" },
            { name: "local_offer", tags: "oferta etiqueta promo descuento" },
            { name: "sell", tags: "venta etiqueta precio" },
            { name: "savings", tags: "ahorro chanchito barato" },
            { name: "payments", tags: "pagos dinero efectivo" },
            { name: "credit_card", tags: "tarjeta pago online mercadopago" },
            { name: "percent", tags: "porcentaje descuento" },
            { name: "workspace_premium", tags: "premium medalla calidad garantia" },
            { name: "verified", tags: "verificado garantia confianza" },
        ],
    },
    {
        titulo: "Tienda",
        iconos: [
            { name: "shopping_cart", tags: "carrito compras checkout" },
            { name: "storefront", tags: "tienda local negocio" },
            { name: "inventory_2", tags: "catalogo productos stock caja" },
            { name: "local_shipping", tags: "envios camion entrega" },
            { name: "receipt_long", tags: "factura pedidos ticket" },
            { name: "qr_code_2", tags: "qr codigo menu" },
        ],
    },
    {
        titulo: "Contacto y soporte",
        iconos: [
            { name: "chat", tags: "whatsapp chat mensaje" },
            { name: "forum", tags: "conversacion consultas" },
            { name: "mail", tags: "email correo formulario contacto" },
            { name: "call", tags: "llamada telefono" },
            { name: "support_agent", tags: "soporte ayuda atencion" },
            { name: "handshake", tags: "acuerdo trato confianza" },
            { name: "calendar_month", tags: "calendario turnos reservas mes" },
            { name: "event_available", tags: "turno reserva agenda" },
            { name: "schedule", tags: "reloj horario tiempo plazo" },
        ],
    },
    {
        titulo: "Web, SEO y rendimiento",
        iconos: [
            { name: "search", tags: "google buscador seo aparece" },
            { name: "travel_explore", tags: "google mundo seo alcance" },
            { name: "language", tags: "dominio internet web mundo idioma" },
            { name: "speed", tags: "velocidad rapido carga" },
            { name: "rocket_launch", tags: "lanzamiento cohete publicar" },
            { name: "trending_up", tags: "crecimiento ventas subir" },
            { name: "insights", tags: "metricas estadisticas" },
            { name: "analytics", tags: "metricas visitas analitica" },
            { name: "map", tags: "mapa ubicacion" },
            { name: "place", tags: "ubicacion pin direccion" },
            { name: "lock", tags: "seguro candado ssl https" },
            { name: "security", tags: "seguridad escudo proteccion" },
            { name: "dns", tags: "hosting servidor" },
            { name: "cloud_done", tags: "nube hosting backup" },
            { name: "code", tags: "codigo programacion desarrollo" },
            { name: "tune", tags: "ajustes autogestionable panel editable" },
            { name: "admin_panel_settings", tags: "panel administracion editable" },
            { name: "article", tags: "blog articulo notas" },
            { name: "build", tags: "mantenimiento herramienta arreglos" },
        ],
    },
];

const NOMBRE_VALIDO = /^[a-z0-9_]{2,40}$/;

/** Normaliza lo que se escribe a mano: "Check Circle" -> "check_circle". */
export function normalizarNombreIcono(texto: string): string {
    return texto.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/**
 * Chequea en el navegador que el nombre exista en la fuente.
 *
 * Una ligadura que existe se dibuja como un glifo cuadrado de 1em; un nombre que
 * no existe queda como texto corrido, mucho mas ancho. Midiendo el ancho se
 * sabe si en el sitio se va a ver el icono o la palabra suelta. Solo cliente.
 */
export function iconoExiste(nombre: string): boolean {
    if (!NOMBRE_VALIDO.test(nombre) || typeof document === "undefined") return false;
    const span = document.createElement("span");
    span.className = "material-icons";
    span.style.cssText = "position:absolute;left:-9999px;top:0;font-size:24px;";
    span.textContent = nombre;
    document.body.appendChild(span);
    const ancho = span.getBoundingClientRect().width;
    span.remove();
    return Math.abs(ancho - 24) < 1.5;
}
