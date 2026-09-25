-- Servicios mensuales del presupuestador.
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: PENDIENTE. Hay que correrlo una vez, después de
-- supabase/presupuestos-y-pesos-2026-09-16.sql.
-- Cómo: Supabase Dashboard -> SQL Editor -> pegar todo y ejecutar.
--
-- Qué hace:
--   1. Suma la columna `includes` al catálogo: los renglones de "qué incluye"
--      que viajan al presupuesto cuando se suma el ítem.
--   2. Carga cuatro servicios mensuales listos para sumar con un clic.
--
-- Se puede correr más de una vez: la columna se agrega solo si falta y cada
-- servicio se inserta solo si no existe otro con ese nombre.
--
-- OJO con los precios: son un punto de partida que inventamos para no arrancar
-- en blanco. Revisalos en Presupuestos -> Catálogo antes de mandar el primero.

BEGIN;

ALTER TABLE quote_catalog ADD COLUMN IF NOT EXISTS includes JSONB NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO quote_catalog (name, description, includes, price, unit, category, is_recurring, display_order)
SELECT v.name, v.description, v.includes, v.price, '', 'Mensuales', true, v.display_order
FROM (VALUES
    ('Hosting y dominio',
     'Mantener la web online, a tu nombre.',
     '["Hosting en servidores rápidos","Dominio .com o .com.ar","Certificado de seguridad (el candadito)","Casilla de correo del negocio"]'::jsonb,
     23000::numeric, 10),

    ('Mantenimiento y soporte',
     'Nos ocupamos de que la web siga andando y al día.',
     '["Cambios de textos y fotos","Copias de respaldo automáticas","Actualizaciones de seguridad","Soporte directo por WhatsApp"]'::jsonb,
     39000::numeric, 11),

    ('Carga de contenido',
     'Publicamos lo nuevo por vos, todos los meses.',
     '["Publicamos novedades o productos","Fotos preparadas para la web","Textos revisados"]'::jsonb,
     45000::numeric, 12),

    ('Informe de visitas',
     'Todos los meses te contamos cómo viene la web.',
     '["Cuánta gente entró","De dónde llegan tus clientes","Qué páginas miran más"]'::jsonb,
     18000::numeric, 13)
) AS v(name, description, includes, price, display_order)
WHERE NOT EXISTS (SELECT 1 FROM quote_catalog q WHERE q.name = v.name);

COMMIT;
