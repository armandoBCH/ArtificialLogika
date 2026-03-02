-- =============================================
-- Logika Database Schema — Complete Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Site Config (key-value global settings)
CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Pricing Plans
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_type TEXT NOT NULL DEFAULT 'Pago Único',
    price_note TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    featured_label TEXT,
    cta_text TEXT NOT NULL DEFAULT 'Consultar',
    cta_style TEXT NOT NULL DEFAULT 'default' CHECK (cta_style IN ('primary', 'secondary', 'default')),
    header_bg TEXT NOT NULL DEFAULT 'bg-ink-black',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price_from TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'web',
    icon_color TEXT NOT NULL DEFAULT 'text-primary',
    accent_color TEXT NOT NULL DEFAULT 'bg-primary',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    popular_label TEXT,
    cta_text TEXT NOT NULL DEFAULT 'Consultar',
    cta_style TEXT NOT NULL DEFAULT 'default' CHECK (cta_style IN ('primary', 'secondary', 'default')),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Portfolio Projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    accent_color TEXT NOT NULL DEFAULT 'primary',
    stats JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    badge_text TEXT NOT NULL DEFAULT '',
    badge_color TEXT NOT NULL DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. FAQs
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Contact Leads
CREATE TABLE IF NOT EXISTS contact_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    business_type TEXT NOT NULL DEFAULT 'No especificado',
    message TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- Read-only public access for content tables (anon can SELECT)
CREATE POLICY "Public read access" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pricing_plans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON faqs FOR SELECT USING (true);

-- Contact leads: anon can INSERT (form submission), no SELECT
CREATE POLICY "Anyone can submit contact form" ON contact_leads FOR INSERT WITH CHECK (true);

-- =============================================
-- Auto-update updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_projects_updated_at BEFORE UPDATE ON portfolio_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Seed Data
-- =============================================

-- Site Config
INSERT INTO site_config (key, value, type, description) VALUES
('whatsapp_number', '5491112345678', 'string', 'Número de WhatsApp para contacto'),
('whatsapp_message', 'Hola! Quiero consultar por una web para mi negocio', 'string', 'Mensaje predeterminado de WhatsApp'),
('email', 'hola@logika.com', 'string', 'Email de contacto'),
('location', 'Buenos Aires, Argentina', 'string', 'Ubicación de la empresa'),
('instagram_url', '', 'string', 'URL de Instagram'),
('response_time', '48hs', 'string', 'Tiempo de respuesta prometido');

-- Pricing Plans
INSERT INTO pricing_plans (name, subtitle, price, original_price, currency, payment_type, price_note, features, is_featured, featured_label, cta_text, cta_style, header_bg, display_order) VALUES
('Landing Page', 'Ideal para emprendedores y freelancers.', 149, NULL, 'USD', 'Pago Único', NULL,
 '[{"text":"Mockup previo gratis","icon":"draw","is_highlighted":true,"icon_bg":"bg-hot-coral"},{"text":"Presupuesto sin cargo","icon":"request_quote","is_highlighted":true,"icon_bg":"bg-accent-yellow"},{"text":"Página con tu info","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Perfecto en celular","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Botón de WhatsApp","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Formulario contacto","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Aparece en Google","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"1 mes de soporte","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"}]'::jsonb,
 false, NULL, 'Consultar', 'default', 'bg-ink-black', 1),

('E-commerce', 'Vendé online. Tu tienda propia.', 399, 499, 'USD', 'Precio Base', 'Precio de lanzamiento — cupos limitados.',
 '[{"text":"Mockup previo gratis","icon":"draw","is_highlighted":true,"icon_bg":"bg-hot-coral"},{"text":"Presupuesto sin cargo","icon":"request_quote","is_highlighted":true,"icon_bg":"bg-accent-yellow"},{"text":"Todo Institucional +","icon":"check","is_highlighted":true,"icon_bg":"bg-accent-yellow"},{"text":"Catálogo con fotos","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Carrito y checkout","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Pagos online","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Métricas (visitas)","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"1 mes de soporte","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"}]'::jsonb,
 true, '🔥 Más Elegido', 'Quiero Mi Tienda', 'primary', 'bg-primary', 2),

