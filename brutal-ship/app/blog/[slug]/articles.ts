/**
 * Contenido de las notas del blog.
 *
 * El blog existe para que los buscadores y los modelos de lenguaje encuentren a
 * Logika. Eso cambia cómo conviene escribirlo, y la estructura de este archivo
 * sale de esas tres reglas:
 *
 * 1. Un motor de respuestas hace matching entre la pregunta del usuario y los
 *    subtítulos. Un h3 que dice "El esqueleto de una landing" no matchea con
 *    nada; "¿Qué tiene que tener una landing page?" sí.
 *
 * 2. La respuesta va en la PRIMERA oración después del subtítulo, no al final
 *    del párrafo. El modelo cita ese fragmento, no la nota entera.
 *
 * 3. Sin números no hay cita. "Depende del proyecto" no se puede citar;
 *    "desde US$149, entre 1 y 2 semanas" sí.
 *
 * Por eso cada nota tiene ahora `respuestaCorta` (el dato duro arriba de todo,
 * antes del desarrollo) y `preguntas`, que se renderizan como HTML visible Y
 * alimentan el schema FAQPage desde la misma fuente. Esto último no es un
 * detalle: Google exige que el marcado de FAQ coincida con lo que ve la
 * persona, y tenerlos separados es la forma más común de romper esa regla sin
 * darse cuenta.
 *
 * Todas las cifras salen de la base del sitio y de las FAQ publicadas. Ninguna
 * es inventada: una nota que promete plazos que la página de precios no
 * sostiene es peor que no tener nota.
 */

export interface PreguntaFrecuente {
    pregunta: string;
    respuesta: string;
}

export interface Articulo {
    /** El dato duro, citable, antes de cualquier desarrollo. */
    respuestaCorta: string;
    /** Cuerpo en HTML. */
    contenido: string;
    /** Se renderizan al pie y alimentan el schema FAQPage. */
    preguntas: PreguntaFrecuente[];
}

