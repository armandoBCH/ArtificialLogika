-- =============================================
-- Cuota mensual de mantenimiento por plan
-- =============================================
-- Antes vivia escrita en lib/precios.ts (CUOTA_MENSUAL), atada al NOMBRE del
-- plan: si se renombraba un plan en el admin, perdia su cuota sin aviso.
-- Ahora es una columna del plan y se edita en /admin/precios.
--
-- NULL = el plan no tiene mantenimiento mensual y el sitio no muestra la linea.
-- Se puede correr mas de una vez: no pisa valores ya cargados.

ALTER TABLE pricing_plans
    ADD COLUMN IF NOT EXISTS monthly_price INTEGER
    CHECK (monthly_price IS NULL OR monthly_price >= 0);

-- Los valores que estaban en el codigo, para que el sitio no cambie.
UPDATE pricing_plans SET monthly_price = 23000
    WHERE name = 'Landing Page' AND monthly_price IS NULL;
UPDATE pricing_plans SET monthly_price = 39000
    WHERE name = 'Sitio Institucional' AND monthly_price IS NULL;
UPDATE pricing_plans SET monthly_price = 54000
    WHERE name IN ('E-commerce', 'E-commerce / Plataforma') AND monthly_price IS NULL;

-- Para revisar: cada plan con su cuota.
SELECT name, price, monthly_price, is_active
FROM pricing_plans
ORDER BY display_order;
