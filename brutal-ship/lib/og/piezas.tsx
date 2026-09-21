/* eslint-disable @next/next/no-img-element -- Satori dibuja <img> plano: next/image no existe dentro de una imagen generada. */
import type { CSSProperties, ReactNode } from "react";
import { anchoTexto } from "./medidas";

/**
 * Piezas de las tarjetas de vista previa (lo que se ve al compartir un link en
 * LinkedIn, WhatsApp, Slack o X). Las dibuja Satori, el motor de `next/og`, que
 * entiende un subconjunto de CSS: todo contenedor con mas de un hijo necesita
 * `display: flex`, y no hay pseudo-elementos (el segundo filete del sello es
 * un div).
 *
 * Es el mismo sistema que el sitio (app/globals.css): neobrutalismo suave,
 * sombra dura, y los dos dispositivos propios de Logika. La ficha, el
 * formulario que Logika completa por vos, con la etiqueta cortando el borde.
 * Y el sello, que marca un veredicto.
 */

export const TAMANIO = { width: 1200, height: 630 };

export const COLOR = {
    violeta: "#8523E1",
    verde: "#00D68F",
    coral: "#FF5A5F",
    amarillo: "#FDE047",
    menta: "#A0E8AF",
    azul: "#4A90FF",
    tinta: "#1A1A1A",
    fondo: "#F7F6F8",
    gris: "#6B6B6B",
    blanco: "#FFFFFF",
} as const;

export const DISPLAY = "Space Grotesk";
export const CUERPO = "Bitter";

/**
 * Cada tema del blog tiene su color de fondo, asi dos notas seguidas en el feed
 * no parecen la misma. `texto` es lo que va encima (logo y direccion), elegido
 * por contraste: blanco solo sobre violeta y tinta.
 */
const TEMAS: Record<string, { fondo: string; texto: string }> = {
    Precios: { fondo: COLOR.amarillo, texto: COLOR.tinta },
    Negocios: { fondo: COLOR.violeta, texto: COLOR.blanco },
    "E-commerce": { fondo: COLOR.verde, texto: COLOR.tinta },
    "Diseño Web": { fondo: COLOR.coral, texto: COLOR.tinta },
    SEO: { fondo: COLOR.azul, texto: COLOR.tinta },
    Técnico: { fondo: COLOR.menta, texto: COLOR.tinta },
    Proceso: { fondo: COLOR.tinta, texto: COLOR.blanco },
};

export function colorDeTema(tema: string) {
    return TEMAS[tema] ?? { fondo: COLOR.violeta, texto: COLOR.blanco };
}

/** La sombra dura del sistema: sin desenfoque, siempre abajo a la derecha. */
export function sombra(px: number, color: string = COLOR.tinta) {
    return `${px}px ${px}px 0 0 ${color}`;
}

/**
 * El tamanio mas grande de `tamanios` con el que `texto` entra en `lineas`
 * renglones de `ancho` px, midiendo con los anchos reales de Space Grotesk Bold.
 * Si ninguno entra, devuelve el mas chico.
 */
export function tamanioQueEntra(
    texto: string,
    ancho: number,
    lineas: number,
    tamanios: number[],
    espaciadoEm = 0
): number {
    const palabras = texto.split(/\s+/).filter(Boolean);

    for (const t of tamanios) {
        const esp = espaciadoEm * t;
        const espacio = anchoTexto(" ", t) + esp;
        let renglones = 1;
        let actual = 0;
        let entra = true;

        for (const palabra of palabras) {
            const w = anchoTexto(palabra, t, esp);
            if (w > ancho) {
                entra = false;
                break;
            }
            if (actual === 0) actual = w;
            else if (actual + espacio + w <= ancho) actual += espacio + w;
            else {
                renglones++;
                actual = w;
            }
        }

        if (entra && renglones <= lineas) return t;
    }

    return tamanios[tamanios.length - 1];
}

