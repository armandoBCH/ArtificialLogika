import { ImageResponse } from "next/og";
import { fuentes } from "@/lib/og/fuentes";
import {
    COLOR,
    CUERPO,
    DISPLAY,
    EtiquetaFicha,
    Lienzo,
    Pie,
    TAMANIO,
    colorDeTema,
    sombra,
    tamanioQueEntra,
} from "@/lib/og/piezas";
import { BLOG_POSTS } from "../page";

/**
 * La tapa de cada nota: una ficha completa. El titulo es el campo principal y
 * abajo van los datos como en un formulario (tema, lectura, fecha), que es el
 * mundo del tramite que Logika resuelve por el cliente. El fondo toma el color
 * del tema, asi cada nota se distingue en el feed.
 */

export const alt = "Tapa de una nota del blog de Logika: título, tema, tiempo de lectura y fecha.";
export const size = TAMANIO;
export const contentType = "image/png";

export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

const ANCHO_FICHA = 1072;
const RELLENO_TITULO = 52;

function fechaLarga(iso: string) {
    // UTC para que "2026-08-04" no se convierta en el 3 de agosto al pasar por
    // la zona horaria del servidor.
    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));
}

function minutos(lectura: string) {
    const n = parseInt(lectura, 10);
    return Number.isNaN(n) ? lectura : `${n} ${n === 1 ? "minuto" : "minutos"}`;
}

function Campo({
    etiqueta,
    children,
    ancho,
    borde = true,
}: {
    etiqueta: string;
    children: React.ReactNode;
    ancho: number;
    borde?: boolean;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: ancho,
                padding: "16px 28px 20px",
                borderLeft: borde ? `3px solid ${COLOR.tinta}` : "none",
            }}
        >
            <div
                style={{
                    display: "flex",
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    color: COLOR.gris,
                }}
            >
                {etiqueta}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 6,
                    fontFamily: CUERPO,
                    fontWeight: 700,
                    fontSize: 27,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    // Una nota que no existe no genera (ni deja en cache) una tapa generica.
    if (!post) return new Response("No encontrada", { status: 404 });

    const titulo = post.title;
    const tema = colorDeTema(post.category);
    const oscuro = tema.texto === COLOR.blanco;

    const anchoTitulo = ANCHO_FICHA - 6 - RELLENO_TITULO * 2;
    const tamanio = tamanioQueEntra(titulo, anchoTitulo, 3, [74, 68, 62, 56, 50, 46], -0.02);

    return new ImageResponse(
        (
            <Lienzo
                fondo={tema.fondo}
                puntos={oscuro ? "rgba(255, 255, 255, 0.16)" : "rgba(26, 26, 26, 0.16)"}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 64,
                        top: 66,
                        width: ANCHO_FICHA,
                        height: 412,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: COLOR.blanco,
                        border: `3px solid ${COLOR.tinta}`,
                        borderRadius: 8,
                        boxShadow: sombra(12),
                    }}
                >
                    <EtiquetaFicha fondo={COLOR.blanco} izquierda={40}>
                        Nota del blog
                    </EtiquetaFicha>

                    <div
                        style={{
                            display: "flex",
                            flexGrow: 1,
                            alignItems: "center",
                            padding: `0 ${RELLENO_TITULO}px`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: anchoTitulo,
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: tamanio,
                                lineHeight: 1.06,
                                letterSpacing: -tamanio * 0.02,
                                textWrap: "balance",
                            }}
                        >
                            {titulo}
                        </div>
                    </div>

                    <div style={{ display: "flex", borderTop: `3px solid ${COLOR.tinta}` }}>
                        <Campo etiqueta="Tema" ancho={330} borde={false}>
                            <div
                                style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: 12,
                                    borderRadius: 4,
                                    backgroundColor: tema.fondo,
                                    border: `2px solid ${COLOR.tinta}`,
                                }}
                            />
                            {post.category}
                        </Campo>
                        <Campo etiqueta="Lectura" ancho={300}>
                            {minutos(post.readTime)}
                        </Campo>
                        <Campo etiqueta="Publicada" ancho={436}>
                            {fechaLarga(post.date)}
                        </Campo>
                    </div>
                </div>

                <Pie
                    direccion="logikaweb.com.ar/blog"
                    color={tema.texto}
                    tintaMarca={oscuro && tema.fondo === COLOR.tinta ? COLOR.blanco : COLOR.tinta}
                    style={{ position: "absolute", left: 64, right: 64, bottom: 44 }}
                />
            </Lienzo>
        ),
        { ...size, fonts: await fuentes() }
    );
}
