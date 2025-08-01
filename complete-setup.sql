-- SQL completo para configurar Supabase desde cero
-- Ejecutar en Supabase SQL Editor

-- 1. Crear la tabla content si no existe
CREATE TABLE IF NOT EXISTS public.content (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  content_type text NOT NULL,
  content_data jsonb NOT NULL,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de seguridad (permitir lectura pública, escritura solo autenticada)
CREATE POLICY "Allow public read access" ON public.content
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.content
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para updated_at
CREATE TRIGGER update_content_updated_at 
  BEFORE UPDATE ON public.content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Insertar servicios actualizados
INSERT INTO public.content (id, content_type, content_data, created_at, updated_at)
VALUES (
  'services-2025-01',
  'services',
  '{
    "services": [
      {
        "id": "web-ecommerce",
        "title": "Páginas Web & Ecommerce",
        "description": "Creamos desde cero sitios web, tiendas online y landing pages completamente autogestionables que convierten visitantes en clientes. Diseño moderno, carga súper rápida y panel de administración incluido.",
        "icon": "Globe",
        "benefitTitle": "Beneficio Único",
        "benefitValue": "Mejora conversiones 50-150%",
        "whatYouGet": "Presencia digital profesional que convierte visitantes en clientes 24/7",
        "features": [
          "Diseño único optimizado para conversión",
          "Desarrollo completo desde cero",
          "Ecommerce con pasarela de pagos integrada",
          "Carga súper rápida (<3 segundos)",
          "+1 características más"
        ],
        "cta": "Quiero esto",
        "color": "from-emerald-400 to-cyan-400"
      },
      {
        "id": "chatbots-ai",
        "title": "Chatbots & Asistentes IA",
        "description": "Desarrollamos chatbots inteligentes completamente autogestionables que atienden a tus clientes 24/7, responden preguntas y capturan leads automáticamente. Panel de control incluido.",
        "icon": "MessageSquare",
        "benefitTitle": "Beneficio Único",
        "benefitValue": "Ahorra 20+ horas/semana",
        "whatYouGet": "Atención al cliente automatizada que nunca duerme y captura leads las 24 horas",
        "features": [
          "Respuestas automáticas 24/7",
          "Integración con WhatsApp/Web",
          "Captura de leads automática",
          "Respuestas personalizadas",
          "+1 características más"
        ],
        "cta": "Quiero esto",
        "color": "from-blue-400 to-purple-400"
      },
      {
        "id": "process-automation",
        "title": "Automatización de Procesos",
        "description": "Diseñamos sistemas de automatización completamente autogestionables para eliminar tareas repetitivas: reportes automáticos, seguimiento de clientes, y workflows inteligentes.",
        "icon": "Zap",
        "benefitTitle": "Beneficio Único", 
        "benefitValue": "Ahorra 10-15 horas/semana",
        "whatYouGet": "Libera tiempo para tareas importantes eliminando procesos manuales repetitivos",
        "features": [
          "Sistemas de automatización custom",
          "Integración entre herramientas existentes",
          "Workflows inteligentes personalizados",
          "Reportes automáticos programados",
          "+1 características más"
        ],
        "cta": "Quiero esto",
        "color": "from-amber-400 to-orange-400"
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  content_data = EXCLUDED.content_data,
  updated_at = NOW();

-- 7. Verificar que todo se creó correctamente
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'content';

-- 8. Verificar contenido insertado
SELECT 
  id, 
  content_type, 
  jsonb_pretty(content_data) as formatted_data,
  created_at,
  updated_at
FROM public.content 
WHERE content_type = 'services';