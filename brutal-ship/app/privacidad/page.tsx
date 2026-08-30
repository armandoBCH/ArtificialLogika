import type { Metadata } from "next";
import LegalPage from "../legal/LegalPage";
import { getSiteConfig } from "@/lib/data/config";
import { BUSINESS, SITE_URL } from "@/lib/seo/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Política de Privacidad",
    description:
        "Qué datos personales recolecta Logika, para qué los usa, con quién los comparte y cómo pedir que los borremos.",
    alternates: { canonical: `${SITE_URL}/privacidad` },
    robots: { index: true, follow: true },
};

export default async function PrivacidadPage() {
    const config = await getSiteConfig();
    const email = config.email || "contactologika@gmail.com";

    return (
        <LegalPage
            config={config}
            titulo="Política de Privacidad"
            actualizado="23 de agosto de 2026"
            intro="Qué datos tuyos guardamos, para qué los usamos y cómo pedir que los borremos. Sin letra chica."
        >
            <h2>Quiénes somos</h2>
            <p>
                Este sitio es operado por {BUSINESS.legalName} (&laquo;Logika&raquo;, &laquo;nosotros&raquo;), con
                domicilio en {config.location || "Buenos Aires, Argentina"}. Somos responsables de los datos
                personales que recolectamos a través de <a href={SITE_URL}>{SITE_URL}</a>.
            </p>
            <p>
                Para cualquier consulta sobre esta política escribinos a{" "}
                <a href={`mailto:${email}`}>{email}</a>.
            </p>

            <h2>Qué datos recolectamos</h2>
            <p>Solamente estos, y solamente cuando vos nos los das:</p>
            <ul>
                <li>
                    <strong>Formulario de contacto:</strong> tu nombre, un email o teléfono para responderte, el
                    tipo de negocio que elegís del desplegable y el mensaje que escribís.
                </li>
                <li>
                    <strong>WhatsApp:</strong> si nos escribís por ahí, se aplican también las condiciones de
                    WhatsApp. Nosotros conservamos la conversación para poder atenderte.
                </li>
                <li>
                    <strong>Datos de navegación:</strong> a través de Google Analytics recibimos información
                    agregada sobre cómo se usa el sitio: páginas vistas, tiempo de permanencia, tipo de
                    dispositivo, ciudad aproximada y desde dónde llegaste. No incluye tu nombre ni tu email.
                </li>
            </ul>
            <p>
                <strong>No pedimos ni almacenamos datos de tarjetas ni información bancaria en este sitio.</strong>{" "}
                Los pagos se coordinan por fuera, por transferencia.
            </p>

            <h2>Para qué los usamos</h2>
            <ul>
                <li>Responder tu consulta y prepararte un presupuesto.</li>
                <li>Contactarte durante el proyecto si lo contratás.</li>
                <li>Entender qué partes del sitio funcionan y cuáles no, en forma agregada.</li>
            </ul>
            <p>
                <strong>No vendemos tus datos.</strong> No los usamos para publicidad de terceros ni te
                mandamos correos masivos si no los pediste.
            </p>

            <h2>Dónde se guardan y quién puede verlos</h2>
            <p>
                Los mensajes del formulario se almacenan en <strong>Supabase</strong>, nuestro proveedor de base
                de datos, y solo accede a ellos el equipo de Logika. La medición de uso la procesa{" "}
                <strong>Google Analytics</strong>. Ambos son proveedores con servidores fuera de Argentina, lo que
                implica una transferencia internacional de datos.
            </p>
            <p>
                No compartimos tu información con nadie más, salvo que una autoridad competente nos lo requiera
                legalmente.
            </p>

            <h2>Cookies</h2>
            <p>
                Usamos cookies de Google Analytics para medir el uso del sitio. No usamos cookies de publicidad ni
                de perfilamiento. Podés bloquearlas desde la configuración de tu navegador; el sitio sigue
                funcionando igual.
            </p>

            <h2>Cuánto tiempo los conservamos</h2>
            <p>
                Las consultas que no derivan en un proyecto se conservan hasta 24 meses, por si volvés a
                escribirnos. Los datos de clientes se conservan mientras dure la relación comercial y por el
                plazo que exija la normativa fiscal. Podés pedirnos que los borremos antes.
            </p>

            <h2>Tus derechos</h2>
            <p>
                Según la <strong>Ley 25.326 de Protección de los Datos Personales</strong> de Argentina, tenés
                derecho a acceder a tus datos, corregirlos, actualizarlos y pedir que los suprimamos. Escribinos a{" "}
                <a href={`mailto:${email}`}>{email}</a> y lo resolvemos sin costo.
            </p>
            <p>
                La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley
                25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al
                incumplimiento de las normas sobre protección de datos personales.
            </p>

            <h2>Menores de edad</h2>
            <p>
                Este sitio está dirigido a personas mayores de 18 años que gestionan un negocio. No recolectamos
                datos de menores a sabiendas.
            </p>

            <h2>Cambios en esta política</h2>
            <p>
                Si la actualizamos, cambiamos la fecha del encabezado. Si el cambio es importante y sos cliente,
                te avisamos por el canal que usamos habitualmente.
            </p>
        </LegalPage>
    );
}
