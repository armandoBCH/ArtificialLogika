import { ImageResponse } from "next/og";
import { esMuestra, getPortfolioProjects } from "@/lib/data/portfolio";
import { captura, comoJpeg, dominioPropio } from "@/lib/og/captura";
import { fuentes } from "@/lib/og/fuentes";
import {
    BANDA,
    Banda,
    COLOR,
    CUERPO,
    DISPLAY,
    Firma,
    Lienzo,
    Navegador,
    Sello,
    TAMANIO,
    sombra,
} from "@/lib/og/piezas";

/**
 * La tapa del portafolio: dos webs de clientes reales abiertas en el navegador,
 * el sello de que son casos de verdad y la banda del sitio al pie. Es la misma
 * composicion que la portada de Facebook (app/marca/portada-portafolio), en la
 * medida que piden las vistas previas.
 *
 * Se arma con los casos reales del panel, en el orden del panel; los de muestra
 * solo entran si no hay dos reales.
 */

export const alt = "El portafolio de Logika: webs de clientes reales abiertas en el navegador.";
export const size = TAMANIO;
export const contentType = "image/jpeg";
export const revalidate = 3600;

/** De atras hacia adelante. */
const VENTANAS = [
    { ancho: 430, left: 700, top: 52, giro: 4 },
    { ancho: 452, left: 636, top: 214, giro: -2.5 },
];

export default async function Image() {
    const proyectos = await getPortfolioProjects();
    const reales = proyectos.filter((p) => !esMuestra(p));
    const elegidos = [...reales, ...proyectos.filter(esMuestra)].slice(0, 2).reverse();

    const capturas = await Promise.all(
        elegidos.map((p, i) =>
            captura(
                p.image_url_wide || p.image_url,
                VENTANAS[i].ancho - 6,
                Math.round((VENTANAS[i].ancho - 6) * (9 / 16))
            )
        )
    );

    const tarjeta = new ImageResponse(
        (
            <Lienzo>
                <Banda frases={BANDA} alto={72} />

                <div
                    style={{
                        position: "absolute",
                        left: 60,
                        top: 46,
                        width: 560,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Firma tam={46} />

                    <div
                        style={{
                            display: "flex",
                            marginTop: 26,
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
                            marginTop: 12,
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: 72,
                            lineHeight: 0.92,
                            letterSpacing: -3.6,
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
                            marginTop: 22,
                            fontFamily: CUERPO,
                            fontWeight: 500,
                            fontSize: 25,
                            lineHeight: 1.3,
                        }}
                    >
                        <div style={{ display: "flex" }}>Webs a medida para cada rubro,</div>
                        <div style={{ display: "flex" }}>publicadas y andando.</div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            marginTop: 20,
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: 26,
                            letterSpacing: -0.4,
                        }}
                    >
                        logikaweb.com.ar/portafolio
                    </div>
                </div>

                {elegidos.map((p, i) => (
                    <Navegador
                        key={p.id}
                        ancho={VENTANAS[i].ancho}
                        alto={Math.round((VENTANAS[i].ancho - 6) * (9 / 16))}
                        captura={capturas[i]}
                        dominio={dominioPropio(p.external_url)}
                        sombraPx={10}
                        style={{
                            position: "absolute",
                            left: VENTANAS[i].left,
                            top: VENTANAS[i].top,
                            transform: `rotate(${VENTANAS[i].giro}deg)`,
                        }}
                    />
                ))}

                <Sello
                    color={COLOR.tinta}
                    fondo={COLOR.verde}
                    tam={20}
                    giro={-6}
                    style={{ position: "absolute", left: 588, top: 118, boxShadow: sombra(4) }}
                >
                    Casos reales
                </Sello>
            </Lienzo>
        ),
        { ...size, fonts: await fuentes() }
    );

    return comoJpeg(tarjeta);
}