const articulos: Record<string, Articulo> = {
    "cuanto-cuesta-una-pagina-web-en-argentina": {
        respuestaCorta:
            "En Argentina, en 2026, una página web profesional cuesta entre US$149 y US$399 según el tipo: una landing page de una sola sección desde US$149, un sitio institucional de hasta 5 páginas desde US$249, y una tienda online desde US$399. El plazo de entrega va de 1 a 2 semanas para una landing y de 2 a 4 semanas para un sitio institucional o un e-commerce. A eso hay que sumarle entre US$10 y US$20 por mes de hosting y dominio, que es lo único que se paga siempre.",
        contenido: `
    <h2>¿Cuánto cuesta una página web en Argentina?</h2>
    <p>Depende de qué tenga que hacer la web, y las diferencias son grandes. Abajo están los tres casos que cubren a la mayoría de los negocios, con el precio y el plazo de cada uno.</p>

    <h3>¿Cuánto sale una landing page?</h3>
    <p><strong>Desde US$149</strong>, y se entrega entre 1 y 2 semanas. Es una sola página con todo lo necesario para que te encuentren y te escriban: qué hacés, fotos de tu trabajo, y un botón de WhatsApp.</p>
    <p>Sirve para peluquerías, entrenadores, fotógrafos, oficios y profesionales independientes. Si tu objetivo es que te contacten, no necesitás más que esto.</p>

    <h3>¿Cuánto sale un sitio institucional?</h3>
    <p><strong>Desde US$249</strong>, con entrega de 2 a 4 semanas. Son varias páginas: servicios, equipo, contacto, y las secciones que tu rubro necesite.</p>
    <p>Se justifica cuando la web tiene que dar confianza antes que vos: clínicas, estudios jurídicos, constructoras, PyMEs. Ahí una sola página se queda corta.</p>

    <h3>¿Cuánto sale una tienda online?</h3>
    <p><strong>Desde US$399</strong>, de 2 a 4 semanas. Incluye catálogo, carrito, medios de pago y un panel para que cargues productos vos mismo.</p>
    <p>Ese precio es la base. Si sumás turnos, reservas o integración con algún sistema que ya usás, se cotiza aparte.</p>

    <h3>¿Qué tiene que incluir el precio sí o sí?</h3>
    <p>Cuatro cosas, y si alguna falta el presupuesto está incompleto: que se vea bien en celular, el certificado de seguridad (el candado del navegador), la configuración para que Google la encuentre, y el dominio con el hosting resueltos.</p>
    <p>Un presupuesto que no aclara quién gestiona el dominio suele terminar con el cliente creando cuentas en tres servicios distintos. Preguntalo antes de firmar.</p>

    <h3>¿Conviene pago único o mensualidad?</h3>
    <p>Pago único, salvo que necesites cambios seguidos. Con las plataformas por suscripción pagás todos los meses para siempre y la web no es tuya: si dejás de pagar, desaparece.</p>
    <p>Lo único que sí se paga siempre es el hosting y el dominio, y ronda entre <strong>US$10 y US$20 por mes</strong>. Eso no es una suscripción a un servicio: es el alquiler del lugar donde vive tu web.</p>

    <h3>¿Por qué hay presupuestos de US$50 y otros de US$2.000?</h3>
    <p>Porque no están vendiendo lo mismo. Abajo de US$100 normalmente es una plantilla cargada con tu logo, sin diseño propio ni configuración de SEO. Arriba de US$1.500 suele haber una agencia con estructura, cuentas y varias personas involucradas.</p>
    <p>Para un negocio chico o mediano en Argentina, el rango razonable en 2026 está entre <strong>US$150 y US$500</strong>.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Cuánto tarda en estar lista una página web?",
                respuesta:
                    "Entre 1 y 2 semanas para una landing page, y entre 2 y 4 semanas para un sitio institucional o una tienda online. El plazo se define desde el primer día, antes de que pagues nada.",
            },
            {
                pregunta: "¿Hay que pagar todo por adelantado?",
                respuesta:
                    "No. Se arranca con el 50% de seña y el resto se paga al entregar. Si el diseño inicial no te convence, se devuelve la seña completa.",
            },
            {
                pregunta: "¿El precio incluye el dominio y el hosting?",
                respuesta:
                    "Sí, se tramita todo: dominio .com o .com.ar, hosting, correos profesionales y certificado de seguridad. El costo mensual de mantener eso activo ronda los US$10 a US$20.",
            },
            {
                pregunta: "¿Hace falta saber de tecnología?",
                respuesta:
                    "No. Vos contás qué necesita tu negocio y del resto se encarga Logika: diseño, desarrollo, que ande en celular, que aparezca en Google, dominio y hosting.",
            },
        ],
    },

    "5-razones-para-tener-pagina-web-profesional": {
        respuestaCorta:
            "Un negocio necesita web propia por cinco motivos concretos: la cuenta de Instagram no es tuya y pueden cerrarla sin aviso, en Google la gente busca con intención de comprar y en redes no, una web propia da credibilidad frente a un competidor que solo tiene redes, funciona las 24 horas sin que estés respondiendo, y los datos de tus clientes quedan tuyos y no de la plataforma.",
        contenido: `
    <h2>¿Por qué mi negocio necesita una página web si ya tengo Instagram?</h2>
    <p>Porque la cuenta de Instagram no es tuya. La usás prestada, y las reglas las pone otro. Abajo están los cinco motivos, del más urgente al menos.</p>

    <h3>1. ¿Qué pasa si me cierran la cuenta de Instagram?</h3>
    <p>Perdés todo de golpe: seguidores, publicaciones y los mensajes con tus clientes. No hay a quién reclamarle y no hay copia de respaldo. Las suspensiones por errores automáticos son frecuentes y la recuperación puede tardar semanas, o no llegar.</p>
    <p>Una web propia no se puede suspender: el dominio está a tu nombre.</p>

    <h3>2. ¿Sirve para vender más aparecer en Google?</h3>
    <p>Sí, y bastante más que las redes, porque quien busca ya decidió comprar. Alguien que escribe "peluquería en Tandil" quiere un turno ahora; alguien que ve un reel estaba mirando el teléfono.</p>
    <p>Esa diferencia se llama intención de búsqueda, y es el motivo por el que un mismo negocio cierra más ventas desde Google que desde redes, con menos visitas.</p>

    <h3>3. ¿De verdad importa para la credibilidad?</h3>
    <p>Importa cuando te comparan. Frente a dos proveedores parecidos, el que tiene web propia parece establecido y el que solo tiene un perfil de Instagram parece que recién arranca, aunque tenga diez años de trayectoria.</p>
    <p>Pesa más cuanto más grande es la compra: para un servicio de US$50 casi no cambia nada, para uno de US$5.000 cambia todo.</p>

    <h3>4. ¿Puede vender mientras no estoy?</h3>
    <p>Sí, y es la diferencia más medible. Una web con catálogo, precios y un formulario responde consultas a las tres de la mañana y un domingo. Vos leés los pedidos cuando abrís.</p>
    <p>En redes, cada consulta espera a que alguien conteste. Si tardás cuatro horas, buena parte de esa gente ya le escribió a otro.</p>

    <h3>5. ¿De quién son los datos de mis clientes?</h3>
    <p>En redes, de la plataforma. En tu web, tuyos. Los mails y teléfonos que juntás con un formulario propio te quedan aunque cambies de red social, y podés escribirles directo sin depender de que un algoritmo les muestre tu publicación.</p>

    <h3>Entonces, ¿hay que dejar las redes?</h3>
    <p>No, se usan para cosas distintas. Las redes sirven para que te descubran; la web, para que te elijan. Lo habitual es publicar en Instagram y mandar a la web a quien quiere ver precios, trabajos anteriores o contratarte.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Puedo tener web sin dejar Instagram?",
                respuesta:
                    "Sí, y es lo recomendable. Las redes sirven para que te descubran y la web para que te elijan. Lo habitual es publicar en redes y mandar a la web a quien quiere ver precios o contratarte.",
            },
            {
                pregunta: "¿Cuánto cuesta la web más barata para un negocio chico?",
                respuesta:
                    "Una landing page arranca en US$149 y se entrega entre 1 y 2 semanas. Es la opción más económica para empezar a recibir consultas desde Google.",
            },
            {
                pregunta: "¿Mi web va a aparecer en Google?",
                respuesta:
                    "Sí. Todas las webs de Logika se configuran para que Google las encuentre y las muestre cuando alguien busca tu tipo de negocio. Esa configuración viene incluida en todos los planes.",
            },
        ],
    },

    "tienda-online-argentina-guia-completa": {
        respuestaCorta:
            "Para vender online en Argentina hacen falta cuatro cosas: una plataforma donde vivan los productos, un medio de pago conectado, una forma de enviar, y fotos con descripciones. Una tienda a medida arranca en US$399 y se entrega de 2 a 4 semanas. Las plataformas por suscripción cobran entre US$15 y US$50 por mes más una comisión sobre cada venta, así que conviene comparar el costo a doce meses y no el del primer mes.",
        contenido: `
    <h2>¿Cómo hago para vender por internet en Argentina?</h2>
    <p>Necesitás resolver cuatro cosas, y ninguna es opcional: dónde viven los productos, cómo cobrás, cómo enviás, y cómo se ven. Van en ese orden.</p>

    <h3>1. ¿Qué plataforma conviene para una tienda online?</h3>
    <p>Depende de cuántos productos tengas y de cuánto quieras pagar por mes. Si son pocos y recién empezás, un marketplace te saca del paso sin costo fijo. Si querés tienda propia, hay dos caminos.</p>
    <p>Las plataformas por suscripción cobran <strong>entre US$15 y US$50 por mes</strong> más una comisión por venta, y la tienda deja de existir el día que dejás de pagar. Una tienda propia se paga una vez, <strong>desde US$399</strong>, y después solo el hosting.</p>
    <p>La cuenta que conviene hacer es a doce meses, no del primer mes. Ahí las dos opciones se parecen menos de lo que aparentan.</p>

    <h3>2. ¿Cómo cobro los pagos online?</h3>
    <p>Con una pasarela conectada a la tienda, y en Argentina lo más usado es Mercado Pago porque casi todos ya tienen cuenta. Conviene ofrecer también transferencia bancaria: mucha gente la prefiere y a vos te evita la comisión.</p>
    <p>Tené presente que la pasarela se queda con un porcentaje de cada venta y que el dinero puede tardar días en estar disponible. Eso va en el precio de tus productos, no en tu margen.</p>

    <h3>3. ¿Cómo resuelvo los envíos?</h3>
    <p>Definí primero las zonas y recién después el precio. Lo más común es combinar tres opciones: retiro en el local, envío propio o en moto dentro de tu ciudad, y correo para el resto del país.</p>
    <p>El error más caro es prometer envío a todo el país sin haber calculado lo que sale mandar algo pesado a otra provincia. Esa diferencia se la come tu ganancia.</p>

    <h3>4. ¿Qué necesitan las fotos y las descripciones?</h3>
    <p>Las fotos, fondo claro y varios ángulos; las descripciones, medidas, materiales y todo lo que en un local se resolvería tocando el producto. Nadie compra lo que no puede ver bien.</p>
    <p>Una descripción que dice "remera negra" no vende. Una que dice el talle, la tela, cómo queda y cómo se lava, sí. Y de paso es lo que Google necesita para mostrarte.</p>

    <h3>¿Conviene invertir en una tienda online?</h3>
    <p>Conviene cuando ya vendés y las consultas por mensaje te están comiendo el día. Si contestás precios y stock uno por uno, la tienda te devuelve horas desde el primer mes.</p>
    <p>Si todavía no vendés nada, primero validá que haya demanda. Una tienda no crea clientes: le saca fricción a los que ya te quieren comprar.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Cuánto cuesta una tienda online en Argentina?",
                respuesta:
                    "Una tienda propia arranca en US$399 como pago único, con entrega de 2 a 4 semanas. Las plataformas por suscripción cobran entre US$15 y US$50 por mes más comisión por venta.",
            },
            {
                pregunta: "¿Necesito saber programar para manejar mi tienda?",
                respuesta:
                    "No. La tienda se entrega con un panel para cargar productos, precios y fotos sin tocar código. Si no querés ocuparte, existe un plan de mantenimiento opcional.",
            },
            {
                pregunta: "¿Puedo cobrar con Mercado Pago?",
                respuesta:
                    "Sí, y es lo más usado en Argentina porque casi todos ya tienen cuenta. También conviene aceptar transferencia bancaria, que evita la comisión de la pasarela.",
            },
        ],
    },

    "landing-page-que-es-y-para-que-sirve": {
        respuestaCorta:
            "Una landing page es una sola página con un único objetivo: que quien entra haga una acción concreta, casi siempre escribirte o comprar. Se diferencia de una web común en que no tiene menú ni secciones que distraigan. Sirve para campañas de publicidad, para un producto puntual o como primera web de un negocio de servicios. Arranca en US$149 y se entrega entre 1 y 2 semanas.",
        contenido: `
    <h2>¿Qué es una landing page?</h2>
    <p>Es una sola página diseñada para que quien entra haga una cosa específica: escribirte, pedir un presupuesto o comprar. Todo lo que no empuja hacia esa acción se saca, incluido el menú de navegación.</p>

    <h3>¿En qué se diferencia de una página web común?</h3>
    <p>En que una web común invita a recorrer y una landing empuja a decidir. Un sitio institucional tiene menú, varias secciones y muchas salidas posibles; una landing tiene una sola.</p>
    <p>Esa es toda la diferencia, y explica por qué convierte más: cada opción extra es una oportunidad de que la persona se vaya sin hacer nada.</p>

    <h3>¿Para qué sirve una landing page?</h3>
    <p>Para tres cosas, principalmente. Como destino de una campaña paga, donde mandás el tráfico de un anuncio y medís exactamente cuánto te costó cada consulta. Para lanzar un producto o servicio puntual sin tocar el resto de tu sitio. Y como primera web de un negocio de servicios que todavía no necesita más.</p>

    <h3>¿Qué tiene que tener una landing page?</h3>
    <p>Cinco piezas, en este orden: una promesa clara en lo primero que se ve, la prueba de que es cierta, qué recibe exactamente la persona, las respuestas a las dudas que la frenan, y un botón de acción repetido a lo largo de la página.</p>
    <p>La promesa se lee en tres segundos o no se lee. La prueba son trabajos anteriores, testimonios o números reales, no adjetivos. Y el botón se repite porque nadie vuelve a subir a buscarlo.</p>

    <h3>¿Cuánto cuesta y cuánto tarda?</h3>
    <p><strong>Desde US$149</strong>, lista entre <strong>1 y 2 semanas</strong>. Incluye que se vea bien en celular, el certificado de seguridad, la configuración para Google y el dominio con el hosting resueltos.</p>

    <h3>¿Conviene empezar por una landing o por un sitio completo?</h3>
    <p>Si vendés servicios, empezá por la landing. Es el punto de entrada más barato para que te encuentren y te escriban, y si más adelante necesitás más páginas se amplía.</p>
    <p>El sitio completo se justifica cuando tenés varios servicios que explicar por separado o cuando la web tiene que dar confianza antes de que hables con el cliente: estudios, clínicas, constructoras.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Cuánto cuesta una landing page?",
                respuesta:
                    "Desde US$149, con entrega de 1 a 2 semanas. Incluye diseño para celular, certificado de seguridad, configuración de Google, dominio y hosting.",
            },
            {
                pregunta: "¿Una landing page sirve para hacer publicidad?",
                respuesta:
                    "Sí, es su uso más común. Al no tener menú ni salidas alternativas, convierte más que mandar el tráfico de un anuncio a la home, y permite medir cuánto costó cada consulta.",
            },
            {
                pregunta: "¿Puedo pasar de una landing a un sitio más grande?",
                respuesta:
                    "Sí. La landing se amplía con más páginas cuando el negocio lo necesita, sin rehacer lo que ya está publicado.",
            },
        ],
    },
};

export function getArticulo(slug: string): Articulo | null {
    return articulos[slug] ?? null;
}

/** Compatibilidad con el llamado anterior, que solo esperaba el HTML del cuerpo. */
export function getArticleContent(slug: string): string | null {
    return articulos[slug]?.contenido ?? null;
}
