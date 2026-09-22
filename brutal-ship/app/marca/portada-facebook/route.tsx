import { ImageResponse } from "next/og";
import { fuentes } from "@/lib/og/fuentes";
import {
    COLOR,
    CUERPO,
    DISPLAY,
    EtiquetaFicha,
    Firma,
    Flecha,
    Lienzo,
    Sello,
    Tilde,
    sombra,
} from "@/lib/og/piezas";

/**
 * Portada de la pagina de Facebook, 1640x624 (el doble de 820x312, para que se
 * vea nitida en pantallas retina).
 *
 * Facebook recorta distinto en cada lado: en la compu se ve entera, en el
 * celular solo la franja central (x 265 a 1375), y la foto de perfil se monta
 * abajo, a la izquierda en la compu y al centro en el celular. Por eso todo lo
 * que hay que leer vive entre x 300-1370 e y 60-440, y el resto es textura.
 */

// Se arma en el build y queda como archivo: no cambia salvo que cambie el
// mensaje, y asi no hay que generarla en cada visita.
export const dynamic = "force-static";

const ANCHO = 1640;
const ALTO = 624;

const PONEMOS = ["El diseño completo", "Dominio y hosting", "El candadito verde", "Que Google te encuentre"];

/** Las mismas frases que corren en la banda de la home. */
const BANDA = ["Diseño atractivo", "Entrega rápida", "Resultados reales", "Nos encargamos de todo"];

export async function GET() {
    return new ImageResponse(
        (
            <Lienzo ancho={ANCHO} alto={ALTO}>
                {/* Decoracion: fuera de la zona segura a proposito. */}
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

                {/* La banda del sitio, abajo: llena el espacio que igual tapa la
                    foto de perfil, y las frases se repiten para que lo que quede
                    a la vista se lea entero. */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 88,
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        backgroundColor: COLOR.tinta,
                        borderTop: `3px solid ${COLOR.tinta}`,
                    }}
                >
                    {[...BANDA, ...BANDA, ...BANDA].map((frase, i) => (
                        <div key={`${frase}-${i}`} style={{ display: "flex", alignItems: "center" }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    margin: "0 26px",
                                    backgroundColor: i % 2 === 0 ? COLOR.verde : COLOR.amarillo,
                                    transform: "rotate(45deg)",
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    fontFamily: DISPLAY,
                                    fontWeight: 700,
                                    fontSize: 24,
                                    letterSpacing: 2.4,
                                    textTransform: "uppercase",
                                    color: COLOR.blanco,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {frase}
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 300,
                        top: 62,
                        width: 690,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Firma tam={52} />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 26,
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: 58,
                            lineHeight: 0.94,
                            letterSpacing: -2.9,
                            textTransform: "uppercase",
                        }}
                    >
                        <div style={{ display: "flex" }}>Tu web profesional,</div>
                        <div
                            style={{
                                display: "flex",
                                color: COLOR.violeta,
                                WebkitTextStroke: `2px ${COLOR.tinta}`,
                            }}
                        >
                            sin complicaciones.
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 22,
                            fontFamily: CUERPO,
                            fontWeight: 500,
                            fontSize: 26,
                            lineHeight: 1.3,
                        }}
                    >
                        <div style={{ display: "flex" }}>Vos atendé tu negocio.</div>
                        <div style={{ display: "flex" }}>De la web nos encargamos nosotros.</div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
                        <div
                            style={{
                                display: "flex",
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 30,
                                letterSpacing: -0.4,
                            }}
                        >
                            logikaweb.com.ar
                        </div>
                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <Flecha tam={30} color={COLOR.violeta} />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 984,
                        top: 96,
                        width: 360,
                        display: "flex",
                        flexDirection: "column",
                        padding: "38px 26px 48px",
                        backgroundColor: COLOR.violeta,
                        border: `3px solid ${COLOR.tinta}`,
                        borderRadius: 8,
                        boxShadow: sombra(10),
                    }}
                >
                    <EtiquetaFicha fondo={COLOR.violeta} color={COLOR.blanco} tam={15} izquierda={22}>
                        Lo que ponemos nosotros
                    </EtiquetaFicha>
                    {PONEMOS.map((item, i) => (
                        <div key={item} style={{ display: "flex", alignItems: "center", marginTop: i === 0 ? 0 : 14 }}>
                            <Tilde tam={26} />
                            <div
                                style={{
                                    display: "flex",
                                    marginLeft: 13,
                                    fontFamily: CUERPO,
                                    fontWeight: 500,
                                    fontSize: 22,
                                    color: COLOR.blanco,
                                }}
                            >
                                {item}
                            </div>
                        </div>
                    ))}
                </div>

                <Sello
                    color={COLOR.tinta}
                    fondo={COLOR.amarillo}
                    tam={20}
                    giro={-6}
                    style={{ position: "absolute", left: 978, top: 368, boxShadow: sombra(4) }}
                >
                    Presupuesto sin cargo
                </Sello>
            </Lienzo>
        ),
        { width: ANCHO, height: ALTO, fonts: await fuentes() }
    );
}
