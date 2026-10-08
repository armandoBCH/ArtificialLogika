-- Clientes: cada presupuesto queda asignado a un cliente, con lo cobrado y lo gastado.
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: PENDIENTE. Hay que correrlo una vez, después de
-- supabase/presupuestos-y-pesos-2026-09-16.sql.
-- Cómo: Supabase Dashboard -> SQL Editor -> pegar todo y ejecutar.
--
-- Qué hace:
--   1. Crea la tabla `clients`.
--   2. Suma a `quotes` el cliente asignado, los pagos recibidos, los costos del
--      trabajo y si el cliente contrató los servicios mensuales.
--   3. Convierte en clientes a quienes ya tienen presupuestos guardados: uno por
--      persona, reconocida por WhatsApp, email o nombre y negocio.
--
-- Se puede correr más de una vez: lo que ya existe no se toca y el paso 3 solo
-- mira presupuestos que todavía no tienen cliente.
--
-- Sin BEGIN/COMMIT a propósito: el SQL Editor confirma cada sentencia por
-- separado, así que no daban una transacción única. La primera versión de este
-- archivo usaba una tabla temporal ON COMMIT DROP, que se borraba apenas se
-- creaba ("relation clave_por_presupuesto does not exist"), y dejaba apagado el
-- trigger de updated_at de quotes. Si te pasó eso, corré este entero: prende el
-- trigger y completa lo que faltó.

-- ─────────────────────────────────────────────────────────────
-- 1. Clientes
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT '',
    business TEXT NOT NULL DEFAULT '',
    whatsapp TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Igual que los presupuestos: datos de contacto y montos, sin lectura pública.
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solo admin" ON clients;
CREATE POLICY "Solo admin" ON clients FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com');

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─────────────────────────────────────────────────────────────
-- 2. Cobro de cada presupuesto
--    payments: [{ id, fecha: 'YYYY-MM-DD', monto, nota }]
--    costs:    [{ id, concepto, monto }]
--    Van en columnas y no dentro de `data` porque `data` es el documento que
--    recibe el cliente, y esto no lo ve nunca.
--    Borrar un cliente no borra sus presupuestos: quedan sin cliente.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE quotes
    ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS payments JSONB NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(payments) = 'array'),
    ADD COLUMN IF NOT EXISTS costs JSONB NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(costs) = 'array'),
    ADD COLUMN IF NOT EXISTS monthly_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS quotes_client_id_idx ON quotes (client_id);


-- ─────────────────────────────────────────────────────────────
-- 3. Clientes a partir de los presupuestos guardados
--    La clave de cada persona: los últimos 10 dígitos del WhatsApp; si no hay,
--    el email; si no, nombre y negocio. Es la misma regla con la que el
--    presupuestador evita duplicados al guardar.
-- ─────────────────────────────────────────────────────────────

-- Si una corrida anterior se cortó a mitad, el trigger pudo quedar apagado.
ALTER TABLE quotes ENABLE TRIGGER update_quotes_updated_at;

-- Un solo bloque: si algo falla adentro se deshace entero, trigger incluido.
DO $$
DECLARE
    r RECORD;
    nuevo UUID;
BEGIN
    -- Sin esto, el trigger les pondría la fecha de hoy a todos los presupuestos y
    -- la lista de guardados perdería su orden.
    ALTER TABLE quotes DISABLE TRIGGER update_quotes_updated_at;

    FOR r IN
        SELECT clave,
               -- De cada persona, los datos de su presupuesto más reciente.
               (array_agg(nombre ORDER BY updated_at DESC))[1] AS nombre,
               (array_agg(negocio ORDER BY updated_at DESC))[1] AS negocio,
               (array_agg(whatsapp ORDER BY updated_at DESC))[1] AS whatsapp,
               (array_agg(email ORDER BY updated_at DESC))[1] AS email,
               array_agg(id) AS ids
        FROM (
            SELECT id, updated_at, nombre, negocio, whatsapp, email,
                   COALESCE(
                       CASE WHEN length(digitos) >= 8 THEN right(digitos, 10) END,
                       NULLIF(lower(email), ''),
                       NULLIF(lower(nombre || '|' || negocio), '|')
                   ) AS clave
            FROM (
                SELECT id, updated_at,
                       btrim(COALESCE(data #>> '{cliente,nombre}', '')) AS nombre,
                       btrim(COALESCE(data #>> '{cliente,negocio}', '')) AS negocio,
                       btrim(COALESCE(data #>> '{cliente,whatsapp}', '')) AS whatsapp,
                       btrim(COALESCE(data #>> '{cliente,email}', '')) AS email,
                       regexp_replace(COALESCE(data #>> '{cliente,whatsapp}', ''), '\D', '', 'g') AS digitos
                FROM quotes
                WHERE client_id IS NULL
            ) AS datos
        ) AS con_clave
        WHERE clave IS NOT NULL
        GROUP BY clave
    LOOP
        INSERT INTO clients (name, business, whatsapp, email)
        VALUES (r.nombre, r.negocio, r.whatsapp, r.email)
        RETURNING id INTO nuevo;

        UPDATE quotes SET client_id = nuevo WHERE id = ANY (r.ids);
    END LOOP;

    ALTER TABLE quotes ENABLE TRIGGER update_quotes_updated_at;
END $$;

-- Para revisar: cada cliente con sus presupuestos. La última columna tiene que
-- decir "O": el trigger que actualiza la fecha de los presupuestos está prendido.
-- (El editor muestra solo el resultado de la última consulta, por eso va junto.)
SELECT c.name, c.business, c.whatsapp, count(q.id) AS presupuestos,
       (SELECT tgenabled FROM pg_trigger WHERE tgname = 'update_quotes_updated_at') AS trigger_fecha
FROM clients c
LEFT JOIN quotes q ON q.client_id = c.id
GROUP BY c.id
ORDER BY c.name;
