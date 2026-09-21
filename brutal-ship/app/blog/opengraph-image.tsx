import { ImageResponse } from "next/og";
import { fuentes } from "@/lib/og/fuentes";
import {
    COLOR,
    CUERPO,
    DISPLAY,
    Firma,
    Lienzo,
    TAMANIO,
    colorDeTema,
    sombra,
    tamanioQueEntra,
} from "@/lib/og/piezas";
import { BLOG_POSTS } from "./page";

/**
 * La tapa del blog: la pila de las tres ultimas notas, cada una con el color de
 * su tema, como las tapas que se ven al compartir cada nota. Se arma sola con
 * lo que haya en BLOG_POSTS.
 */

export const alt = "El blog de Logika: diseño web explicado sin jerga, con las últimas notas publicadas.";
export const size = TAMANIO;
export const contentType = "image/png";

const ANCHO_NOTA = 500;

/**
 * De atras hacia adelante, como un fichero: de las dos de atras solo asoma la
 * pestania con el tema, y la mas nueva queda arriba y se lee entera.
 */
const POSICIONES = [
    { left: 668, top: 74, giro: -4 },
    { left: 650, top: 140, giro: 3 },
    { left: 626, top: 212, giro: -1.5 },
];

function Nota({
    titulo,
    tema,
    lectura,
    posicion,
}: {
    titulo: string;
    tema: string;
    lectura: string;
    posicion: (typeof POSICIONES)[number];
}) {
    const color = colorDeTema(tema);
    const anchoTitulo = ANCHO_NOTA - 6 - 56;
    const tamanio = tamanioQueEntra(titulo, anchoTitulo, 3, [40, 38, 36, 34, 32, 30], -0.01);

    return (
        <div
            style={{
                position: "absolute",
                left: posicion.left,
                top: posicion.top,
                width: ANCHO_NOTA,
                display: "flex",
                flexDirection: "column",
                backgroundColor: COLOR.blanco,
                border: `3px solid ${COLOR.tinta}`,
                borderRadius: 8,
                boxShadow: sombra(8),
                transform: `rotate(${posicion.giro}deg)`,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 50,
                    padding: "0 28px",
                    backgroundColor: color.fondo,
                    borderBottom: `3px solid ${COLOR.tinta}`,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: 1.7,
                    textTransform: "uppercase",
                    color: color.texto,
                }}
            >
                <div style={{ display: "flex" }}>{tema}</div>
                <div style={{ display: "flex" }}>{lectura}</div>
            </div>
            <div
                style={{
                    display: "flex",
                    height: 220,
                    alignItems: "center",
                    padding: "0 28px",
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: tamanio,
                    lineHeight: 1.12,
                    letterSpacing: -tamanio * 0.01,
                    textWrap: "balance",
                }}
            >
                {titulo}
            </div>
        </div>
    );
}

export default async function Image() {
    const ultimas = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).reverse();

    return new ImageResponse(
        (
            <Lienzo>
                <div
                    style={{
                        position: "absolute",
                        left: 64,
                        top: 54,
                        bottom: 54,
                        width: 540,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Firma tam={50} />

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                display: "flex",
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 18,
                                letterSpacing: 2.2,
                                textTransform: "uppercase",
                                color: COLOR.violeta,
                            }}
                        >
                            El blog de Logika
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 14,
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 86,
                                lineHeight: 0.92,
                                letterSpacing: -4.3,
                                textTransform: "uppercase",
                            }}
                        >
                            <div style={{ display: "flex" }}>Diseño web,</div>
                            <div
                                style={{
                                    display: "flex",
                                    color: COLOR.violeta,
                                    WebkitTextStroke: `2px ${COLOR.tinta}`,
                                }}
                            >
                                sin jerga.
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 26,
                                fontFamily: CUERPO,
                                fontWeight: 500,
                                fontSize: 28,
                                lineHeight: 1.3,
                            }}
                        >
                            <div style={{ display: "flex" }}>{BLOG_POSTS.length} notas para dueños de negocio</div>
                            <div style={{ display: "flex" }}>que no quieren saber de código.</div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: 25,
                            letterSpacing: -0.3,
                        }}
                    >
                        logikaweb.com.ar/blog
                    </div>
                </div>

                {ultimas.map((post, i) => (
                    <Nota
                        key={post.slug}
                        titulo={post.title}
                        tema={post.category}
                        lectura={post.readTime}
                        posicion={POSICIONES[i]}
                    />
                ))}
            </Lienzo>
        ),
        { ...size, fonts: await fuentes() }
    );
}
