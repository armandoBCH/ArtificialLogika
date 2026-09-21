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
    TAMANIO,
    Tilde,
    sombra,
} from "@/lib/og/piezas";

/**
 * La tarjeta de la home: lo que aparece al pegar logikaweb.com.ar en LinkedIn o
 * WhatsApp.
 *
 * El titular es el del hero. La ficha violeta es "Lo que ponemos nosotros", la
 * misma lista del sitio, y el sello completa el slogan: "Tu web profesional,
 * sin complicaciones". Dice "nos encargamos", no "incluido": el dominio y el
 * hosting se tramitan, pero solo van dentro del precio con el plan mensual.
 */

export const alt =
    "Logika: tu web profesional, sin complicaciones. Diseño, dominio, hosting, correo y publicación, a cargo nuestro.";
export const size = TAMANIO;
export const contentType = "image/png";

const LO_QUE_PONEMOS = [
    "El diseño completo",
    "Dominio y hosting",
    "Correo con tu dominio",
    "El candadito verde",
    "Que Google te encuentre",
    "Publicada y andando",
];

export default async function Image() {
    return new ImageResponse(
        (
            <Lienzo>
                {/* Las dos formas del hero: el circulo menta y el cuadrado amarillo. */}
                <div
                    style={{
                        position: "absolute",
                        top: -190,
                        right: -150,
                        width: 460,
                        height: 460,
                        borderRadius: 999,
                        backgroundColor: COLOR.menta,
                        border: `3px solid ${COLOR.tinta}`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: 628,
                        top: 392,
                        width: 124,
                        height: 124,
                        backgroundColor: COLOR.amarillo,
                        border: `3px solid ${COLOR.tinta}`,
                        transform: "rotate(12deg)",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 64,
                        top: 54,
                        bottom: 54,
                        width: 610,
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
                                flexDirection: "column",
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 94,
                                lineHeight: 0.92,
                                letterSpacing: -4.7,
                                textTransform: "uppercase",
                            }}
                        >
                            <div style={{ display: "flex" }}>Tu web</div>
                            <div
                                style={{
                                    display: "flex",
                                    color: COLOR.violeta,
                                    WebkitTextStroke: `2px ${COLOR.tinta}`,
                                }}
                            >
                                Profesional.
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 30,
                                fontFamily: CUERPO,
                                fontWeight: 500,
                                fontSize: 30,
                                lineHeight: 1.3,
                            }}
                        >
                            <div style={{ display: "flex" }}>Vos atendé tu negocio.</div>
                            <div style={{ display: "flex" }}>De la web nos encargamos nosotros.</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 27,
                                letterSpacing: -0.3,
                            }}
                        >
                            logikaweb.com.ar
                        </div>
                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <Flecha tam={28} color={COLOR.violeta} />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 696,
                        top: 104,
                        width: 444,
                        display: "flex",
                        flexDirection: "column",
                        padding: "46px 34px 58px",
                        backgroundColor: COLOR.violeta,
                        border: `3px solid ${COLOR.tinta}`,
                        borderRadius: 8,
                        boxShadow: sombra(12),
                    }}
                >
                    <EtiquetaFicha fondo={COLOR.violeta} color={COLOR.blanco}>
                        Lo que ponemos nosotros
                    </EtiquetaFicha>
                    {LO_QUE_PONEMOS.map((item, i) => (
                        <div
                            key={item}
                            style={{ display: "flex", alignItems: "center", marginTop: i === 0 ? 0 : 15 }}
                        >
                            <Tilde tam={32} />
                            <div
                                style={{
                                    display: "flex",
                                    marginLeft: 16,
                                    fontFamily: CUERPO,
                                    fontWeight: 500,
                                    fontSize: 27,
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
                    tam={25}
                    giro={-6}
                    style={{ position: "absolute", left: 786, top: 452, boxShadow: sombra(5) }}
                >
                    Sin complicaciones
                </Sello>
            </Lienzo>
        ),
        { ...size, fonts: await fuentes() }
    );
}
