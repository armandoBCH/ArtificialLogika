import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipos de datos
interface ContentData {
  [key: string]: any;
}

interface ContentItem {
  id: string;
  content_type: string;
  content_data: ContentData;
  created_at?: string;
  updated_at?: string;
}

interface EditableContentContextType {
  content: Record<string, ContentData>;
  loading: boolean;
  error: string | null;
  updateContent: (type: string, data: ContentData) => Promise<void>;
  getContent: (type: string) => ContentData;
  getAllContent: () => Promise<ContentItem[]>;
  isOnline: boolean;
}

// Context
const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

// Hook para usar el context
export const useEditableContent = () => {
  const context = useContext(EditableContentContext);
  if (context === undefined) {
    throw new Error('useEditableContent debe usarse dentro de EditableContentProvider');
  }
  return context;
};

// Contenido por defecto (movido antes del Provider)
const getDefaultContent = (): Record<string, ContentData> => ({
  hero: {
    title: "Transformamos",
    dynamicTexts: [
      "páginas web",
      "ecommerce", 
      "landing pages",
      "chatbots",
      "asistentes de IA",
      "automatizaciones"
    ],
    subtitle: "en ventaja competitiva",
    description: "Desarrollamos soluciones digitales completas desde cero para PyMEs que valoran la calidad y la innovación por encima del precio más bajo.",
    ctaText: "Descubre cómo",
    ctaTextLong: "Descubre cómo podemos ayudarte",
    trustText: "Más de 15 proyectos entregados con éxito",
    features: ["Autogestionable", "Mobile First", "SEO Optimizado"],
    stats: [
      {
        number: "100%",
        label: "Autogestionable",
        sublabel: "Sin dependencias técnicas"
      },
      {
        number: "24h",
        label: "Tiempo respuesta",
        sublabel: "Consultas y soporte"
      },
      {
        number: "15+",
        label: "Proyectos exitosos",
        sublabel: "PyMEs satisfechas"
      }
    ]
  },
  company: {
    name: "Artificial Lógika",
    tagline: "Logic as Aesthetics", 
    description: "Consultora boutique de software e IA especializada en soluciones inteligentes para PyMEs.",
    phone: "+54 11 1234-5678",
    email: "contacto@artificiallogika.com",
    address: "Olavarría, Buenos Aires, Argentina",
    founderName: "Armando Beato",
    founderTitle: "Desarrollador Full Stack & IA",
    contact: {
      email: "contacto@artificiallogika.com",
      phone: "+54 11 1234-5678",
      location: "Olavarría, Buenos Aires, Argentina"
    },
    social: {
      linkedin: "https://linkedin.com/in/armando-beato",
      github: "https://github.com/artificial-logika",
      website: "https://artificiallogika.com"
    },
    socialMedia: {
      linkedin: "https://linkedin.com/in/armando-beato",
      twitter: "https://twitter.com/armando_beato"
    }
  },
  services: [
    {
      id: "web-development",
      title: "Páginas Web & Landing Pages",
      description: "Sitios web profesionales y landing pages optimizadas para conversión. Diseño responsive, velocidad optimizada y SEO técnico incluido.",
      icon: "Globe",
      roi: "300% más conversiones",
      businessValue: "Mayor presencia online profesional que genera confianza y atrae más clientes calificados a tu negocio.",
      features: [
        "Diseño responsive mobile-first",
        "Optimización SEO técnica incluida",
        "Velocidad de carga optimizada",
        "Formularios de contacto inteligentes",
        "Integración con Google Analytics",
        "Panel de administración intuitivo",
        "Hosting y SSL incluidos",
        "Copias de seguridad automáticas"
      ]
    },
    {
      id: "ecommerce",
      title: "E-commerce Autogestionable",
      description: "Tiendas online completas con gestión de inventario, pagos y envíos. Panel de administración para que manejes todo sin depender de nadie.",
      icon: "ShoppingCart",
      roi: "250% aumento ventas",
      businessValue: "Vendé 24/7 sin límites geográficos. Automatizá inventario, pagos y reportes para enfocarte en hacer crecer tu negocio.",
      features: [
        "Catálogo de productos completo",
        "Gestión de inventario automática",
        "Integración con MercadoPago/Stripe",
        "Calculadora de envíos automática",
        "Panel de administración completo",
        "Reportes de ventas detallados",
        "Cupones y descuentos",
        "Notificaciones automáticas por email"
      ]
    },
    {
      id: "ai-automation",
      title: "Chatbots & Automatización IA",
      description: "Asistentes inteligentes que atienden consultas 24/7, califican leads y automatizan procesos repetitivos de tu negocio.",
      icon: "Zap",
      roi: "80% menos consultas manuales",
      businessValue: "Atención al cliente 24/7 sin costo adicional. Califica leads automáticamente y libera tiempo para tareas estratégicas.",
      features: [
        "Respuestas automáticas inteligentes",
        "Calificación de leads automática",
        "Integración con WhatsApp Business",
        "Base de conocimiento personalizable",
        "Reportes de conversaciones",
        "Escalamiento a humanos cuando es necesario",
        "Sincronización con CRM",
        "Análisis de sentimientos"
      ]
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "E-commerce Boutique",
      description: "Tienda online completa para marca de ropa",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      category: "E-commerce",
      technologies: ["React", "Node.js", "Stripe"]
    }
  ],
  pricing: {
    settings: {
      headerTitle: "Inversión Transparente",
      headerSubtitle: "Calidad por Valor",
      headerDescription: "Precios claros sin sorpresas. Desarrollo profesional con garantía de calidad.",
      headerHighlight: "Primera consulta gratuita de 60 minutos",
      exchangeRate: "1.200",
      badges: {
        hostingFreeText: "Hosting Gratis",
        dynamicText: "Dinámico",
        sqliteText: "SQLite",
        supabaseText: "Supabase",
        noDatabaseText: "Sin BD"
      },
      benefits: [
        {
          icon: "Shield",
          title: "Garantía",
          description: "Funcionamiento garantizado"
        },
        {
          icon: "Server",
          title: "Soporte",
          description: "Asistencia técnica incluida"
        },
        {
          icon: "HeadphonesIcon",
          title: "Consultoría",
          description: "Asesoramiento personalizado"
        }
      ],
      bottomSectionTitle: "¿Necesitás una cotización personalizada?",
      bottomSectionDescription: "Cada proyecto es único. Contáctame para un presupuesto ajustado a tus necesidades específicas.",
      bottomSectionCTA: "Consulta Gratuita",
      bottomSectionNote: "Sin compromiso • Respuesta en 24hs"
    },
    plans: [
      {
        id: "consultation",
        name: "Consulta & Análisis",
        subtitle: "Perfecto para empezar",
        value: "Gratis",
        timeframe: "60 minutos",
        badge: "Más Popular",
        popular: true,
        icon: "Calendar",
        color: "from-primary to-primary/80",
        description: "Analizamos tu situación actual y te proponemos la mejor solución para tu negocio.",
        outcomes: [
          "Análisis completo de tu situación actual",
          "Propuesta técnica personalizada con costos reales",
          "Roadmap de implementación paso a paso",
          "Recomendaciones de arquitectura y tecnologías",
          "Estimación de tiempos de desarrollo"
        ],
        cta: "Agendar Consulta"
      },
      {
        id: "custom",
        name: "Proyecto Personalizado",
        subtitle: "Tu solución exacta",
        value: "Desde $800 USD",
        timeframe: "según complejidad",
        badge: "",
        popular: false,
        icon: "Crown",
        color: "from-blue-500 to-purple-500",
        description: "Calculadora interactiva para conocer el costo exacto de tu proyecto.",
        outcomes: [
          "Presupuesto detallado por módulos",
          "Costos de desarrollo, infraestructura y mantenimiento",
          "Selección de servicios específicos que necesitás",
          "Comparativa de opciones técnicas disponibles",
          "Transparencia total en precios y tiempos"
        ],
        cta: "Calcular Presupuesto"
      },
      {
        id: "maintenance",
        name: "Mantenimiento Continuo",
        subtitle: "Funcionamiento 24/7",
        value: "Desde $50 USD",
        timeframe: "por mes",
        badge: "",
        popular: false,
        icon: "Shield",
        color: "from-green-500 to-emerald-500",
        description: "Mantenimiento técnico, actualizaciones y soporte para que tu plataforma funcione siempre.",
        outcomes: [
          "Monitoreo 24/7 de tu plataforma",
          "Copias de seguridad automáticas diarias",
          "Actualizaciones de seguridad prioritarias",
          "Soporte técnico vía WhatsApp/email",
          "Reportes mensuales de performance"
        ],
        cta: "Ver Planes"
      }
    ],
    customServices: [
      {
        id: "landing-page",
        name: "Landing Page Profesional",
        icon: "Globe",
        description: "Página de aterrizaje optimizada para conversión con formularios de contacto y seguimiento.",
        developmentPrice: "800",
        infrastructurePrice: "0",
        maintenancePrice: "50",
        databaseType: "none",
        isStatic: true,
        isDynamic: false,
        sections: [
          "Hero con llamada a la acción clara",
          "Sección de beneficios/características",
          "Testimonios y casos de éxito",
          "Formulario de contacto optimizado",
          "Footer con información de contacto"
        ],
        features: [
          "Design responsive mobile-first",
          "Optimización SEO básica",
          "Formularios con validación",
          "Animaciones y microinteracciones",
          "Integración con Google Analytics",
          "Velocidad de carga optimizada"
        ],
        infrastructureDetails: [
          "Hosting estático en Vercel (gratis)",
          "CDN global incluido",
          "SSL/HTTPS automático",
          "Deploy automático desde Git"
        ]
      }
    ]
  },
  testimonials: [],
  featuredProjects: []
});

