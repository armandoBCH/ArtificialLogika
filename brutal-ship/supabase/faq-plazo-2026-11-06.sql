-- FAQ de plazos (2026-11-06): saca "siempre lo cumplimos". Logika no promete
-- plazos firmes (se sacó "Plazo firme" de la home el 2026-11-05).
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: PENDIENTE de correr.
--
-- Cómo correrlo: Supabase Dashboard -> SQL Editor -> pegar y ejecutar.
-- (O a mano: /admin -> FAQs -> "¿Cuánto tarda en estar lista mi web?".)
-- Se puede correr más de una vez: la segunda no encuentra nada que cambiar.
-- La última consulta tiene que decir "listo".

UPDATE faqs
SET answer = 'Para una Landing Page, entre 1 y 2 semanas. Para sitios institucionales o e-commerce, entre 2 y 4 semanas. Antes de arrancar te decimos cuánto va a llevar tu proyecto.'
WHERE question = '¿Cuánto tarda en estar lista mi web?'
  AND answer ILIKE '%siempre lo cumplimos%';

SELECT CASE
    WHEN EXISTS (SELECT 1 FROM faqs WHERE is_active AND answer ILIKE '%siempre lo cumplimos%') THEN 'revisar'
    ELSE 'listo'
END AS estado;