/**
 * Lienzo de 1200x630 con la trama de puntos del sitio. El degradado va en
 * porcentajes a proposito: Satori ignora las paradas en px y no dibuja nada.
 */
export function Lienzo({
    fondo = COLOR.fondo,
    puntos = "rgba(26, 26, 26, 0.2)",
    children,
}: {
    fondo?: string;
    puntos?: string;
    children: ReactNode;
}) {
    return (
        <div
            style={{
                width: TAMANIO.width,
                height: TAMANIO.height,
                display: "flex",
                position: "relative",
                overflow: "hidden",
                backgroundColor: fondo,
                backgroundImage: `radial-gradient(${puntos} 12%, transparent 13.5%)`,
                backgroundSize: "30px 30px",
                fontFamily: CUERPO,
                color: COLOR.tinta,
            }}
        >
            {children}
        </div>
    );
}

/**
 * La marca tejida: cuatro barras que se cruzan como una trama, con su sombra.
 * Mismo dibujo que app/icon.svg. `tinta` cambia filetes y sombra para fondos
 * oscuros, como hace `currentColor` en el logo del sitio.
 */
export function MarcaTejida({ tam = 56, tinta = COLOR.tinta }: { tam?: number; tinta?: string }) {
    return (
        <svg width={tam} height={tam} viewBox="12 12 72 72">
            <defs>
                <clipPath id="tejido">
                    <rect x="45" y="0" width="60" height="100" />
                </clipPath>
            </defs>
            <rect x="22" y="22" width="62" height="62" rx="6" fill={tinta} />
            <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke={tinta} strokeWidth="4" />
            <rect x="14" y="14" width="22" height="62" rx="6" fill="#4A90FF" stroke={tinta} strokeWidth="4" />
            <rect x="14" y="54" width="62" height="22" rx="6" fill="#FF6B6B" stroke={tinta} strokeWidth="4" />
            <rect x="54" y="14" width="22" height="62" rx="6" fill="#00D68F" stroke={tinta} strokeWidth="4" />
            <rect
                x="14"
                y="14"
                width="62"
                height="22"
                rx="6"
                fill="#8523E1"
                stroke={tinta}
                strokeWidth="4"
                clipPath="url(#tejido)"
            />
        </svg>
    );
}

/**
 * Marca + "Logika" + el punto coral: el logo completo del navbar. `tintaMarca`
 * separa los filetes de la marca del color del texto, para fondos de color donde
 * el texto va en blanco pero la marca sigue necesitando su contorno negro.
 */
export function Firma({
    tam = 48,
    color = COLOR.tinta,
    tintaMarca = color,
}: {
    tam?: number;
    color?: string;
    tintaMarca?: string;
}) {
    const letra = Math.round(tam * 0.9);
    const punto = Math.round(tam * 0.26);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <MarcaTejida tam={tam} tinta={tintaMarca} />
            <div
                style={{
                    display: "flex",
                    marginLeft: Math.round(tam * 0.26),
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: letra,
                    letterSpacing: -letra * 0.02,
                    lineHeight: 1,
                    color,
                }}
            >
                Logika
            </div>
            <div
                style={{
                    width: punto,
                    height: punto,
                    marginLeft: Math.round(tam * 0.07),
                    marginTop: Math.round(tam * 0.34),
                    borderRadius: 999,
                    backgroundColor: "#FF6B6B",
                    border: `${Math.max(2, Math.round(tam * 0.06))}px solid ${tintaMarca}`,
                }}
            />
        </div>
    );
}