// Provider
interface EditableContentProviderProps {
  children: ReactNode;
}

export const EditableContentProvider: React.FC<EditableContentProviderProps> = ({ children }) => {
  // Inicializar con contenido por defecto para evitar undefined
  const [content, setContent] = useState<Record<string, ContentData>>(() => getDefaultContent());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Verificar conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar contenido inicial
  useEffect(() => {
    loadAllContent();
  }, []);

  // Función para verificar si las APIs están disponibles
  const checkAPIAvailability = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-env');
      if (!response.ok) return false;
      
      const envStatus = await response.json();
      return envStatus.supabase?.urlConfigured && envStatus.supabase?.keyConfigured;
    } catch {
      return false;
    }
  };

  // Función para cargar todo el contenido
  const loadAllContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primero verificar si las APIs están disponibles
      const apiAvailable = await checkAPIAvailability();
      
      if (!apiAvailable) {
        console.log('API not available, using default content');
        setContent(getDefaultContent());
        setError('Aplicación funcionando en modo demo. Para configurar el sistema de administración, accede a /admin y sigue las instrucciones.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/content');
      if (!response.ok) {
        if (response.status === 500) {
          // Si es error 500, probablemente es un problema de configuración de Supabase
          const errorData = await response.json().catch(() => ({}));
          if (errorData.error?.includes('Supabase configuration missing')) {
            console.log('Supabase not configured, using default content');
            setContent(getDefaultContent());
            setError('Aplicación funcionando en modo demo. Para configurar el sistema de administración, accede a /admin y sigue las instrucciones.');
            setLoading(false);
            return;
          }
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const contentItems: ContentItem[] = await response.json();
      
      // Si no hay contenido en la base de datos, usar contenido por defecto
      if (!contentItems || contentItems.length === 0) {
        console.log('No content found in database, using default content');
        setContent(getDefaultContent());
        setError('Usando contenido por defecto. Configura Supabase para habilitar edición.');
        setLoading(false);
        return;
      }
      
      // Organizar contenido por tipo
      const organizedContent: Record<string, ContentData> = {};
      contentItems.forEach(item => {
        organizedContent[item.content_type] = item.content_data;
      });

      // Combinar con contenido por defecto para asegurar que todas las propiedades existan
      const defaultContent = getDefaultContent();
      const mergedContent: Record<string, ContentData> = {};
      
      Object.keys(defaultContent).forEach(key => {
        mergedContent[key] = organizedContent[key] || defaultContent[key];
      });

      setContent(mergedContent);
      console.log('Content loaded successfully from Supabase');
    } catch (err) {
      console.error('Error loading content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      // Si hay error, usar contenido por defecto
      setContent(getDefaultContent());
      console.log('Using default content due to error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar contenido
  const updateContent = async (type: string, data: ContentData) => {
    try {
      setError(null);
      
      // Actualizar estado local inmediatamente (optimistic update)
      setContent(prev => ({
        ...prev,
        [type]: data
      }));

      // Verificar si las APIs están disponibles antes de intentar la actualización
      const apiAvailable = await checkAPIAvailability();
      
      if (!apiAvailable) {
        setError('Cambios guardados localmente. Configura las variables de entorno en Vercel para habilitar sincronización con Supabase.');
        return; // Mantener cambios locales sin sincronizar
      }

      const response = await fetch('/api/content-by-type?' + new URLSearchParams({ type }), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_data: data
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.error?.includes('Supabase configuration missing')) {
            setError('Cambios guardados localmente. Configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel.');
            return; // Mantener cambios locales
          }
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      console.log(`Content updated successfully: ${type}`);
    } catch (err) {
      console.error('Error updating content:', err);
      
      // Si es error de configuración, mantener cambios locales pero mostrar warning
      if (err instanceof Error && (err.message.includes('500') || err.message.includes('configuration'))) {
        setError('Cambios guardados localmente. Configura Supabase para sincronización completa.');
        return; // No revertir cambios locales
      }
      
      // Para otros errores, revertir cambio
      await loadAllContent();
      
      throw err; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  // Función para obtener contenido de un tipo específico
  const getContent = (type: string): ContentData => {
    return content[type] || getDefaultContent()[type] || {};
  };

  // Función para obtener todo el contenido
  const getAllContent = async (): Promise<ContentItem[]> => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Error getting all content:', err);
      throw err;
    }
  };



  const value: EditableContentContextType = {
    content,
    loading,
    error,
    updateContent,
    getContent,
    getAllContent,
    isOnline
  };

  return (
    <EditableContentContext.Provider value={value}>
      {children}
    </EditableContentContext.Provider>
  );
};