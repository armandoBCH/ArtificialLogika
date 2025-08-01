-- Esquema de base de datos para Supabase
-- Ejecutar en Supabase SQL Editor

-- Crear tabla de contenido
CREATE TABLE IF NOT EXISTS public.content (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  content_type text NOT NULL,
  content_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_content_type ON public.content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON public.content(created_at);
CREATE INDEX IF NOT EXISTS idx_content_updated_at ON public.content(updated_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Permitir lectura pública (para contenido de landing page)
CREATE POLICY "Allow public read access" ON public.content
  FOR SELECT USING (true);

-- Permitir inserción/actualización solo a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert" ON public.content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.content
  FOR DELETE USING (auth.role() = 'authenticated');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_content_updated_at 
  BEFORE UPDATE ON public.content 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
INSERT INTO public.content (id, content_type, content_data) VALUES
(
  'hero',
  'hero',
  '{
    "title": "Transformamos",
    "dynamicTexts": ["páginas web", "ecommerce", "landing pages", "chatbots", "asistentes de IA", "automatizaciones"],
    "subtitle": "en ventaja competitiva",
    "description": "Desarrollamos soluciones digitales completas desde cero para PyMEs que valoran la calidad y la innovación por encima del precio más bajo.",
    "ctaText": "Descubre cómo",
    "ctaTextLong": "Descubre cómo podemos ayudarte",
    "trustText": "Más de 15 proyectos entregados con éxito",
    "features": ["Autogestionable", "Mobile First", "SEO Optimizado"],
    "stats": [
      {"number": "100%", "label": "Autogestionable", "sublabel": "Sin dependencias técnicas"},
      {"number": "24h", "label": "Tiempo respuesta", "sublabel": "Consultas y soporte"},
      {"number": "15+", "label": "Proyectos exitosos", "sublabel": "PyMEs satisfechas"}
    ]
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;