('Sitio Institucional', 'Tu negocio completo en internet.', 249, NULL, 'USD', 'Pago Único', NULL,
 '[{"text":"Mockup previo gratis","icon":"draw","is_highlighted":true,"icon_bg":"bg-hot-coral"},{"text":"Presupuesto sin cargo","icon":"request_quote","is_highlighted":true,"icon_bg":"bg-accent-yellow"},{"text":"Todo lo de Landing +","icon":"check","is_highlighted":true,"icon_bg":"bg-accent-yellow"},{"text":"Diseño a medida","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Hasta 5 páginas","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Mapa interactivo","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"Galería de fotos","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"},{"text":"1 mes de soporte","icon":"check","is_highlighted":false,"icon_bg":"bg-accent-yellow"}]'::jsonb,
 false, NULL, 'Consultar', 'default', 'bg-ink-black', 3);

-- Services
INSERT INTO services (name, description, price_from, icon, icon_color, accent_color, features, is_popular, popular_label, cta_text, cta_style, display_order) VALUES
('Página Web One-Page', 'Perfecta para emprendedores y negocios que quieren estar online rápido. Todo en una sola página, simple y efectivo.', 'Desde $149', 'web', 'text-primary', 'bg-primary',
 '[{"text":"Diseño Responsive","visible":true,"order":0},{"text":"Formulario de Contacto","visible":true,"order":1},{"text":"Integración con Redes","visible":true,"order":2},{"text":"Optimización SEO Básica","visible":true,"order":3},{"text":"Galería de Fotos","visible":true,"order":4},{"text":"Mapa de Ubicación","visible":true,"order":5},{"text":"Animaciones y Efectos","visible":true,"order":6},{"text":"Dominio Personalizado","visible":true,"order":7}]'::jsonb,
 false, NULL, 'Consultar', 'default', 1),

('Landing Page Conversión', 'Diseñada para captar clientes y generar consultas. Ideal si querés promocionar un servicio específico o una campaña.', 'Desde $199', 'track_changes', 'text-green-600 dark:text-mint-fresh', 'bg-mint-fresh',
 '[{"text":"Copywriting Persuasivo","visible":true,"order":0},{"text":"Textos Persuasivos","visible":true,"order":1},{"text":"Botón de WhatsApp","visible":true,"order":2},{"text":"Velocidad Optimizada","visible":true,"order":3},{"text":"Seguimiento de Conversiones","visible":true,"order":4},{"text":"Diseño A/B Testing Ready","visible":true,"order":5},{"text":"Call to Action Estratégicos","visible":true,"order":6}]'::jsonb,
 true, 'POPULAR', 'Lo Quiero', 'primary', 2),

('Web Multi-Página', 'Sitio web completo con varias secciones. Ideal para negocios establecidos que necesitan mostrar todo lo que hacen.', 'Desde $349', 'layers', 'text-hot-coral', 'bg-hot-coral',
 '[{"text":"Hasta 10 Páginas Internas","visible":true,"order":0},{"text":"Editable por Vos","visible":true,"order":1},{"text":"Blog Integrado","visible":true,"order":2},{"text":"SEO Avanzado","visible":true,"order":3},{"text":"Panel de Administración","visible":true,"order":4},{"text":"Sistema de Reservas / Turnos","visible":true,"order":5},{"text":"Catálogo de Productos","visible":true,"order":6}]'::jsonb,
 false, NULL, 'Consultar', 'default', 3);

-- Portfolio Projects
INSERT INTO portfolio_projects (title, category, tags, description, image_url, image_alt, accent_color, stats, display_order) VALUES
('Estilo María', 'Peluquería', '["Peluquería","Servicios"]'::jsonb,
 'Web completa para peluquería: galería de trabajos, lista de precios, botón de WhatsApp para turnos y ubicación en Google Maps.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVoR4f22OSpfWGZI1INmdC-nPQn7kkKJfA97M6BqYfuOqaj3Fp1VmxR33nkip7mwmR5BhlY-dEJ2YRui5WRNBmray4fUMysNLNEWbjwLEonSu1kEHQqgWWeJK8NtsaIVbjOmZI5koNc-8_vRtviwzvbjePekgBekv-iBz5Qgm25Zxp5Ax5cnjiHyAP8Iw-xNgq1qkd7b6zU7TfcXx_2CcerNv4fcqiRNkoLCNvT1dQXT8Oa6EHbjiB0_w3QIomwKZiC4Suw5BD_g4',
 'Web de peluquería con galería de trabajos', 'primary',
 '[{"value":"+300%","label":"Consultas por WhatsApp"},{"value":"2 sem","label":"Tiempo de Entrega"}]'::jsonb, 1),