/** El pie comun: el logo a la izquierda y la direccion a la derecha. */
export function Pie({
    direccion,
    color = COLOR.tinta,
    tintaMarca = color,
    style,
}: {
    direccion: string;
    color?: string;
    tintaMarca?: string;
    style?: CSSProperties;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                ...style,
            }}
        >
            <Firma tam={44} color={color} tintaMarca={tintaMarca} />
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        display: "flex",
                        fontFamily: DISPLAY,
                        fontWeight: 700,
                        fontSize: 25,
                        letterSpacing: -0.3,
                        color,
                    }}
                >
                    {direccion}
                </div>
                <div style={{ display: "flex", marginLeft: 10 }}>
                    <Flecha tam={26} color={color} />
                </div>
            </div>
        </div>
    );
}

/**
 * El sello: doble filete, rotacion leve, mayusculas apretadas. Es un veredicto
 * ("esto ya esta"), no una etiqueta: uno por tarjeta, como mucho.
 */
export function Sello({
    children,
    color,
    fondo,
    tam = 22,
    giro = -6,
    style,
}: {
    children: ReactNode;
    color: string;
    fondo?: string;
    tam?: number;
    giro?: number;
    style?: CSSProperties;
}) {
    const filete = Math.max(3, Math.round(tam * 0.16));

    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                padding: `${Math.round(tam * 0.5)}px ${Math.round(tam * 0.85)}px`,
                border: `${filete}px solid ${color}`,
                borderRadius: 8,
                backgroundColor: fondo,
                transform: `rotate(${giro}deg)`,
                ...style,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: filete + 1,
                    left: filete + 1,
                    right: filete + 1,
                    bottom: filete + 1,
                    border: `2px solid ${color}`,
                    borderRadius: 4,
                    opacity: 0.55,
                }}
            />
            <div
                style={{
                    display: "flex",
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: tam,
                    letterSpacing: tam * 0.08,
                    textTransform: "uppercase",
                    lineHeight: 1.05,
                    color,
                }}
            >
                {children}
            </div>
        </div>
    );
}

/** La etiqueta de una ficha: corta el borde de la caja como la leyenda de un campo. */
export function EtiquetaFicha({
    children,
    fondo,
    color = COLOR.tinta,
    tam = 17,
    izquierda = 28,
}: {
    children: ReactNode;
    fondo: string;
    color?: string;
    tam?: number;
    izquierda?: number;
}) {
    const alto = Math.round(tam * 1.5);

    return (
        <div
            style={{
                position: "absolute",
                top: -Math.round(alto / 2) - 2,
                left: izquierda,
                height: alto,
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                backgroundColor: fondo,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: tam,
                letterSpacing: tam * 0.09,
                textTransform: "uppercase",
                color,
            }}
        >
            {children}
        </div>
    );
}

