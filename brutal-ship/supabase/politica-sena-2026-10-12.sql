-- Política de la seña (2026-10-12): la seña YA NO se devuelve una vez aprobado el
-- presupuesto. Lo que se ofrece es un diseño previo sin cargo ANTES de pagar.
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: PENDIENTE de correr.
--
-- Cómo correrlo: Supabase Dashboard -> SQL Editor -> pegar y ejecutar.
-- No se puede aplicar con la anon key: no tiene permiso de UPDATE (RLS).
-- Se puede correr más de una vez: la segunda no encuentra nada que cambiar.
--
-- Qué hace:
--   1. Reescribe la respuesta de la pregunta de la forma de pago (tabla faqs), la única
--      del sitio que vive en la base y todavía promete la devolución.
--   2. Revisa si quedó la promesa vieja en las FAQ, los planes o los testimonios.
--
-- El editor muestra solo el resultado de la ÚLTIMA consulta: ahí está el control.
-- Tiene que decir "listo". Si dice "revisar", la columna "donde" dice qué corregir
-- a mano desde /admin (Precios, FAQs, Testimonios).
--
-- Para revertir: en /admin -> FAQs, reemplazá "Antes de pagar nada ... aprobás el presupuesto."
-- por "Si no te gusta el diseño inicial, te devolvemos la seña." (el texto anterior).

UPDATE faqs
SET answer     = 'Trabajamos con un 50% de seña para arrancar y el 50% restante al entregar. Antes de pagar nada te mostramos un diseño previo de tu web: si no te gusta, no pagás. La seña se paga recién cuando aprobás el presupuesto. Aceptamos transferencia bancaria y podemos armar un plan de pago si lo necesitás.',
    updated_at = now()
WHERE question ILIKE '%forma de pago%'
  AND answer ~* '(devolvemos la seña|seña completa|reintegr|reembols)';

-- Control (última consulta: es la que muestra el editor).
SELECT
    CASE WHEN count(*) = 0 THEN 'listo' ELSE 'revisar' END AS estado,
    count(*)                                               AS con_promesa_vieja,
    string_agg(tabla || ': ' || que, ' | ')                AS donde
FROM (
    SELECT 'faqs' AS tabla, question AS que
    FROM faqs
    WHERE answer ~* '(devolvemos la seña|seña completa|reintegr|reembols)'
    UNION ALL
    SELECT 'pricing_plans', name
    FROM pricing_plans
    WHERE features::text ~* '(devolvemos la seña|seña completa|reintegr|reembols)'
       OR price_note ~* '(devolvemos la seña|seña completa|reintegr|reembols)'
    UNION ALL
    SELECT 'testimonials', name
    FROM testimonials
    WHERE quote ~* '(devolvemos la seña|seña completa|reintegr|reembols)'
) t;