('Don Julio Parrilla', 'Restaurante', '["Restaurante","Gastronomía"]'::jsonb,
 'Menú digital con fotos, sistema de reservas online, enlace a delivery y mapa para llegar fácil. Todo en una web rápida y atractiva.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuC34rks4hUuzySIw08zD_pRjyWAW8TBN8YOAWPuYRdV0e9RE2Rp4O7IMi-XZ_C8oL8ZfnFbEDGOuzbuLjkqgf-JQHGaTXSFZH0tE4zFGJLCCJ23jp6oOgsNgXyCZVgIPGY4grCRH3zGeJC8c8zyl-bPMA7zNqArkJueK7JH6okBxbChxo6dnUUbVUFBlmhmj9khSE2EJwYXt3w46gz2TH1FhBINZbTKEvOQNPGnbVOVskzfWG8gx7yJ0NxHekila1dXtUMFuPT_D0Y',
 'Web de restaurante con menú digital y reservas', 'mint',
 '[{"value":"+45%","label":"Reservas Online"},{"value":"10 días","label":"Tiempo de Entrega"}]'::jsonb, 2),

('Estudio Torres & Asoc.', 'Profesional', '["Profesional","Abogacía"]'::jsonb,
 'Sitio profesional para estudio de abogados: áreas de práctica, equipo, formulario de consulta y blog con artículos legales.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEj_813dqwISEs5lWRSIW1ssxp16U3iBzCnBlvH6Wctkv5vpkpBhmJCHG5sq5VJDzLHirDOJeC3PhIyIdjfDaBKhXJcU_Fh6xAV0RpR86jfdJXErpaWLHj0RDbG5mDqGuU24RldkomkZ1PjUoIXzQUvEpHgamVUzYPEslegbTfUwc0Nfbu_jO4pZhJzdHfq4ZOs_nb3QfZOEO8iu1WvPyKWDScLzuZm2_EBmVuMYq6exsOYBPM35gNlvBt9YidEhEJ137rJcr-W3c',
 'Web profesional de estudio de abogados', 'coral',
 '[{"value":"3x","label":"Consultas Mensuales"},{"value":"100%","label":"Satisfacción"}]'::jsonb, 3);

-- Testimonials
INSERT INTO testimonials (name, role, quote, avatar_url, badge_text, badge_color, display_order) VALUES
('María López', 'Dueña de Peluquería',
 'Yo no sabía nada de páginas web, pero ellos se encargaron de absolutamente todo. En dos semanas ya tenía mi sitio funcionando y ahora mis clientes me encuentran por Google. Antes ni existía online.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkYW0Flt0xW1Z3HB3NQwCqzJaGgTOWrUXGCNluYmymfDWoJiDh-UQh0Hdx9NWuTx_qiQdr2KzeaMkZ7N-QQl-4dkzIoTTSGaeaZ2tbzIGEJElJLhGWd7ydROujN0ENIj2UpffcTf9t4guY8he-CwCnCEMKa7QKx-3PXBAKeNM6IVxxsNb5-fd8qJOzrfCMg5_jfSEb9mfICiqS2r2p2IlfH-kkOZFsh6HwhgsxB1gpdvi7ThCjXF-CiziTu_MG8QUi-jcjVj54rUI',
 'Servicios', 'bg-electric-blue/20 text-electric-blue', 1),

