-- Política de la seña (2026-10-12): la seña YA NO se devuelve una vez aprobado el
-- presupuesto. Lo que se ofrece es un diseño previo sin cargo ANTES de pagar.
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: PENDIENTE de correr.
--
-- Cómo correrlo: Supabase Dashboard -> SQL Editor -> pegar y ejecutar.
-- No se puede aplicar con la anon key: no tiene permiso de UPDATE (RLS).
--
-- Qué hace:
--   1. Reescribe la respuesta de la pregunta de la forma de pago (tabla faqs), la única
--      del sitio que vive en la base y todavía promete la devolución.
--   2. Lista lo que pueda quedar con la promesa vieja en los planes, las FAQ y los
--      testimonios. Es solo lectura: si devuelve filas, se corrigen a mano desde
--      /admin (Precios, FAQs).
--
-- Para revertir: en /admin -> FAQs, reemplazá "Antes de pagar nada ... no se devuelve."
-- por "Si no te gusta el diseño inicial, te devolvemos la seña." (el texto anterior).

BEGIN;

UPDATE faqs
SET answer     = 'Trabajamos con un 50% de seña para arrancar y el 50% restante al entregar. Antes de pagar nada te mostramos un diseño previo de tu web: si no te gusta, no pagás. La seña se paga recién cuando aprobás el presupuesto, y desde ahí no se devuelve. Aceptamos transferencia bancaria y podemos armar un plan de pago si lo necesitás.',
    updated_at = now()
WHERE question ILIKE '%forma de pago%'
  AND answer ~* '(devuelv|devolv|reintegr|reembols)';

-- Tiene que decir "UPDATE 1". Si dice "UPDATE 0", la pregunta se renombró o ya
-- se corrigió a mano: miralo en /admin -> FAQs.

COMMIT;

-- ─────────────────────────────────────────────────────────────
-- Control: no debería quedar ninguna fila con la promesa vieja.
-- ─────────────────────────────────────────────────────────────

SELECT 'faqs' AS tabla, question AS que, answer AS texto
FROM faqs
WHERE answer ~* '(devuelv|devolv|reintegr|reembols)'
UNION ALL
SELECT 'pricing_plans', name, features::text
FROM pricing_plans
WHERE features::text ~* '(devuelv|devolv|reintegr|reembols)'
   OR price_note ~* '(devuelv|devolv|reintegr|reembols)'
UNION ALL
SELECT 'testimonials', name, quote
FROM testimonials
WHERE quote ~* '(devuelv|devolv|reintegr|reembols)';
