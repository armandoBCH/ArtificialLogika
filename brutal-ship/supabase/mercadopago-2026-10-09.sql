-- Cobros con Mercado Pago: el mantenimiento mensual automático y los links para
-- pagar una vez (la seña, el saldo o el total).
-- Proyecto: advwhuowosnbrbihhenf (el que usa NEXT_PUBLIC_SUPABASE_URL).
--
-- ESTADO: PENDIENTE. Hay que correrlo una vez, después de
-- supabase/clientes-2026-10-07.sql.
-- Cómo: Supabase Dashboard -> SQL Editor -> pegar todo y ejecutar.
--
-- Qué hace:
--   1. mp_subscriptions: un renglón por cada link de cobro automático que se
--      genera desde Clientes, con su estado en Mercado Pago.
--   2. mp_payments: un renglón por cada cobro mensual que avisa Mercado Pago. El
--      id es el de Mercado Pago, así que el mismo aviso dos veces no lo duplica.
--   3. mp_links: un renglón por cada link de pago único que se genera.
--   4. mp_charges: un renglón por cada pago de esos links que avisa Mercado Pago,
--      con el id del pago como clave (tampoco se duplica).
--
-- Van en tablas propias y no dentro de quotes.payments: el panel reescribe esa
-- lista entera cada vez que se carga un pago a mano, y un cobro que llegara con
-- la página abierta se perdería.
--
-- Solo el admin los lee y escribe desde el panel. El aviso de Mercado Pago
-- (app/api/mercadopago/webhook) escribe con la clave de servicio, que no pasa por
-- estas políticas. Se puede correr más de una vez.

CREATE TABLE IF NOT EXISTS mp_subscriptions (
    id TEXT PRIMARY KEY, -- id de la suscripción (preapproval) en Mercado Pago
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | authorized | paused | cancelled
    payer_email TEXT NOT NULL DEFAULT '',
    amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
    link TEXT NOT NULL DEFAULT '',
    next_payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_subscriptions_quote_id_idx ON mp_subscriptions (quote_id);

CREATE TABLE IF NOT EXISTS mp_payments (
    id TEXT PRIMARY KEY, -- id del cobro (authorized payment) en Mercado Pago
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    subscription_id TEXT NOT NULL DEFAULT '',
    month TEXT NOT NULL CHECK (month ~ '^20[0-9]{2}-(0[1-9]|1[0-2])$'), -- el mes que paga
    amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
    paid_on DATE NOT NULL, -- el día del cobro, o del último intento si lo rechazaron
    status TEXT NOT NULL DEFAULT '', -- approved cuenta como pagado
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_payments_quote_id_idx ON mp_payments (quote_id);

CREATE TABLE IF NOT EXISTS mp_links (
    id UUID PRIMARY KEY, -- lo genera el panel y viaja en el pago: "cobro:<presupuesto>:<link>"
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    preference_id TEXT NOT NULL DEFAULT '', -- el link (preferencia) en Mercado Pago
    concept TEXT NOT NULL DEFAULT '', -- Seña, Saldo, Pago total…
    amount INTEGER NOT NULL CHECK (amount > 0),
    link TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open', -- open | paid | void (anulado)
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_links_quote_id_idx ON mp_links (quote_id);

CREATE TABLE IF NOT EXISTS mp_charges (
    id TEXT PRIMARY KEY, -- id del pago en Mercado Pago
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    link_id UUID REFERENCES mp_links(id) ON DELETE SET NULL,
    concept TEXT NOT NULL DEFAULT '',
    amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
    paid_on DATE NOT NULL, -- el día de la aprobación, o del intento
    status TEXT NOT NULL DEFAULT '', -- approved cuenta como pagado
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_charges_quote_id_idx ON mp_charges (quote_id);

ALTER TABLE mp_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mp_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mp_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE mp_charges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solo admin" ON mp_subscriptions;
CREATE POLICY "Solo admin" ON mp_subscriptions FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com');

DROP POLICY IF EXISTS "Solo admin" ON mp_payments;
CREATE POLICY "Solo admin" ON mp_payments FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com');

DROP POLICY IF EXISTS "Solo admin" ON mp_links;
CREATE POLICY "Solo admin" ON mp_links FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com');

DROP POLICY IF EXISTS "Solo admin" ON mp_charges;
CREATE POLICY "Solo admin" ON mp_charges FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'armadobeatochang@gmail.com');

DROP TRIGGER IF EXISTS update_mp_subscriptions_updated_at ON mp_subscriptions;
CREATE TRIGGER update_mp_subscriptions_updated_at BEFORE UPDATE ON mp_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mp_payments_updated_at ON mp_payments;
CREATE TRIGGER update_mp_payments_updated_at BEFORE UPDATE ON mp_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mp_links_updated_at ON mp_links;
CREATE TRIGGER update_mp_links_updated_at BEFORE UPDATE ON mp_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mp_charges_updated_at ON mp_charges;
CREATE TRIGGER update_mp_charges_updated_at BEFORE UPDATE ON mp_charges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Para revisar: las dos columnas tienen que decir "listo".
-- (El editor muestra solo el resultado de la última consulta, por eso va junto.)
SELECT
    (SELECT CASE WHEN count(*) = 4 THEN 'listo' ELSE 'falta' END
     FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('mp_subscriptions', 'mp_payments', 'mp_links', 'mp_charges')) AS tablas,
    (SELECT CASE WHEN count(*) = 4 THEN 'listo' ELSE 'falta' END
     FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('mp_subscriptions', 'mp_payments', 'mp_links', 'mp_charges')) AS permisos;