('Carlos Ruiz', 'Dueño de Restaurante',
 'Les pasé las fotos, el menú y ellos hicieron todo. Ahora recibo reservas directo desde la web y por WhatsApp. Antes dependía 100% del boca a boca.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQAEL7ldXO17P2zxbs1YngIHQKE24NCKGj4oHGt_U2jG0qZlQJYr5_JnXBJDR2YGgjx92YrRE0A1VBRzREbR7mT3awaWFn2PLGLhFbdroVUJNp2fTW9nA2xy0EXhcPunUx9Os-ruZSBCW7eK-AEGwD9FP-TnJ6vU27MmbXLnT3QBUELyLnEkDzq5PyYCWaZaiA2RMtrwwH9Qhr4aeOIBEk5InS3zW5OPrNNoCM6Tsy1tH3DmPWRd3ajGeYXrv4ejWcHDK3jjmO13U',
 'Gastronomía', 'bg-mint/20 text-teal-700', 2),

('Ana Torres', 'Abogada Independiente',
 'Tenía una web vieja que no generaba confianza. Me hicieron una nueva profesional y las consultas por WhatsApp se triplicaron en el primer mes. Ahora la gente me contacta sin que yo busque clientes.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwUxH3A7ZLuocQWfDb9tQet8_f_6u-oQQpVWTMjdpLmOS5ImkWGQ2yJOHKDj85TOdQwFhcPYptf-mugD8IWQ-w4sNC4AtJZ9J_ffQF2JxVbGqj6YfDTGIfTt3X-3p2TRPQA6g8DHQcqy6mRejoSOGIYJXeeyvv8idqZO85dwqI2a8ODmJu4qRIbVLPKefJoPsqoWl_70pqnl3Vn55pSEj4bF0QYnlSAdTcnI_Si2joxXY0K-47AmnvN-m4KWktQo8UD4nWuZCLBgQ',
 'Profesional', 'bg-hot-coral/20 text-red-700', 3);

-- FAQs
INSERT INTO faqs (question, answer, display_order) VALUES
('¿Cuánto tarda en estar lista mi web?', 'Para una Landing Page, entre 1 y 2 semanas. Para sitios institucionales o e-commerce, entre 2 y 4 semanas. Te damos un plazo concreto desde el día uno y siempre lo cumplimos.', 1),
('¿Tengo que saber de tecnología?', 'No, para nada. Nosotros nos encargamos de absolutamente todo: diseño, desarrollo, que funcione en celulares, que aparezca en Google, dominio, hosting y certificado de seguridad. Vos solo nos contás qué necesitás.', 2),
('¿El precio incluye dominio y hosting?', 'Te ayudamos a configurar todo: dominio (.com o .com.ar), hosting, emails profesionales y certificado de seguridad (el candadito verde). El costo del dominio y hosting es aparte (generalmente menos de $20 USD/año), pero nosotros lo tramitamos por vos.', 3),
('¿Qué pasa si necesito algo más complejo?', 'Los precios que ves son la base. Si tu proyecto necesita funciones extra (reservas online, sistema de turnos, integración con software, idiomas múltiples, etc.), te armamos un presupuesto personalizado. Siempre sabés el precio total antes de arrancar.', 4),
('¿Tengo que pagar mantenimiento mensual?', 'No es obligatorio. Te entregamos la web terminada y funcionando con 1 mes de soporte incluido. Si después querés que nos encarguemos de actualizaciones y cambios, tenemos planes opcionales muy accesibles.', 5),
('¿Para qué tipo de negocio trabajan?', 'Para todos. Peluquerías, restaurantes, clínicas, estudios contables, tiendas de ropa, profesionales independientes, PyMEs y emprendedores. Si tenés un negocio o proyecto, te hacemos tu web.', 6),
('¿Cómo es la forma de pago?', 'Trabajamos con un 50% de seña para arrancar y el 50% restante al entregar. Si no te gusta el diseño inicial, te devolvemos la seña. Aceptamos transferencia bancaria y podemos armar un plan de pago si lo necesitás.', 7),
('¿Mi web va a aparecer en Google?', 'Sí. Todas nuestras webs están configuradas para que Google las encuentre y las muestre cuando alguien busque tu tipo de negocio. Esto se llama SEO y viene incluido en todos los planes.', 8);
