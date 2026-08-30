import type { Metadata } from "next";
import LegalPage from "../legal/LegalPage";
import { getSiteConfig } from "@/lib/data/config";
import { BUSINESS, SITE_URL } from "@/lib/seo/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Términos de Servicio",
    description:
        "Cómo trabajamos en Logika: alcance, plazos, forma de pago, revisiones, garantía de la seña, propiedad del sitio y mantenimiento.",
    alternates: { canonical: `${SITE_URL}/terminos` },
    robots: { index: true, follow: true },
};

export default async function TerminosPage() {
    const config = await getSiteConfig();
    const email = config.email || "contactologika@gmail.com";
    const respuesta = config.response_time || "48hs";

    return (
        <LegalPage
            config={config}
            titulo="Términos de Servicio"
            actualizado="23 de agosto de 2026"
            intro="Cómo trabajamos, qué incluye cada plan, cuándo se paga y qué pasa si algo no sale como esperabas."
        >
            <h2>1. Quiénes somos y qué alcanzan estos términos</h2>
            <p>
                Estos términos regulan los servicios de diseño y desarrollo web que presta{" "}
                {BUSINESS.legalName} (&laquo;Logika&raquo;). Aplican desde que aceptás un presupuesto, ya sea por
                escrito, por email o por WhatsApp.
            </p>

            <h2>2. Qué incluye el servicio</h2>
            <p>Según el plan que contrates, el servicio puede incluir:</p>
            <ul>
                <li>Diseño y desarrollo del sitio.</li>
                <li>Adaptación a celulares y tablets.</li>
                <li>Gestión del dominio, hosting y certificado de seguridad (SSL).</li>
                <li>Casilla de correo con tu dominio.</li>
                <li>Redacción y carga de los textos.</li>
                <li>Configuración básica para que Google encuentre el sitio.</li>
                <li>Publicación y un mes de soporte incluido.</li>
            </ul>
            <p>
                El alcance exacto queda definido en el presupuesto que te enviamos. Lo que no figura ahí no está
                incluido.
            </p>

            <h2>3. Qué aportás vos</h2>
            <p>
                Para poder trabajar necesitamos que nos cuentes qué necesitás y que nos pases{" "}
                <strong>las fotos y el logo</strong> que quieras usar: vos elegís qué mostrar de tu negocio. Si no
                tenés logo, lo charlamos antes de arrancar.
            </p>
            <p>
                Al entregarnos ese material, nos confirmás que tenés derecho a usarlo y nos autorizás a
                publicarlo en tu sitio. Si el material se demora, los plazos se corren en la misma medida.
            </p>

            <h2>4. Plazos</h2>
            <ul>
                <li>
                    <strong>Landing Page:</strong> entre 1 y 2 semanas.
                </li>
                <li>
                    <strong>Sitio Institucional o E-commerce:</strong> entre 2 y 4 semanas.
                </li>
            </ul>
            <p>
                Los plazos se cuentan en días hábiles desde que recibimos la seña y el material. Si un plazo
                acordado se incumple por causas nuestras, sumamos funcionalidades adicionales sin cargo.
            </p>

            <h2>5. Precios y forma de pago</h2>
            <p>
                Los precios se expresan en <strong>dólares estadounidenses (US$)</strong>. El pago se realiza en
                pesos argentinos, salvo acuerdo distinto.
            </p>
            <ul>
                <li>
                    <strong>50% de seña</strong> para iniciar el proyecto.
                </li>
                <li>
                    <strong>50% restante</strong> al momento de la entrega, antes de la publicación.
                </li>
            </ul>
            <p>Aceptamos transferencia bancaria. Podemos armar un plan de pago si lo necesitás.</p>

            <h2>6. Garantía sobre la seña</h2>
            <p>
                Si el diseño inicial que te presentamos no te convence,{" "}
                <strong>te devolvemos la seña completa</strong> y el proyecto termina ahí, sin costo para vos.
            </p>
            <p>
                Esta garantía aplica a la primera propuesta de diseño. Una vez que aprobás el diseño y pasamos a
                la etapa de desarrollo, la seña no es reintegrable, porque el trabajo ya está en ejecución.
            </p>

            <h2>7. Revisiones</h2>
            <p>
                Antes de construir el sitio te mostramos cómo va a quedar y hacemos los cambios que pidas sobre
                esa propuesta. Una vez aprobado el diseño, los cambios de estructura o de concepto se presupuestan
                aparte. Las correcciones de errores nuestros no se cobran nunca.
            </p>

            <h2>8. De quién es el sitio</h2>
            <p>
                Una vez pagado el total, <strong>el sitio es tuyo</strong>: los textos, las imágenes que aportaste
                y el diseño final. El dominio se registra a tu nombre siempre que sea posible.
            </p>
            <p>
                Logika conserva los derechos sobre sus herramientas, componentes y código reutilizable de base, y
                se reserva el derecho de mostrar el trabajo terminado en su portafolio, salvo que nos pidas lo
                contrario por escrito.
            </p>

            <h2>9. Mantenimiento mensual</h2>
            <p>
                El mantenimiento mensual es <strong>opcional</strong>. Cubre el hosting, el dominio, el
                certificado de seguridad, las copias de respaldo, las actualizaciones técnicas y el soporte.
            </p>
            <p>
                Se puede cancelar cuando quieras, sin penalidad. Si lo cancelás, el sitio deja de estar alojado
                por nosotros y coordinamos la entrega de los archivos para que lo migres a donde prefieras.
            </p>

            <h2>10. Qué no cubrimos</h2>
            <ul>
                <li>Contenido que sea ilegal, engañoso o que infrinja derechos de terceros.</li>
                <li>Caídas o cambios de servicios de terceros (proveedores de hosting, dominios, Google, redes sociales).</li>
                <li>Resultados comerciales concretos: no garantizamos una cantidad de ventas, consultas ni posiciones específicas en buscadores.</li>
                <li>Daños causados por modificaciones que hagas vos o un tercero sobre el sitio entregado.</li>
            </ul>

            <h2>11. Cancelación</h2>
            <p>
                Podés cancelar el proyecto en cualquier momento. Si ya pasamos la etapa de diseño aprobado, se
                factura el trabajo realizado hasta esa fecha y se te entrega lo producido.
            </p>

            <h2>12. Legislación aplicable</h2>
            <p>
                Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia, las
                partes se someten a los tribunales ordinarios competentes.
            </p>

            <h2>13. Contacto</h2>
            <p>
                Cualquier duda sobre estos términos, escribinos a <a href={`mailto:${email}`}>{email}</a>. Te
                respondemos en menos de {respuesta}.
            </p>
        </LegalPage>
    );
}
