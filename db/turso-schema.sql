-- Esquema para Turso Database
-- Ejecutar en Turso CLI: turso db shell artificial-logika

-- Tabla de contenido
CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_data TEXT NOT NULL, -- JSON como texto
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON content(created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_content_updated_at
  AFTER UPDATE ON content
  FOR EACH ROW
  BEGIN
    UPDATE content SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Datos iniciales
INSERT OR IGNORE INTO content (id, content_type, content_data) VALUES
('hero', 'hero', '{"title":"Transformamos","subtitle":"en ventaja competitiva","description":"Desarrollamos soluciones digitales completas desde cero para PyMEs que valoran la calidad y la innovación por encima del precio más bajo.","ctaText":"Descubre cómo","ctaTextLong":"Descubre cómo podemos ayudarte","trustText":"Más de 15 proyectos entregados con éxito","features":["Autogestionable","Mobile First","SEO Optimizado"],"stats":[{"number":"100%","label":"Autogestionable","sublabel":"Sin dependencias técnicas"},{"number":"24h","label":"Tiempo respuesta","sublabel":"Consultas y soporte"},{"number":"15+","label":"Proyectos exitosos","sublabel":"PyMEs satisfechas"}],"dynamicTexts":["páginas web","ecommerce","landing pages","chatbots","asistentes de IA","automatizaciones"]}'),
('company', 'company', '{"name":"Artificial Lógika","tagline":"Logic as Aesthetics","description":"Consultora boutique de software e IA especializada en soluciones inteligentes para PyMEs.","phone":"+54 11 1234-5678","email":"contacto@artificiallogika.com","address":"Olavarría, Buenos Aires, Argentina","founderName":"Armando Beato","founderTitle":"Desarrollador Full Stack & IA","contact":{"email":"contacto@artificiallogika.com","phone":"+54 11 1234-5678","location":"Olavarría, Buenos Aires, Argentina"},"social":{"linkedin":"https://linkedin.com/in/armando-beato","github":"https://github.com/artificial-logika","website":"https://artificiallogika.com"},"socialMedia":{"linkedin":"https://linkedin.com/in/armando-beato","twitter":"https://twitter.com/armando_beato"}}'),
('services', 'services', '[{"id":"web-development","title":"Páginas Web & Ecommerce","description":"Mejora conversiones 50-150% con presencia digital profesional que convierte visitantes en clientes 24/7.","features":["Diseño único","Desarrollo desde cero","Ecommerce con pagos","Carga rápida"],"price":"$2,500","originalPrice":"$3,500","popular":true},{"id":"chatbots","title":"Chatbots & Asistentes IA","description":"Ahorra 20+ horas/semana con atención al cliente automatizada que nunca duerme y captura leads 24 horas.","features":["Respuestas 24/7","WhatsApp/Web","Captura automática de leads"],"price":"$1,800","originalPrice":"$2,200"},{"id":"automation","title":"Automatización de Procesos","description":"Ahorra 10-15 horas/semana liberando tiempo para tareas importantes eliminando procesos manuales.","features":["Sistemas custom","Integración de herramientas","Workflows inteligentes"],"price":"$3,200","originalPrice":"$4,000"}]'); 