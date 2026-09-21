import { ImageResponse } from "next/og";
import type { Documento } from "@/app/legal/documentos";
import { fuentes } from "./fuentes";
import {
    COLOR,
    CUERPO,
    DISPLAY,
    EtiquetaFicha,
    Lienzo,
    Pie,
    Sello,
    TAMANIO,
    sombra,
    tamanioQueEntra,
} from "./piezas";

const ANCHO = 1072;
const RELLENO = 56;

/**
 * La tarjeta de /privacidad y /terminos: el documento como una hoja con su
 * ficha, el titulo, de que se trata y la fecha de actualizacion, igual que el
 * encabezado de la pagina.
 */
export async function tarjetaLegal(doc: Documento, direccion: string) {
    const anchoTitulo = ANCHO - 6 - RELLENO * 2 - 250;
    const tamanio = tamanioQueEntra(doc.titulo.toUpperCase(), anchoTitulo, 2, [84, 78, 72, 66, 60], -0.045);

    return new ImageResponse(
        (
            <Lienzo>
                <div
                    style={{
                        position: "absolute",
                        left: 64,
                        top: 62,
                        width: ANCHO,
                        height: 412,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: `0 ${RELLENO}px`,
                        backgroundColor: COLOR.blanco,
                        border: `3px solid ${COLOR.tinta}`,
                        borderRadius: 8,
                        boxShadow: sombra(12),
                    }}
                >
                    <EtiquetaFicha fondo={COLOR.blanco} izquierda={44}>
                        Legal · Logika
                    </EtiquetaFicha>

                    <div
                        style={{
                            display: "flex",
                            width: anchoTitulo,
                            fontFamily: DISPLAY,
                            fontWeight: 700,
                            fontSize: tamanio,
                            lineHeight: 0.94,
                            letterSpacing: -tamanio * 0.045,
                            textTransform: "uppercase",
                        }}
                    >
                        {doc.titulo}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            width: 800,
                            marginTop: 24,
                            fontFamily: CUERPO,
                            fontWeight: 500,
                            fontSize: 27,
                            lineHeight: 1.35,
                            color: "rgba(26, 26, 26, 0.8)",
                        }}
                    >
                        {doc.intro}
                    </div>

                    <div style={{ display: "flex", marginTop: 26 }}>
                        <div
                            style={{
                                display: "flex",
                                padding: "8px 14px",
                                backgroundColor: COLOR.amarillo,
                                border: `2px solid ${COLOR.tinta}`,
                                borderRadius: 4,
                                boxShadow: sombra(3),
                                fontFamily: DISPLAY,
                                fontWeight: 700,
                                fontSize: 17,
                                letterSpacing: 1.5,
                                textTransform: "uppercase",
                            }}
                        >
                            Última actualización: {doc.actualizado}
                        </div>
                    </div>
                </div>

                <Sello
                    color={COLOR.violeta}
                    fondo={COLOR.blanco}
                    tam={30}
                    giro={-8}
                    style={{ position: "absolute", right: 110, top: 118 }}
                >
                    {doc.sello}
                </Sello>

                <Pie direccion={direccion} style={{ position: "absolute", left: 64, right: 64, bottom: 42 }} />
            </Lienzo>
        ),
        { ...TAMANIO, fonts: await fuentes() }
    );
}
