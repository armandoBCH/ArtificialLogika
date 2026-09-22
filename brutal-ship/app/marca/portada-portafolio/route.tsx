import { ImageResponse } from "next/og";
import { esMuestra, getPortfolioProjects } from "@/lib/data/portfolio";
import { captura, dominioPropio } from "@/lib/og/captura";
import { fuentes } from "@/lib/og/fuentes";
import { BANDA, Banda, COLOR, CUERPO, DISPLAY, Firma, Lienzo, Navegador, Sello, sombra } from "@/lib/og/piezas";

/**
 * La otra portada de Facebook, 1640x624: la del trabajo hecho. Mismas reglas de
 * recorte que ./portada-facebook (franja central para el celular, banda abajo
 * donde se monta la foto de perfil), pero en vez de la lista de lo que hacemos,
 * van dos webs de clientes reales abiertas en el navegador.
 */

export const dynamic = "force-static";

const ANCHO = 1640;
const ALTO = 624;

const VENTANAS = [
    { ancho: 384, left: 948, top: 84, giro: 4 },
    { ancho: 404, left: 888, top: 226, giro: -2.5 },
];

export async function GET() {
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

    return new ImageResponse(
        (
            <Lienzo ancho={ANCHO} alto={ALTO}>
                <div
                    style={{
                        position: "absolute",
                        top: -210,
                        right: -140,
                        width: 420,
                        height: 420,
                        borderRadius: 999,
                        backgroundColor: COLOR.menta,
                        border: `3px solid ${COLOR.tinta}`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: 92,
                        top: 386,
                        width: 140,
                        height: 140,
                        backgroundColor: COLOR.amarillo,
                        border: `3px solid ${COLOR.tinta}`,
                        transform: "rotate(12deg)",
                    }}
                />

                <Banda frases={BANDA} />

                <div
                    style={{
                        position: "absolute",
                        left: 300,
                        top: 62,
                        width: 600,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Firma tam={52} />

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
                            fontSize: 58,
                            lineHeight: 0.94,
                            letterSpacing: -2.9,
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
                            marginTop: 20,
                            fontFamily: CUERPO,
                            fontWeight: 500,
                            fontSize: 26,
                            lineHeight: 1.3,
                        }}
                    >
                        <div style={{ display: "flex" }}>Webs a medida para cada rubro,</div>
                        <div style={{ display: "flex" }}>publicadas y andando.</div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            marginTop: 22,
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: 28,
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
                    style={{ position: "absolute", left: 846, top: 142, boxShadow: sombra(4) }}
                >
                    Casos reales
                </Sello>
            </Lienzo>
        ),
        { width: ANCHO, height: ALTO, fonts: await fuentes() }
    );
}
