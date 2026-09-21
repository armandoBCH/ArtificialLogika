import { ImageResponse } from "next/og";
import { esMuestra, getPortfolioProjects } from "@/lib/data/portfolio";
import { captura, comoJpeg, dominioPropio } from "@/lib/og/captura";
import { fuentes } from "@/lib/og/fuentes";
import { COLOR, CUERPO, DISPLAY, Firma, Lienzo, Navegador, TAMANIO } from "@/lib/og/piezas";

/**
 * La tapa del portafolio: tres webs de clientes reales abiertas en navegadores,
 * una encima de otra. Se arma con los primeros casos reales del panel (en el
 * orden del panel); los de muestra solo entran si no hay tres reales.
 */

export const alt = "El portafolio de Logika: webs de clientes reales abiertas en el navegador.";
export const size = TAMANIO;
export const contentType = "image/jpeg";
export const revalidate = 3600;

const ANCHO = 470;
const ALTO = Math.round((ANCHO - 6) * (9 / 16));

/** De atras hacia adelante. */
const POSICIONES = [
    { left: 700, top: 40, giro: 5 },
    { left: 610, top: 150, giro: -4 },
    { left: 668, top: 282, giro: 1.5 },
];

export default async function Image() {
    const proyectos = await getPortfolioProjects();
    const reales = proyectos.filter((p) => !esMuestra(p));
    const elegidos = [...reales, ...proyectos.filter(esMuestra)].slice(0, 3).reverse();

    const capturas = await Promise.all(
        elegidos.map((p) => captura(p.image_url_wide || p.image_url, ANCHO - 6, ALTO))
    );

    const tarjeta = new ImageResponse(
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
                            Portafolio
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
                            <div style={{ display: "flex" }}>Mirá lo que</div>
                            <div
                                style={{
                                    display: "flex",
                                    color: COLOR.violeta,
                                    WebkitTextStroke: `2px ${COLOR.tinta}`,
                                }}
                            >
                                hacemos.
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
                            <div style={{ display: "flex" }}>Webs a medida para cada rubro,</div>
                            <div style={{ display: "flex" }}>publicadas y andando.</div>
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
                        logikaweb.com.ar/portafolio
                    </div>
                </div>

                {elegidos.map((p, i) => (
                    <Navegador
                        key={p.id}
                        ancho={ANCHO}
                        alto={ALTO}
                        captura={capturas[i]}
                        dominio={dominioPropio(p.external_url)}
                        sombraPx={10}
                        style={{
                            position: "absolute",
                            left: POSICIONES[i].left,
                            top: POSICIONES[i].top,
                            transform: `rotate(${POSICIONES[i].giro}deg)`,
                        }}
                    />
                ))}
            </Lienzo>
        ),
        { ...size, fonts: await fuentes() }
    );

    return comoJpeg(tarjeta);
}
