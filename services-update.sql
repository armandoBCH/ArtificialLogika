-- SQL para actualizar los servicios según la imagen proporcionada
-- Ejecutar en Supabase SQL Editor

-- Primero, eliminar servicios existentes de este tipo si ya existen
DELETE FROM public.content WHERE content_type = 'services';

-- Insertar la nueva configuración de servicios actualizada
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
);

-- Verificar que se insertó correctamente
SELECT content_type, content_data FROM public.content WHERE content_type = 'services';