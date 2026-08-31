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

    "cuanto-cuesta-pagina-web-peluqueria": {
        respuestaCorta:
            "Una página web para una peluquería cuesta desde US$149 y se entrega entre 1 y 2 semanas. Con una sola página alcanza: galería de cortes, lista de precios, horarios, ubicación en el mapa y un botón de WhatsApp para pedir turno. No hace falta un sistema de turnos online salvo que atiendas varios profesionales en simultáneo.",
        contenido: `
    <h2>¿Cuánto sale una página web para una peluquería?</h2>
    <p>Desde US$149, lista entre 1 y 2 semanas. Es una landing page: una sola página con todo lo que alguien necesita para decidir sacar turno con vos.</p>
    <p>Ese precio incluye que se vea bien en celular, el certificado de seguridad, la configuración para que Google te encuentre, y el dominio con el hosting tramitados.</p>

    <h3>¿Qué tiene que tener la web de una peluquería?</h3>
    <p>Cinco cosas, y en este orden: fotos reales de tus trabajos, la lista de precios, los horarios, la ubicación con mapa, y un botón de WhatsApp bien visible.</p>
    <p>Las fotos son lo que más pesa. Nadie elige peluquería por el texto: elige por lo que ve. Diez fotos propias sirven más que cualquier descripción.</p>

    <h3>¿Necesito un sistema de turnos online?</h3>
    <p>Casi nunca. Si atendés vos o son dos personas, el botón de WhatsApp resuelve mejor: la clienta escribe, vos confirmás, y de paso queda la conversación abierta para recordarle.</p>
    <p>El turnero online se justifica cuando hay varios profesionales con agendas distintas y las consultas por mensaje se vuelven inmanejables. Ahí pasa a ser un desarrollo a medida y se cotiza aparte.</p>

    <h3>¿Conviene poner los precios en la web?</h3>
    <p>Sí, salvo que trabajes con presupuestos muy variables. Publicar precios filtra: la que escribe ya sabe cuánto sale y viene decidida, en vez de gastarte veinte mensajes preguntando.</p>
    <p>Si te preocupa quedar atado, poné "desde" y aclará que varía según largo o tipo de cabello. Eso es honesto y sigue filtrando.</p>

    <h3>¿Sirve si ya tengo Instagram con muchos seguidores?</h3>
    <p>Sirve para lo que Instagram no hace: aparecer cuando alguien busca "peluquería" más el nombre de tu ciudad. Esa búsqueda tiene intención de sacar turno hoy; el que ve un reel estaba mirando el teléfono.</p>
    <p>Además, la cuenta de Instagram no es tuya. Si la suspenden, perdés seguidores y conversaciones de golpe. El dominio de tu web está a tu nombre.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Cuánto tarda en estar lista la web de una peluquería?",
                respuesta:
                    "Entre 1 y 2 semanas desde que se aprueba el diseño. El plazo se define desde el primer día, antes de pagar nada.",
            },
            {
                pregunta: "¿Puedo cargar yo las fotos nuevas de mis trabajos?",
                respuesta:
                    "Sí. La web se entrega con un panel para cargar fotos sin tocar código. Si preferís no ocuparte, existe un plan de mantenimiento opcional.",
            },
            {
                pregunta: "¿La web aparece en Google Maps?",
                respuesta:
                    "La web y el mapa son cosas distintas. Para aparecer en Google Maps hay que dar de alta el Perfil de Empresa de Google, que es gratis, y la web se enlaza desde ahí. Ambas cosas se potencian.",
            },
        ],
    },

    "que-es-un-dominio-web-cuanto-cuesta": {
        respuestaCorta:
            "Un dominio es la dirección de tu web, lo que la gente escribe en el navegador: tunegocio.com. Se alquila por año, no se compra para siempre. Un .com cuesta habitualmente entre US$10 y US$15 por año en los registradores internacionales. Un .com.ar se tramita en NIC Argentina, el organismo oficial, y su costo anual se consulta en nic.ar porque se cobra en pesos y se actualiza.",
        contenido: `
    <h2>¿Qué es un dominio web?</h2>
    <p>Es la dirección de tu sitio: lo que alguien escribe en el navegador para llegar. En "tunegocio.com.ar", eso entero es el dominio.</p>
    <p>No es lo mismo que el hosting. El dominio es la dirección; el hosting es el lugar donde viven los archivos. Necesitás los dos, y suelen contratarse juntos.</p>

    <h3>¿El dominio se compra o se alquila?</h3>
    <p>Se alquila por períodos, normalmente de un año, y hay que renovarlo. Si no lo renovás, queda liberado y cualquiera puede tomarlo.</p>
    <p>Por eso conviene que esté a tu nombre y no al de quien te hizo la web. Es el activo más importante de tu presencia online: si lo perdés, perdés la dirección que tus clientes conocen y el posicionamiento que construiste.</p>

    <h3>¿Cuánto cuesta un dominio en Argentina?</h3>
    <p>Un .com ronda los US$10 a US$15 por año en los registradores internacionales. Un .com.ar se tramita en NIC Argentina, que es el organismo oficial, y se paga en pesos con una tarifa que se actualiza, así que conviene consultarla en nic.ar antes de decidir.</p>
    <p>La diferencia de precio entre extensiones es menor comparada con el resto de los costos de tener una web. No es el lugar donde ahorrar.</p>

    <h3>¿Conviene .com o .com.ar?</h3>
    <p>Si tu negocio atiende solo en Argentina, .com.ar; si pensás vender afuera o el .com está libre, .com. Muchos negocios registran los dos y redirigen uno al otro.</p>
    <p>El .com.ar tiene una ventaja práctica: le dice a Google y al visitante que sos de acá. Para una búsqueda local eso ayuda.</p>

    <h3>¿Qué pasa si el dominio que quiero está ocupado?</h3>
    <p>Probá variantes antes de resignarte: sumar el rubro, la ciudad o un guion. "estudiotorres.com.ar" ocupado no impide "estudiotorresabogados.com.ar".</p>
    <p>Evitá los guiones múltiples y los nombres muy largos: se dictan mal por teléfono, que sigue siendo cómo mucha gente comparte una dirección web.</p>
  `,
        preguntas: [
            {
                pregunta: "¿El dominio está incluido en el precio de la web?",
                respuesta:
                    "Logika tramita el dominio, el hosting, los correos y el certificado de seguridad. El costo de mantener eso activo ronda los US$10 a US$20 por mes.",
            },
            {
                pregunta: "¿El dominio queda a mi nombre?",
                respuesta:
                    "Sí, y conviene exigirlo siempre, sea quien sea que te haga la web. Un dominio registrado a nombre del proveedor te deja atado a él.",
            },
            {
                pregunta: "¿Puedo cambiar de dominio después?",
                respuesta:
                    "Se puede, pero cuesta posicionamiento: Google tiene que volver a asociar tu contenido a la dirección nueva. Conviene elegir bien la primera vez.",
            },
        ],
    },

    "que-es-el-hosting-web": {
        respuestaCorta:
            "El hosting es el servicio que mantiene tu web encendida y accesible las 24 horas: es el lugar donde viven los archivos, las fotos y los textos. Sin hosting, el dominio no lleva a ningún lado. Para una web de negocio chico o mediano el costo ronda entre US$10 y US$20 por mes incluyendo el dominio, y es el único gasto que se paga siempre.",
        contenido: `
    <h2>¿Qué es el hosting de una página web?</h2>
    <p>Es el servicio que mantiene tu web prendida y disponible. Los archivos, las fotos y los textos viven en una computadora que está encendida todo el día, y eso es lo que se alquila.</p>
    <p>Si el dominio es la dirección, el hosting es la casa. Podés tener la dirección, pero sin casa no hay adónde llegar.</p>

    <h3>¿Cuánto cuesta el hosting en Argentina?</h3>
    <p>Entre US$10 y US$20 por mes para una web de negocio chico o mediano, con el dominio incluido. Es el único costo que se paga siempre, hagas lo que hagas.</p>
    <p>Hay opciones más baratas, pero suelen compartir el servidor con cientos de sitios y eso se nota: la web tarda en cargar. Una web lenta pierde visitantes antes de que lean nada.</p>

    <h3>¿Puedo tener una web sin pagar hosting?</h3>
    <p>Existen planes gratuitos, pero tienen costos escondidos: publicidad de la plataforma en tu sitio, una dirección del tipo tunegocio.plataforma.com en vez de dominio propio, y límites de tráfico.</p>
    <p>Para un proyecto personal alcanza. Para un negocio que quiere que lo tomen en serio, no: la dirección con el nombre de otra empresa comunica exactamente lo contrario.</p>

    <h3>¿Qué pasa si dejo de pagar el hosting?</h3>
    <p>La web deja de verse. Aparece un error en lugar de tu sitio, y si pasa suficiente tiempo el proveedor puede borrar los archivos.</p>
    <p>Por eso conviene tener claro quién paga la renovación y con qué tarjeta, sobre todo si te la gestiona un tercero. Es el motivo más común por el que una web se cae de un día para el otro.</p>

    <h3>¿El hosting influye en que Google me muestre?</h3>
    <p>Influye por la velocidad y por la disponibilidad. Google mide cuánto tarda tu web en cargar y penaliza a las lentas. Si además el servidor se cae seguido y el buscador visita justo en ese momento, es peor.</p>
    <p>No hace falta el hosting más caro. Hace falta uno que responda rápido y esté disponible.</p>
  `,
        preguntas: [
            {
                pregunta: "¿El hosting y el dominio se pagan por separado?",
                respuesta:
                    "Se pueden contratar por separado, pero lo habitual es tenerlos juntos para simplificar. En Logika se tramitan ambos y el costo mensual conjunto ronda los US$10 a US$20.",
            },
            {
                pregunta: "¿Necesito saber de servidores para tener una web?",
                respuesta:
                    "No. La configuración de dominio, hosting, correos y certificado de seguridad la hace Logika. Vos no tenés que crear cuentas ni administrar nada.",
            },
            {
                pregunta: "¿Qué es el certificado de seguridad?",
                respuesta:
                    "Es lo que hace que tu web use https y que el navegador muestre el candado. Sin él, Chrome avisa que el sitio no es seguro y mucha gente se va antes de entrar. Viene incluido.",
            },
        ],
    },

    "cuanto-tarda-hacer-una-pagina-web": {
        respuestaCorta:
            "Una landing page está lista entre 1 y 2 semanas. Un sitio institucional o una tienda online, entre 2 y 4 semanas. El reloj arranca cuando aprobás el diseño, no cuando hacés la consulta, y lo que más suele demorar no es el desarrollo sino que el cliente junte los textos y las fotos.",
        contenido: `
    <h2>¿Cuánto tarda en hacerse una página web?</h2>
    <p>Entre 1 y 2 semanas una landing page, y entre 2 y 4 semanas un sitio institucional o una tienda online. El plazo se define antes de arrancar y no después.</p>

    <h3>¿Desde cuándo se cuentan esas semanas?</h3>
    <p>Desde que aprobás el diseño, no desde la primera consulta. Antes de eso hay una etapa corta donde se define qué necesita el sitio y se muestra cómo va a quedar.</p>
    <p>Esa etapa previa es la que más varía, porque depende de cuántas vueltas le des al diseño. Suele resolverse en días.</p>

    <h3>¿Qué es lo que más demora un proyecto web?</h3>
    <p>Los textos y las fotos del cliente. El desarrollo tiene un plazo bastante previsible; conseguir las fotos de los productos o que alguien escriba la descripción de los servicios, no.</p>
    <p>Si querés que el plazo se cumpla, tené eso listo antes de arrancar. Es la diferencia más grande entre un proyecto de dos semanas y uno que se estira a dos meses.</p>

    <h3>¿Se puede hacer más rápido?</h3>
    <p>A veces sí, y depende de tres cosas: que el alcance sea chico, que los contenidos estén listos, y que haya una sola persona decidiendo. Cuando hay que consultar a tres socios por cada cambio, el plazo se duplica solo.</p>
    <p>Desconfiá de quien te promete una web profesional en 24 horas. Eso es una plantilla con tu logo, no un sitio pensado para tu negocio.</p>

    <h3>¿Qué pasa si el plazo no se cumple?</h3>
    <p>En Logika, si no se cumple el plazo comprometido se suman funciones sin cargo. Es una garantía concreta, no una promesa vaga de puntualidad.</p>
    <p>Cuando pidas presupuesto, preguntá siempre qué pasa si se atrasan. La respuesta te dice mucho sobre cómo trabajan.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Cuánto tarda una tienda online?",
                respuesta:
                    "Entre 2 y 4 semanas desde la aprobación del diseño. Si sumás funciones como turnos o integraciones con otros sistemas, el plazo se recalcula y se avisa antes.",
            },
            {
                pregunta: "¿Puedo ver cómo va quedando durante el proceso?",
                respuesta:
                    "Sí. Primero se muestra un diseño antes de construir nada, y recién cuando lo aprobás empieza el desarrollo. Si el diseño no te convence, se devuelve la seña completa.",
            },
            {
                pregunta: "¿Qué necesito tener listo para que no se demore?",
                respuesta:
                    "Los textos de qué hacés, fotos propias de tu trabajo o tus productos, tu logo si tenés, y los datos de contacto. Con eso el plazo se cumple sin sobresaltos.",
            },
        ],
    },

    "como-aparecer-en-google-con-mi-negocio": {
        respuestaCorta:
            "Para que tu negocio aparezca en Google hacen falta dos cosas distintas y complementarias: dar de alta el Perfil de Empresa de Google, que es gratis y es lo que te pone en el mapa y en las búsquedas locales, y tener una web configurada para que el buscador la entienda. El perfil suele dar resultados en días; el posicionamiento de la web tarda semanas o meses.",
        contenido: `
    <h2>¿Cómo hago para que mi negocio aparezca en Google?</h2>
    <p>Con dos cosas que no son lo mismo: el Perfil de Empresa de Google y tu página web. La primera es gratis y rápida; la segunda es más lenta pero rinde más a largo plazo.</p>

    <h3>¿Qué es el Perfil de Empresa de Google?</h3>
    <p>Es la ficha que aparece a la derecha cuando alguien busca tu negocio por nombre, y lo que te pone en Google Maps. Es gratuito y lo das de alta vos mismo.</p>
    <p>Para un negocio con local a la calle es lo que más rápido rinde. Alguien que busca tu rubro más tu ciudad ve las fichas antes que cualquier resultado orgánico.</p>

    <h3>¿Qué hace falta para que el perfil funcione bien?</h3>
    <p>Cuatro cosas: la categoría correcta, horarios actualizados, fotos reales del local o del trabajo, y reseñas. Las reseñas son lo que más pesa, y se piden: la mayoría de los clientes contentos no las deja por su cuenta.</p>
    <p>Enlazá tu web desde el perfil. Las dos cosas se refuerzan.</p>

    <h3>¿Cuánto tarda una web en aparecer en Google?</h3>
    <p>Días en ser indexada, semanas o meses en posicionar. Que Google la conozca es rápido; que la muestre arriba para búsquedas competidas lleva tiempo y depende de cuántos otros sitios compitan por lo mismo.</p>
    <p>Desconfiá de quien te garantice el primer puesto en un plazo fijo. Nadie controla el algoritmo de Google, ni una agencia ni nosotros.</p>

    <h3>¿Qué tiene que tener la web para que Google la muestre?</h3>
    <p>Que cargue rápido, que se vea bien en celular, que tenga títulos claros por página y que el contenido responda lo que la gente busca. Eso es la base, y viene incluido en todas las webs de Logika.</p>
    <p>Lo que no se puede tercerizar es el contenido: si tu web no dice para qué ciudad trabajás ni qué servicios ofrecés, Google no tiene con qué mostrarte.</p>

    <h3>¿Sirve pagar publicidad en Google?</h3>
    <p>Sirve para tener resultados desde el primer día mientras el posicionamiento orgánico madura. Es un complemento, no un reemplazo: el día que dejás de pagar, desaparecés.</p>
    <p>Para un negocio que recién arranca, el orden que suele funcionar es: primero la ficha gratuita, después la web, y publicidad solo si hay presupuesto sobrante.</p>
  `,
        preguntas: [
            {
                pregunta: "¿El Perfil de Empresa de Google es gratis?",
                respuesta:
                    "Sí, darlo de alta y mantenerlo no tiene costo. Es de lo que más rinde para un negocio local y no requiere tener una web, aunque enlazarla ayuda a las dos.",
            },
            {
                pregunta: "¿La web de Logika ya viene preparada para Google?",
                respuesta:
                    "Sí. Todas las webs se configuran para que Google las encuentre y las muestre cuando alguien busca tu tipo de negocio. Esa configuración viene incluida en todos los planes.",
            },
            {
                pregunta: "¿Puedo garantizar el primer puesto en Google?",
                respuesta:
                    "No, y quien lo prometa te está engañando. El algoritmo de Google no lo controla nadie fuera de Google. Lo que sí se puede es darle todas las señales correctas para competir.",
            },
        ],
    },

    "necesito-web-si-tengo-whatsapp-business": {
        respuestaCorta:
            "WhatsApp Business y una página web resuelven cosas distintas. WhatsApp es donde cerrás la conversación con alguien que ya te encontró; la web es lo que hace que te encuentren. Si toda tu llegada de clientes depende de que alguien te pase el número, no tenés un canal de captación: tenés uno de atención.",
        contenido: `
    <h2>¿Necesito una página web si ya uso WhatsApp Business?</h2>
    <p>Sí, porque hacen cosas distintas. WhatsApp cierra la conversación con quien ya te encontró; la web es lo que hace que te encuentre alguien que no te conoce.</p>

    <h3>¿Qué hace WhatsApp que la web no hace?</h3>
    <p>Conversar. Responder dudas concretas, mandar fotos, coordinar un turno, cerrar una venta. Para eso es imbatible y no hay que reemplazarlo.</p>
    <p>El catálogo de WhatsApp Business también sirve para mostrar productos rápido. Lo que no hace es aparecer cuando alguien busca tu rubro en Google.</p>

    <h3>¿Qué hace la web que WhatsApp no hace?</h3>
    <p>Que te encuentren sin conocerte. Nadie descubre un número de WhatsApp buscando en Google; descubre una web, y desde ahí te escribe.</p>
    <p>La web también contesta sola las preguntas que hoy respondés veinte veces por día: precios, horarios, qué incluye el servicio, dónde estás. Eso te devuelve tiempo.</p>

    <h3>¿Se pueden usar juntos?</h3>
    <p>Es lo que mejor funciona, y es el esquema más común: la web trae a la persona y el botón de WhatsApp la lleva a la conversación. Ninguna de las dos sustituye a la otra.</p>
    <p>Todas las webs de Logika llevan botón de WhatsApp integrado, justamente porque en Argentina es donde la gente prefiere escribir.</p>

    <h3>¿Y si mis clientes llegan todos por recomendación?</h3>
    <p>Entonces la web te sirve para otra cosa: para que la recomendación cierre. Cuando alguien te recomienda, la otra persona busca tu nombre antes de escribirte, y lo que encuentra decide si te escribe o no.</p>
    <p>Sin web, esa búsqueda no encuentra nada, o encuentra un perfil de Instagram con la última publicación de hace ocho meses.</p>
  `,
        preguntas: [
            {
                pregunta: "¿La web puede tener botón de WhatsApp?",
                respuesta:
                    "Sí, y viene incluido en todos los planes. El visitante toca el botón y se abre la conversación con tu número, con un mensaje inicial ya escrito si querés.",
            },
            {
                pregunta: "¿Puedo mostrar mi catálogo en la web en vez de en WhatsApp?",
                respuesta:
                    "Sí, y es lo recomendable si tenés muchos productos. La web permite buscar, filtrar y ver precios sin que nadie tenga que preguntar, y además la encuentra Google.",
            },
            {
                pregunta: "¿Cuánto cuesta la web más simple con botón de WhatsApp?",
                respuesta:
                    "Una landing page arranca en US$149 y se entrega entre 1 y 2 semanas, con botón de WhatsApp, diseño para celular y configuración para Google incluidos.",
            },
        ],
    },

    "que-es-un-mockup-web": {
        respuestaCorta:
            "Un mockup es una vista previa de cómo va a quedar tu web, hecha antes de programar nada. Sirve para que veas el diseño y pidas cambios cuando corregir todavía es barato. En Logika el mockup y el presupuesto no tienen costo ni compromiso, y si el diseño no te convence se devuelve la seña completa.",
        contenido: `
    <h2>¿Qué es un mockup de una página web?</h2>
    <p>Es una vista previa del diseño, hecha antes de escribir una línea de código. Ves cómo va a quedar tu web: los colores, la disposición, dónde van las fotos y los botones.</p>

    <h3>¿Para qué sirve pedir un mockup antes?</h3>
    <p>Para cambiar de opinión cuando cambiar todavía es barato. Mover una sección en un diseño lleva minutos; moverla en un sitio ya programado lleva horas.</p>
    <p>También sirve para saber con qué te vas a encontrar. Un presupuesto sin mockup te pide que confíes en una descripción; con mockup, ves.</p>

    <h3>¿El mockup se cobra?</h3>
    <p>En Logika no, y tampoco genera compromiso. Se muestra el diseño y decidís después.</p>
    <p>Hay estudios que lo cobran, y es una postura válida porque lleva trabajo. Lo que conviene evitar es pagar el proyecto completo sin haber visto nada.</p>

    <h3>¿Qué pasa si no me gusta el diseño?</h3>
    <p>Se ajusta hasta que te guste, y si aun así no convence se devuelve la seña completa y ahí termina. Esa es la garantía, y es el motivo por el que el diseño va antes que el desarrollo.</p>
    <p>El orden importa: primero mostrar, después construir. Al revés, el que asume todo el riesgo sos vos.</p>

    <h3>¿Cuántos cambios puedo pedir?</h3>
    <p>Los que hagan falta para que el diseño esté bien, dentro de lo razonable. La etapa de diseño existe justamente para eso.</p>
    <p>Lo que sí conviene es juntar los comentarios y mandarlos de una vez, en vez de de a uno por día. Acelera el proceso para los dos lados.</p>
  `,
        preguntas: [
            {
                pregunta: "¿El mockup tiene costo?",
                respuesta:
                    "No. En Logika el mockup y el presupuesto son sin cargo y sin compromiso: ves cómo quedaría tu web antes de pagar nada.",
            },
            {
                pregunta: "¿Qué pasa si apruebo el diseño y después quiero cambiarlo?",
                respuesta:
                    "Los cambios chicos entran dentro del proyecto. Un cambio de rumbo grande después de aprobado el diseño se conversa, porque implica rehacer trabajo ya hecho.",
            },
            {
                pregunta: "¿Cuánto tardan en mostrarme el mockup?",
                respuesta:
                    "Depende de la carga de trabajo del momento, pero es cuestión de días, no de semanas. El plazo del proyecto se cuenta recién desde que aprobás ese diseño.",
            },
        ],
    },

    "como-elegir-quien-me-hace-la-web": {
        respuestaCorta:
            "Para elegir quién te hace la web, mirá cinco cosas antes que el precio: que te muestren trabajos publicados que puedas visitar, que el dominio quede a tu nombre, que el presupuesto aclare qué incluye y qué no, que te digan un plazo concreto y qué pasa si no lo cumplen, y que te expliquen cómo vas a poder cambiar contenido después. Un presupuesto muy barato que no aclara nada de esto suele salir más caro.",
        contenido: `
    <h2>¿Cómo elijo quién me hace la página web?</h2>
    <p>Comparando cinco cosas concretas, y el precio recién al final. Un presupuesto sin estos puntos definidos no se puede comparar con otro, porque no sabés si están vendiendo lo mismo.</p>

    <h3>1. ¿Puedo ver trabajos que hayan hecho?</h3>
    <p>Pedí direcciones web que puedas abrir, no capturas de pantalla. Una captura puede ser un diseño que nunca se publicó; una web que funciona es prueba de que llegaron hasta el final.</p>
    <p>Fijate también si esos sitios cargan rápido y se ven bien en tu celular. Es la forma más simple de evaluar la calidad sin saber de tecnología.</p>

    <h3>2. ¿El dominio va a quedar a mi nombre?</h3>
    <p>Preguntalo explícitamente, porque es donde más gente queda atada. Si el dominio está a nombre del proveedor, el día que quieras cambiar no te podés llevar tu dirección.</p>
    <p>Lo mismo con los accesos al hosting y al panel de administración. Que te los gestionen está bien; que no te los den si los pedís, no.</p>

    <h3>3. ¿Qué incluye y qué no incluye el precio?</h3>
    <p>Un presupuesto serio aclara si están incluidos el dominio, el hosting, el certificado de seguridad, los correos y la configuración para Google. Si no lo dice, preguntalo antes de firmar.</p>
    <p>Ahí suele estar la diferencia entre dos presupuestos que parecían iguales. Uno incluye cuatro servicios y el otro te los factura después.</p>

    <h3>4. ¿Cuál es el plazo y qué pasa si no se cumple?</h3>
    <p>Pedí una fecha concreta y preguntá qué sucede si se atrasan. La respuesta te dice más sobre cómo trabajan que cualquier portafolio.</p>
    <p>En Logika el plazo es de 1 a 2 semanas para una landing y de 2 a 4 para un sitio institucional o tienda, y si no se cumple se suman funciones sin cargo.</p>

    <h3>5. ¿Voy a poder cambiar cosas yo?</h3>
    <p>Preguntá cómo se actualiza un precio, una foto o un horario después de la entrega. Si la respuesta es "escribime y lo cambio", vas a depender de esa persona para siempre.</p>
    <p>Lo razonable es que te entreguen un panel para lo que cambia seguido, y que el mantenimiento mensual sea opcional y no obligatorio.</p>

    <h3>¿Y el precio?</h3>
    <p>Recién ahí. Con los cinco puntos definidos, comparar precios tiene sentido; sin ellos, estás comparando cosas distintas.</p>
    <p>Para un negocio chico o mediano en Argentina, el rango razonable en 2026 va de US$150 a US$500 según el tipo de sitio.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Conviene el más barato?",
                respuesta:
                    "No necesariamente. Abajo de US$100 suele ser una plantilla con tu logo, sin diseño propio ni configuración de SEO, y con servicios que después se facturan aparte. Compará qué incluye cada uno.",
            },
            {
                pregunta: "¿Es mejor una agencia grande o alguien independiente?",
                respuesta:
                    "Depende del proyecto. Para un negocio chico o mediano, el trato directo con quien diseña y publica suele ser más rápido y más barato que pasar por varias personas.",
            },
            {
                pregunta: "¿Qué señales de alarma tengo que mirar?",
                respuesta:
                    "Que no muestren trabajos publicados, que no aclaren a nombre de quién queda el dominio, que garanticen el primer puesto en Google, o que pidan el pago completo por adelantado sin mostrar un diseño antes.",
            },
        ],
    },

    "que-necesito-antes-de-encargar-mi-web": {
        respuestaCorta:
            "Antes de encargar tu web conviene tener cuatro cosas: qué querés que la web logre en una frase, los textos de qué hacés y para quién, fotos propias de tu trabajo o tus productos, y tus datos de contacto y horarios. El logo ayuda pero no frena. Tener esto listo es la diferencia entre un proyecto que se entrega en dos semanas y uno que se estira a dos meses.",
        contenido: `
    <h2>¿Qué necesito tener listo antes de encargar mi página web?</h2>
    <p>Cuatro cosas, y ninguna requiere saber de tecnología. Juntarlas antes de arrancar es lo que más acorta los plazos, porque el desarrollo casi nunca es lo que demora.</p>

    <h3>1. ¿Qué tiene que lograr la web?</h3>
    <p>Escribilo en una frase, y que sea una sola cosa: que me escriban por WhatsApp, que me pidan turno, que compren online, que me encuentren cuando busquen mi rubro.</p>
    <p>Suena obvio, pero es lo que define todo el resto. Una web que quiere lograr cinco cosas a la vez no logra ninguna bien.</p>

    <h3>2. ¿Qué textos hacen falta?</h3>
    <p>Qué hacés, para quién, y qué te diferencia. No hace falta que estén redactados como para publicar: alcanza con que la información esté, escrita como se la contarías a un cliente.</p>
    <p>Si tenés precios definidos, incluilos. Publicarlos filtra consultas y te ahorra conversaciones que no van a ningún lado.</p>

    <h3>3. ¿Qué fotos necesito?</h3>
    <p>Fotos propias de tu trabajo, tus productos o tu local. Es lo que más pesa en la decisión de quien entra, y es lo que más suele faltar.</p>
    <p>No hace falta un fotógrafo: un celular moderno con buena luz alcanza. Lo que no funciona son las fotos de banco de imágenes, porque se nota y restan credibilidad.</p>

    <h3>4. ¿Qué datos de contacto?</h3>
    <p>El número de WhatsApp, el correo, la dirección si tenés local, los horarios y los enlaces a tus redes. Parece menor y es lo que más veces queda incompleto en el arranque.</p>

    <h3>¿Necesito tener logo?</h3>
    <p>Ayuda pero no frena. Se puede arrancar sin logo y sumarlo después, o resolver la identidad visual con tipografía y colores mientras tanto.</p>
    <p>Lo que sí conviene definir antes son los colores, porque cambiarlos después implica revisar todo el sitio.</p>

    <h3>¿Y si no tengo nada de esto?</h3>
    <p>Se puede arrancar igual, y parte del trabajo es ayudarte a ordenarlo. Solo tené presente que el plazo se cuenta desde que el contenido está, no desde la consulta.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Puedo mandar los textos a medida que los tengo?",
                respuesta:
                    "Se puede, pero alarga el proyecto. Lo que mejor funciona es juntar todo antes de arrancar el desarrollo: ahí el plazo de 1 a 2 semanas se cumple sin sobresaltos.",
            },
            {
                pregunta: "¿Ustedes escriben los textos?",
                respuesta:
                    "Se ordena y se mejora lo que traés, y se ayuda a definir qué falta. Lo que no se puede inventar es la información propia de tu negocio: precios, servicios, forma de trabajar.",
            },
            {
                pregunta: "¿Puedo usar fotos de internet?",
                respuesta:
                    "No conviene, por dos motivos: se nota que no son tuyas y resta credibilidad, y además muchas tienen derechos de autor. Fotos propias con un celular funcionan mejor.",
            },
        ],
    },

    "por-que-mi-web-no-aparece-en-google": {
        respuestaCorta:
            "Si tu web no aparece en Google, las causas más frecuentes son cuatro: es demasiado nueva y el buscador todavía no la indexó, está bloqueada por configuración, no tiene contenido que responda a lo que la gente busca, o sí aparece pero para búsquedas donde competís con sitios mucho más grandes. La forma de saber cuál es tu caso es buscar site: seguido de tu dominio en Google.",
        contenido: `
    <h2>¿Por qué mi página web no aparece en Google?</h2>
    <p>Casi siempre por una de cuatro razones, y hay una forma rápida de saber cuál. Buscá en Google la palabra site: seguida de tu dominio, sin espacio. Si aparecen tus páginas, Google te conoce y el problema es de posicionamiento. Si no aparece nada, ni siquiera te indexó.</p>

    <h3>1. ¿Es muy nueva mi web?</h3>
    <p>Si la publicaste hace menos de dos semanas, es lo más probable. Google necesita encontrarla, leerla y decidir dónde ubicarla, y eso no es inmediato.</p>
    <p>Se puede acelerar dando de alta el sitio en Google Search Console y pidiendo la indexación de las páginas principales. Es gratis.</p>

    <h3>2. ¿Está bloqueada sin que lo sepa?</h3>
    <p>Pasa más de lo que parece. Un archivo de configuración mal puesto o una casilla activada durante el desarrollo pueden decirle a Google que no indexe el sitio, y nadie se entera hasta meses después.</p>
    <p>Si buscaste con site: y no aparece nada pese a que la web tiene tiempo, este es el primer lugar donde mirar.</p>

    <h3>3. ¿Tiene contenido que responda lo que la gente busca?</h3>
    <p>Una web de una sola página que solo dice el nombre del negocio y un teléfono le da muy poco material a Google. Si no está escrito qué servicios ofrecés y en qué ciudad, no hay con qué mostrarte.</p>
    <p>Esto es lo que más se subestima: el posicionamiento no es solo configuración técnica, es tener escrito lo que la gente busca.</p>

    <h3>4. ¿Estás compitiendo por búsquedas imposibles?</h3>
    <p>Si esperás aparecer buscando una palabra muy general, vas a competir con sitios enormes. Una web local nueva no va a ganar esa pelea, y tampoco le sirve: quien busca así rara vez está listo para comprar.</p>
    <p>Probá con búsquedas más específicas, que incluyan tu rubro y tu ciudad. Ahí es donde un negocio local puede competir y donde están los clientes reales.</p>

    <h3>¿Cómo verifico en qué puesto estoy?</h3>
    <p>Con Google Search Console, que es gratis y te muestra para qué búsquedas aparecés y en qué posición. Es más confiable que buscarte a vos mismo, porque tu navegador personaliza los resultados según tu historial.</p>
    <p>Ojo: los datos aparecen desde que das de alta el sitio, no hay histórico anterior. Cuanto antes lo hagas, antes empezás a medir.</p>
  `,
        preguntas: [
            {
                pregunta: "¿Cuánto tarda una web nueva en aparecer en Google?",
                respuesta:
                    "Días en ser indexada y semanas o meses en posicionar para búsquedas competidas. Darla de alta en Google Search Console y pedir la indexación acelera la primera parte.",
            },
            {
                pregunta: "¿Cómo sé si Google conoce mi web?",
                respuesta:
                    "Buscá en Google la palabra site: seguida de tu dominio, sin espacio. Si aparecen tus páginas, está indexada. Si no aparece nada, el problema es anterior al posicionamiento.",
            },
            {
                pregunta: "¿Las webs de Logika vienen configuradas para Google?",
                respuesta:
                    "Sí, la configuración técnica viene incluida en todos los planes: velocidad, diseño para celular, títulos por página y datos estructurados. Lo que no se puede tercerizar es el contenido propio del negocio.",
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
