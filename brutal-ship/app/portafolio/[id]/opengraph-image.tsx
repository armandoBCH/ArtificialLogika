import { ImageResponse } from "next/og";
import { esMuestra, getPortfolioProjects, isRealStat } from "@/lib/data/portfolio";
import { captura, comoJpeg, dominioPropio } from "@/lib/og/captura";
import { fuentes } from "@/lib/og/fuentes";
import {
    COLOR,
    CUERPO,
    DISPLAY,
    Lienzo,
    Navegador,
    Pie,
    Sello,
    TAMANIO,
    sombra,
    tamanioQueEntra,
} from "@/lib/og/piezas";

/**
 * La tarjeta de cada caso del portafolio: la web del cliente dentro de un
 * navegador, como el mockup del hero, y al lado el rubro, el nombre y los
 * resultados medidos, si los hay.
 *
 * El sello sigue la misma regla que la home (lib/data/portfolio.ts): un caso de
 * muestra lo dice siempre. Sin metricas reales no se muestra ningun numero.
 */

export const alt = "Un caso del portafolio de Logika: la web del cliente, su rubro y sus resultados.";
export const size = TAMANIO;
export const contentType = "image/jpeg";

// Mismo ritmo que la pagina del proyecto. Guardar en el panel la regenera antes.
export const revalidate = 3600;

export async function generateStaticParams() {
    const proyectos = await getPortfolioProjects();
    return proyectos.map((p) => ({ id: p.id }));
}

const NAV_ANCHO = 620;
const NAV_ALTO = Math.round((NAV_ANCHO - 6) * (9 / 16));
const COLUMNA = { left: 732, ancho: 404 };

/**
 * La descripcion entera si entra. Si no, las oraciones completas que entren, y
 * recien si la primera ya es muy larga, un corte por palabra con puntos
 * suspensivos.
 */
function recortar(texto: string, maximo: number) {
    const limpio = texto.replace(/\s+/g, " ").trim();
    if (limpio.length <= maximo) return limpio;

    const oraciones = limpio.match(/[^.!?]+[.!?]+/g) ?? [];
    let armado = "";
    for (const oracion of oraciones) {
        const siguiente = `${armado}${oracion}`.trim();
        if (siguiente.length > maximo) break;
        armado = `${siguiente} `;
    }
    if (armado.trim()) return armado.trim();

    const corte = limpio.slice(0, maximo);
    return `${corte.slice(0, corte.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const proyecto = (await getPortfolioProjects()).find((p) => p.id === id);

    // Un id que no existe no genera (ni deja en cache) una tarjeta generica.
    if (!proyecto) return new Response("No encontrado", { status: 404 });

    const titulo = proyecto.title;
    const rubro = proyecto.categories?.[0] || proyecto.category || "Proyecto";
    const metricas = (proyecto.stats ?? []).filter(isRealStat).slice(0, 2);
    const muestra = esMuestra(proyecto);
    const imagen = await captura(proyecto.image_url_wide || proyecto.image_url, NAV_ANCHO - 6, NAV_ALTO);

    const tamTitulo = tamanioQueEntra(titulo.toUpperCase(), COLUMNA.ancho, 3, [64, 58, 52, 46, 42, 38], -0.03);
    const anchoMetrica = (COLUMNA.ancho - 18) / 2 - 40;

    const tarjeta = new ImageResponse(
        (
            <Lienzo>
                <Navegador
                    ancho={NAV_ANCHO}
                    alto={NAV_ALTO}
                    captura={imagen}
                    dominio={dominioPropio(proyecto.external_url)}
                    sombraPx={12}
                    style={{ position: "absolute", left: 64, top: 56 }}
                />

                <Sello
                    color={COLOR.tinta}
                    fondo={muestra ? COLOR.amarillo : COLOR.verde}
                    tam={muestra ? 19 : 22}
                    giro={6}
                    style={{ position: "absolute", left: muestra ? 432 : 506, top: 30, boxShadow: sombra(4) }}
                >
                    {muestra ? "Proyecto de muestra" : "Caso real"}
                </Sello>

                <div
                    style={{
                        position: "absolute",
                        left: COLUMNA.left,
                        top: 56,
                        width: COLUMNA.ancho,
                        height: 404,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                                display: "flex",
                                padding: "7px 14px",
                                backgroundColor: COLOR.tinta,
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 17,
                                letterSpacing: 1.8,
                                textTransform: "uppercase",
                                color: COLOR.blanco,
                            }}
                        >
                            {rubro}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            marginTop: 18,
                            width: COLUMNA.ancho,
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: tamTitulo,
                            lineHeight: 0.96,
                            letterSpacing: -tamTitulo * 0.03,
                            textTransform: "uppercase",
                        }}
                    >
                        {titulo}
                    </div>

                    {metricas.length > 0 ? (
                        <div style={{ display: "flex", marginTop: 28 }}>
                            {metricas.map((m, i) => {
                                const tam = tamanioQueEntra(m.value, anchoMetrica, 1, [46, 42, 38, 34, 30]);
                                return (
                                    <div
                                        key={`${m.value}-${m.label}`}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: (COLUMNA.ancho - 18) / 2,
                                            marginLeft: i === 0 ? 0 : 18,
                                            padding: "14px 18px 16px",
                                            backgroundColor: COLOR.blanco,
                                            border: `3px solid ${COLOR.tinta}`,
                                            borderRadius: 6,
                                            boxShadow: sombra(5),
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                fontFamily: DISPLAY,
                                                fontWeight: 700,
                                                fontSize: tam,
                                                lineHeight: 1,
                                                letterSpacing: -tam * 0.02,
                                                color: COLOR.violeta,
                                            }}
                                        >
                                            {m.value}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                marginTop: 8,
                                                fontFamily: DISPLAY,
                                                fontWeight: 700,
                                                fontSize: 15,
                                                letterSpacing: 1.4,
                                                textTransform: "uppercase",
                                                color: COLOR.gris,
                                            }}
                                        >
                                            {m.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                marginTop: 22,
                                fontFamily: CUERPO,
                                fontWeight: 500,
                                fontSize: 23,
                                lineHeight: 1.38,
                                color: "rgba(26, 26, 26, 0.8)",
                            }}
                        >
                            {recortar(proyecto.description ?? "", 118)}
                        </div>
                    )}
                </div>

                <Pie
                    direccion="logikaweb.com.ar/portafolio"
                    style={{ position: "absolute", left: 64, right: 64, bottom: 42 }}
                />
            </Lienzo>
        ),
        { ...size, fonts: await fuentes() }
    );

    return comoJpeg(tarjeta);
}