/** El tilde de "esto lo hacemos nosotros": cuadradito verde con filete. */
export function Tilde({ tam = 30, fondo = COLOR.verde }: { tam?: number; fondo?: string }) {
    return (
        <svg width={tam} height={tam} viewBox="0 0 32 32">
            <rect x="2" y="2" width="28" height="28" rx="6" fill={fondo} stroke="#1A1A1A" strokeWidth="3" />
            <path
                d="M9 16.5l4.5 4.5L23 11.5"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** Flecha para los enlaces: la del sitio es un glifo de Material Icons, aca va en trazo. */
export function Flecha({ tam = 26, color = COLOR.tinta }: { tam?: number; color?: string }) {
    return (
        <svg width={tam} height={tam} viewBox="0 0 24 24">
            <path
                d="M4 12h15M13 6l6 6-6 6"
                fill="none"
                stroke={color}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Candado({ tam = 14 }: { tam?: number }) {
    return (
        <svg width={tam} height={tam} viewBox="0 0 24 24">
            <rect x="5" y="10.5" width="14" height="10.5" rx="2.5" fill="#1A1A1A" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="#1A1A1A" strokeWidth="2.6" />
        </svg>
    );
}

/**
 * Ventana de navegador con la captura de un sitio, como el mockup del hero.
 * `alto` es el de la captura, sin contar la barra. Sin captura (no cargo o no
 * hay), la ventana queda con un esqueleto de pagina en vez de un hueco.
 */
export function Navegador({
    ancho,
    alto,
    captura,
    dominio,
    acento = COLOR.violeta,
    sombraPx = 10,
    style,
}: {
    ancho: number;
    alto: number;
    captura: string | null;
    dominio?: string | null;
    acento?: string;
    sombraPx?: number;
    style?: CSSProperties;
}) {
    const borde = 3;
    const barra = Math.round(Math.max(34, ancho * 0.068));
    const luz = Math.round(barra * 0.3);
    const interior = ancho - borde * 2;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: ancho,
                border: `${borde}px solid ${COLOR.tinta}`,
                borderRadius: 12,
                backgroundColor: COLOR.blanco,
                boxShadow: sombra(sombraPx),
                overflow: "hidden",
                ...style,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: barra,
                    padding: `0 ${Math.round(barra * 0.36)}px`,
                    backgroundColor: COLOR.fondo,
                    borderBottom: `${borde}px solid ${COLOR.tinta}`,
                }}
            >
                {[COLOR.coral, COLOR.amarillo, COLOR.verde].map((c) => (
                    <div
                        key={c}
                        style={{
                            width: luz,
                            height: luz,
                            marginRight: Math.round(luz * 0.55),
                            borderRadius: 999,
                            backgroundColor: c,
                            border: `2px solid ${COLOR.tinta}`,
                        }}
                    />
                ))}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                        height: Math.round(barra * 0.6),
                        marginLeft: Math.round(barra * 0.2),
                        padding: `0 ${Math.round(barra * 0.3)}px`,
                        borderRadius: 999,
                        border: `2px solid ${COLOR.tinta}`,
                        backgroundColor: COLOR.blanco,
                    }}
                >
                    <Candado tam={Math.round(barra * 0.34)} />
                    {dominio ? (
                        <div
                            style={{
                                display: "flex",
                                marginLeft: 8,
                                fontFamily: DISPLAY,
                                fontWeight: 500,
                                fontSize: Math.round(barra * 0.36),
                                color: COLOR.tinta,
                            }}
                        >
                            {dominio}
                        </div>
                    ) : (
                        <div
                            style={{
                                width: "38%",
                                height: Math.round(barra * 0.16),
                                marginLeft: 10,
                                borderRadius: 999,
                                backgroundColor: "rgba(26, 26, 26, 0.18)",
                            }}
                        />
                    )}
                </div>
            </div>

            {captura ? (
                <img src={captura} alt="" width={interior} height={alto} style={{ width: interior, height: alto }} />
            ) : (
                <EsqueletoDePagina ancho={interior} alto={alto} acento={acento} />
            )}
        </div>
    );
}

function EsqueletoDePagina({ ancho, alto, acento }: { ancho: number; alto: number; acento: string }) {
    const u = alto / 10;
    const barra = (w: number, h: number, color: string, extra: CSSProperties = {}) => (
        <div style={{ width: w, height: h, borderRadius: 999, backgroundColor: color, ...extra }} />
    );

    return (
        <div
            style={{
                width: ancho,
                height: alto,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: `0 ${Math.round(ancho * 0.08)}px`,
                backgroundColor: COLOR.fondo,
            }}
        >
            {barra(ancho * 0.52, u * 0.9, COLOR.tinta)}
            {barra(ancho * 0.38, u * 0.9, acento, { marginTop: u * 0.45 })}
            {barra(ancho * 0.6, u * 0.32, "rgba(26, 26, 26, 0.2)", { marginTop: u * 0.9 })}
            {barra(ancho * 0.48, u * 0.32, "rgba(26, 26, 26, 0.2)", { marginTop: u * 0.35 })}
            <div
                style={{
                    width: ancho * 0.22,
                    height: u * 1.1,
                    marginTop: u * 0.9,
                    borderRadius: 6,
                    backgroundColor: acento,
                    border: `2px solid ${COLOR.tinta}`,
                }}
            />
        </div>
    );
}
