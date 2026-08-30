-- Correcciones de contenido derivadas del critique del 2026-08-23.
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: YA APLICADO el 2026-08-23 con la service_role key. Se conserva como
-- registro de qué cambió y como base para revertir si hiciera falta.
--
-- Cómo correrlo: Supabase Dashboard -> SQL Editor -> pegar y ejecutar.
-- No se puede aplicar con la anon key: no tiene permiso de UPDATE (RLS).
--
-- Tipos verificados contra el esquema real: categories = text[]; tags y stats = jsonb.
-- Backup del estado previo: .impeccable/db-backup-pre-clarify.json
-- Para revertir, restaurá los valores de ese archivo.

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. Typos en contenido de cara al cliente
-- ─────────────────────────────────────────────────────────────

-- RAGO AUTOMOTORES: "CONSECIONARIA" no existe; es "Concesionaria".
UPDATE portfolio_projects
SET category   = 'Concesionaria',
    categories = ARRAY['Concesionaria']::text[]
WHERE id = '0c0ca3b4-c649-4729-a1e4-aa287371dfd0';

-- Vanguard Legal Group: un "buffet" es una mesa de comida; un estudio jurídico es un "bufete".
UPDATE portfolio_projects
SET category   = 'Abogados',
    categories = ARRAY['Abogados', 'Bufete']::text[],
    stats      = '[]'::jsonb          -- quita el placeholder "SITIO DE MUESTRA"
WHERE id = '9f3f941b-44ba-4f55-99a1-97971ce02571';

-- Testimonio de Rago: "Concesonaria" -> "Concesionaria".
UPDATE testimonials
SET role = 'Concesionaria'
WHERE id = 'd98913aa-d699-432d-adec-d5444f2aa01d';


-- ─────────────────────────────────────────────────────────────
-- 2. Acentos y placeholders en el portafolio
-- ─────────────────────────────────────────────────────────────

UPDATE portfolio_projects
SET title      = 'Heladería Gelato',
    category   = 'Heladería',
    categories = ARRAY['Heladería', 'Pedidos']::text[],
    stats      = '[]'::jsonb
WHERE id = '1c01edc9-7481-4396-a10f-be8489e84c84';

UPDATE portfolio_projects
SET title      = 'Barbería Legacy',
    category   = 'Barbería',
    categories = ARRAY['Barbería']::text[],
    stats      = '[]'::jsonb
WHERE id = '22f38da2-9c8d-4cba-b138-94242f4a5675';

-- Una boda estaba categorizada como "ABOGADOS". También tenía un espacio al final del título.
UPDATE portfolio_projects
SET title      = 'Boda Carlos y Jenlys',
    category   = 'Evento',
    categories = ARRAY['Evento', 'Boda']::text[]
WHERE id = 'b442e93b-9476-4e78-a959-ea020187d654';

-- "Visualizacion: +" no comunica nada; mejor sin stat que con una vacía.
UPDATE portfolio_projects
SET stats = '[]'::jsonb
WHERE id = 'd7e3a1f0-8b2c-4d5e-a9f1-6c4e8d2b7a30';


-- ─────────────────────────────────────────────────────────────
-- 3. Precios: orden por precio y destacado en el plan del medio
--    Antes:  $149 -> $399 -> $249  (el más caro en el centro)
--    Ahora:  $149 -> $249 -> $399
-- ─────────────────────────────────────────────────────────────

UPDATE pricing_plans
SET display_order  = 1,
    cta_text       = 'Quiero mi web',
    is_featured    = false,
    featured_label = NULL
WHERE id = 'e6da1a38-497a-4c7f-b818-8f49e717bef7';   -- Landing Page  US$149

UPDATE pricing_plans
SET display_order  = 2,
    cta_text       = 'Quiero mi web',
    is_featured    = true,
    featured_label = 'Recomendado'
WHERE id = 'edb2bd15-8f60-49fc-bde1-6853cdbb5c70';   -- Sitio Institucional  US$249

UPDATE pricing_plans
SET display_order  = 3,
    cta_text       = 'Quiero mi web',
    is_featured    = false,
    featured_label = NULL
WHERE id = '1226ec74-c3e1-472c-965b-92235fb302eb';   -- E-commerce  US$399


-- ─────────────────────────────────────────────────────────────
-- 4. Un solo CTA en servicios (antes: "Lo Quiero" / "Consultar" / "Consultá")
-- ─────────────────────────────────────────────────────────────

UPDATE services
SET cta_text = 'Quiero mi web'
WHERE id IN (
    '7ad059a7-febd-4824-baf0-a8a2ce9cc0b1',
    '1a7f3ce9-e319-48eb-b6f2-1258bb857817',
    '179a03e2-781e-4063-b502-966ca3d2e1ff'
);


-- ─────────────────────────────────────────────────────────────
-- 5. Contraste: los badges de testimonio usaban colores que no llegan a 4.5:1
--    (text-electric-blue #4D96FF sobre blanco = 2.95:1).
-- ─────────────────────────────────────────────────────────────

UPDATE testimonials
SET badge_color = 'bg-electric-blue/20 text-blue-700'
WHERE badge_color = 'bg-electric-blue/20 text-electric-blue';

UPDATE testimonials
SET badge_color = 'bg-hot-coral/20 text-rose-700'
WHERE badge_color = 'bg-hot-coral/20 text-red-700';


-- ─────────────────────────────────────────────────────────────
-- 6. Se eliminó el modo oscuro del sitio; esta variante quedó muerta en la base.
-- ─────────────────────────────────────────────────────────────

UPDATE services
SET icon_color = 'text-green-600'
WHERE icon_color = 'text-green-600 dark:text-mint-fresh';

COMMIT;


-- ─────────────────────────────────────────────────────────────
-- Verificación (corré esto después del COMMIT)
-- ─────────────────────────────────────────────────────────────
-- SELECT name, price, display_order, is_featured, cta_text, featured_label
--   FROM pricing_plans ORDER BY display_order;
--
-- SELECT title, category, categories, stats
--   FROM portfolio_projects WHERE is_active ORDER BY display_order;
--
-- SELECT name, role FROM testimonials WHERE is_active;
