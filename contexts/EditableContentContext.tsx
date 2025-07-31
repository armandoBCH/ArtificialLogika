import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbManager } from '../db/indexedDB';

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  timeframe: string;
  description: string;
  outcomes: string[];
  icon: string;
  color: string;
  popular: boolean;
  cta: string;
  value: string;
  badge: string;
}

interface CustomService {
  id: string;
  name: string;
  description: string;
  sections: string[];
  features: string[];
  developmentPrice: string;
  infrastructurePrice: string;
  maintenancePrice: string;
  infrastructureDetails: string[];
  databaseType: 'none' | 'sqlite' | 'supabase';
  isStatic: boolean;
  icon: string;
}

interface PricingSettings {
  exchangeRate: string;
  headerTitle: string;
  headerSubtitle: string;
  headerDescription: string;
  headerHighlight: string;
  bottomSectionTitle: string;
  bottomSectionDescription: string;
  bottomSectionCTA: string;
  bottomSectionNote: string;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  badges: {
    sqliteText: string;
    supabaseText: string;
    noDatabaseText: string;
    hostingFreeText: string;
  };
}

interface EditableContent {
  // Company Information
  company: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    founderName: string;
    founderTitle: string;
    socialMedia: {
      linkedin: string;
      twitter: string;
      github: string;
    };
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaTextLong: string;
    trustText: string;
    dynamicTexts: string[];
    stats: Array<{
      number: string;
      label: string;
      sublabel: string;
    }>;
  };
  
  // Legacy hero properties for backward compatibility
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  
  // Value Proposition
  valueProps: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  
  // Services (main 3 services)
  services: Array<{
    title: string;
    description: string;
    features: string[];
    price: string;
    originalPrice?: string;
    popular?: boolean;
    roi: string;
    businessValue: string;
    icon: string;
  }>;
  
  // Pricing Section
  pricing: {
    settings: PricingSettings;
    plans: PricingPlan[];
    customServices: CustomService[];
  };
  
  // Process Steps
  processSteps: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  
  // Featured Projects
  featuredProjects: Array<{
    title: string;
    description: string;
    image: string;
    technologies: string[];
    category: string;
  }>;
  
  // Testimonials
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
  }>;
  
  // FAQ
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  
  // Footer
  footerDescription: string;
  footerCTA: string;
  finalCTATitle: string;
  finalCTADescription: string;
  finalCTAButton: string;
}

interface EditableContentContextType {
  content: EditableContent;
  updateContent: (key: keyof EditableContent, value: any) => void;
  updatePricingSettings: (settings: Partial<PricingSettings>) => void;
  updatePricingPlan: (planId: string, updates: Partial<PricingPlan>) => void;
  updateCustomService: (serviceId: string, updates: Partial<CustomService>) => void;
  resetToDefaults: () => void;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
  isLoading: boolean;
  lastSaved: Date | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

const defaultContent: EditableContent = {
  company: {
    name: "Artificial Lógika",
    tagline: "Desarrollo web y soluciones de IA",
    phone: "+542284638361",
    email: "armadobeatochang@gmail.com",
    address: "Olavarría, Buenos Aires, Argentina",
    founderName: "Armando Beato Chang",
    founderTitle: "Desarrollador & Consultor en IA",
    socialMedia: {
      linkedin: "https://linkedin.com/in/armando-beato",
      twitter: "https://twitter.com/armando_beato",
      github: "https://github.com/armando-beato"
    }
  },
  
  hero: {
    title: "Transformamos",
    subtitle: "en ventaja competitiva",
    description: "Creo sitios web, e-commerce y herramientas de automatización que impulsan tu negocio hacia el siguiente nivel. Todo autogestionable, sin dependencias.",
    ctaText: "Conversemos",
    ctaTextLong: "Conversemos sobre tu proyecto",
    trustText: "Más de 15 proyectos exitosos entregados",
    dynamicTexts: [
      "páginas web",
      "e-commerce",
      "chatbots",
      "automatizaciones",
      "landing pages"
    ],
    stats: [
      {
        number: "100%",
        label: "Autogestionable",
        sublabel: "Sin dependencias"
      },
      {
        number: "15+",
        label: "Proyectos",
        sublabel: "Completados"
      },
      {
        number: "24h",
        label: "Respuesta",
        sublabel: "Garantizada"
      }
    ]
  },
  
  // Legacy properties for backward compatibility
  heroTitle: "Transformamos ideas en ventaja competitiva",
  heroSubtitle: "Desarrollo web y soluciones de IA para PyMEs ambiciosas", 
  heroDescription: "Creo sitios web, e-commerce y herramientas de automatización que impulsan tu negocio hacia el siguiente nivel. Todo autogestionable, sin dependencias.",
  heroCTA: "Conversemos sobre tu proyecto",
  
  valueProps: [
    {
      icon: "Zap",
      title: "100% Autogestionable",
      description: "Todas mis soluciones incluyen paneles de administración intuitivos. Tú mantienes el control total sin depender de terceros."
    },
    {
      icon: "Shield",
      title: "Desde Cero, No Parches",
      description: "No arreglo webs existentes. Desarrollo soluciones completamente nuevas, optimizadas para tus necesidades específicas."
    },
    {
      icon: "Target",
      title: "Enfoque en Resultados",
      description: "Cada línea de código tiene un propósito: convertir visitantes en clientes y automatizar procesos que te hacen ganar tiempo."
    }
  ],
  
  // Main 3 services as shown in the image
  services: [
    {
      title: "Páginas Web & Ecommerce",
      description: "Creamos desde cero sitios web, tiendas online y landing pages completamente autogestionables que convierten visitantes en clientes. Diseño moderno, carga súper rápida y panel de administración incluido.",
      features: [
        "Diseño único optimizado para conversión",
        "Desarrollo completo desde cero",
        "Ecommerce con pasarela de pagos integrada",
        "Carga súper rápida (<3 segundos)",
        "+4 características más"
      ],
      price: "$100.000 - $300.000",
      originalPrice: "$350.000 - $450.000",
      popular: false,
      roi: "Mejora conversiones 50-150%",
      businessValue: "Presencia digital profesional que convierte visitantes en clientes 24/7",
      icon: "Globe"
    },
    {
      title: "Chatbots & Asistentes IA",
      description: "Desarrollamos chatbots inteligentes completamente autogestionables que atienden a tus clientes 24/7, responden preguntas y capturan leads automáticamente. Panel de control incluido.",
      features: [
        "Respuestas automáticas 24/7",
        "Integración con WhatsApp/Web",
        "Captura de leads automática",
        "Respuestas personalizadas",
        "+5 características más"
      ],
      price: "$100.000",
      originalPrice: "$150.000",
      popular: true,
      roi: "Ahorra 20+ horas/semana",
      businessValue: "Atención al cliente automatizada que nunca duerme y captura leads las 24 horas",
      icon: "MessageSquare"
    },
    {
      title: "Automatización de Procesos",
      description: "Diseñamos sistemas de automatización completamente autogestionables para eliminar tareas repetitivas: reportes automáticos, seguimiento de clientes, y workflows inteligentes.",
      features: [
        "Sistemas de automatización custom",
        "Integración entre herramientas existentes",
        "Workflows inteligentes personalizados",
        "Reportes automáticos programados",
        "+3 características más"
      ],
      price: "Consultar",
      originalPrice: "$480.000",
      popular: false,
      roi: "Ahorra 10-15 horas/semana",
      businessValue: "Libera tiempo para tareas importantes eliminando procesos manuales repetitivos",
      icon: "Zap"
    }
  ],
  
  // Pricing section data
  pricing: {
    settings: {
      exchangeRate: "1.300",
      headerTitle: "Precios transparentes",
      headerSubtitle: "en pesos argentinos",
      headerDescription: "Costos claros desde el primer día. Incluye desarrollo, hosting, capacitación y soporte.",
      headerHighlight: "Sin sorpresas, sin letra pequeña.",
      bottomSectionTitle: "¿Querés saber el costo exacto de tu proyecto?",
      bottomSectionDescription: "Cada proyecto es único. Hablemos 60 minutos y te doy un presupuesto detallado con todos los costos en pesos argentinos.",
      bottomSectionCTA: "Conversación gratuita de 60 minutos",
      bottomSectionNote: "💰 Te doy presupuesto exacto en la primera llamada",
      benefits: [
        {
          icon: "Server",
          title: "Hosting moderno incluido",
          description: "Cloudflare y Vercel para máxima velocidad y confiabilidad"
        },
        {
          icon: "Calculator",
          title: "Presupuesto detallado", 
          description: "Desglose completo: desarrollo, infraestructura y mantenimiento"
        },
        {
          icon: "HeadphonesIcon",
          title: "Soporte en español",
          description: "WhatsApp directo conmigo, horario laboral argentino"
        }
      ],
      badges: {
        sqliteText: "SQLite (Gratis)",
        supabaseText: "Supabase Pro",
        noDatabaseText: "Sin BD",
        hostingFreeText: "Hosting gratis"
      }
    },
    
    plans: [
      {
        id: "consulta",
        name: "Consulta & Análisis",
        subtitle: "Empezamos aquí",
        timeframe: "60 minutos de análisis",
        description: "Conversación gratuita para entender tu situación y diseñar la mejor solución",
        outcomes: [
          "Análisis de tu situación actual",
          "Identificación de oportunidades",
          "Propuesta personalizada",
          "Presupuesto detallado en ARS",
          "Sin compromisos",
          "Consejos útiles aunque no trabajemos juntos"
        ],
        icon: "Calendar",
        color: "from-blue-500 to-cyan-500",
        popular: false,
        cta: "Agendar conversación",
        value: "Gratuita",
        badge: "Sin compromiso"
      },
      {
        id: "personalizado",
        name: "Proyecto Personalizado",
        subtitle: "El favorito de mis clientes",
        timeframe: "1-4 semanas según complejidad",
        description: "Desde landing pages hasta ecommerce completos, con hosting y mantenimiento incluido",
        outcomes: [
          "Desarrollo completo de tu proyecto",
          "Hosting en infraestructura moderna",
          "Capacitación para gestionar contenido",
          "1-3 meses de ajustes incluidos",
          "Documentación completa",
          "Integración con tus herramientas",
          "Optimización post-lanzamiento",
          "Soporte durante implementación"
        ],
        icon: "Crown",
        color: "from-primary to-green-500",
        popular: true,
        cta: "Personalizar mi proyecto",
        value: "$100.000 - $300.000",
        badge: "Más elegido"
      },
      {
        id: "mantenimiento",
        name: "Mantenimiento Continuo",
        subtitle: "Tranquilidad total",
        timeframe: "Duración mínima 3 meses",
        description: "Plan mensual para mantener tu plataforma actualizada, segura y funcionando 24/7",
        outcomes: [
          "Soporte técnico por WhatsApp/email",
          "Actualizaciones técnicas automáticas",
          "Backups diarios/semanales",
          "Monitoreo 24/7 y alertas",
          "Revisión mensual de seguridad",
          "Hasta 1 hora de cambios menores",
          "Reportes mensuales opcionales",
          "Sin compromisos a largo plazo"
        ],
        icon: "Shield",
        color: "from-purple-500 to-pink-500",
        popular: false,
        cta: "Ver planes de mantenimiento",
        value: "$10.000 - $50.000/mes",
        badge: "Tranquilidad"
      }
    ],
    
    customServices: [
      {
        id: 'landing',
        name: 'Landing Page',
        description: 'Página optimizada para conversiones con panel de administración',
        sections: [
          'Hero (Encabezado impactante)',
          'Beneficios o Solución que Ofreces',
          'Cómo Funciona / Características Clave',
          'Testimonios / Confianza Social',
          'Llamado a la Acción Secundario',
          'Formulario de Contacto / Lead',
          'FAQs (Preguntas Frecuentes)',
          'Footer (Pie de página)'
        ],
        features: [
          'Diseño personalizado responsive',
          'Panel de administración completo',
          'Optimización SEO técnico',
          'Formularios de contacto',
          'Integración con WhatsApp',
          'Google Analytics setup',
          'Optimización de conversión',
          'Carga súper rápida (<3 seg)'
        ],
        developmentPrice: '100.000',
        infrastructurePrice: '0',
        maintenancePrice: '20.000',
        infrastructureDetails: ['Cloudflare hosting gratuito', 'CDN global incluido', 'SSL automático'],
        databaseType: 'none',
        isStatic: true,
        icon: 'Globe'
      },
      {
        id: 'website',
        name: 'Sitio Web Completo',
        description: 'Sitio web profesional con múltiples páginas y secciones',
        sections: [
          'Home (Presentación general)',
          'Sobre Nosotros / Quiénes Somos',
          'Servicios o Productos (detallados)',
          'Portfolio / Casos de Éxito',
          'Testimonios / Clientes',
          'Blog / Novedades (opcional)',
          'Contacto (formulario + datos)',
          'FAQs / Centro de Ayuda',
          'Footer global completo'
        ],
        features: [
          'Diseño multi-página responsive',
          'Panel de administración completo',
          'Blog/Noticias opcional',
          'Galería de imágenes',
          'Formularios avanzados',
          'SEO completo',
          'Integración redes sociales',
          'Sistema de navegación intuitivo'
        ],
        developmentPrice: '200.000',
        infrastructurePrice: '0',
        maintenancePrice: '30.000',
        infrastructureDetails: ['Cloudflare hosting gratuito', 'CDN global incluido', 'SSL automático'],
        databaseType: 'none',
        isStatic: true,
        icon: 'Globe'
      },
      {
        id: 'ecommerce',
        name: 'Tienda Online',
        description: 'Ecommerce completo con pagos, inventario y panel administrativo',
        sections: [
          'Home con foco en productos',
          'Categorías de Productos',
          'Página de Producto (detallada)',
          'Carrito de Compras',
          'Checkout / Proceso de Pago',
          'Mi Cuenta / Historial de pedidos',
          'Políticas (envíos, devoluciones, términos)',
          'Contacto / Soporte / Chat',
          'Footer potente (pagos, seguridad)'
        ],
        features: [
          'Catálogo de productos ilimitado',
          'Carrito y checkout optimizado',
          'Panel de administración completo',
          'Gestión de inventario automática',
          'Dashboard de ventas y métricas',
          'Integración MercadoPago/Stripe',
          'Sistema de cupones y descuentos',
          'Notificaciones automáticas'
        ],
        developmentPrice: '300.000',
        infrastructurePrice: '32.500',
        maintenancePrice: '50.000',
        infrastructureDetails: [
          'Supabase Pro: $32.500/mes',
          'Vercel Pro: Incluido en mantenimiento',
          'Base de datos PostgreSQL escalable',
          'Pasarela de pagos: % por transacción'
        ],
        databaseType: 'supabase',
        isStatic: false,
        icon: 'Globe'
      },
      {
        id: 'chatbot-web',
        name: 'Chatbot Web',
        description: 'Chatbot inteligente integrado en tu sitio web (SQLite)',
        sections: [
          'Widget de chat integrado',
          'Panel de administración',
          'Configuración de respuestas',
          'Gestión de conversaciones',
          'Métricas y reportes',
          'Base de conocimiento',
          'Flujos de conversación'
        ],
        features: [
          'Chatbot personalizado para tu negocio',
          'Entrenamiento con tu información',
          'Panel de administración y métricas',
          'Integración con tu sitio web',
          'Captura de leads automática',
          'Respuestas 24/7',
          'Base de datos SQLite (gratis)',
          'Configuración de flujos de conversación'
        ],
        developmentPrice: '100.000',
        infrastructurePrice: '19.500',
        maintenancePrice: '10.000',
        infrastructureDetails: [
          'SQLite + Drizzle: Gratis',
          'Gemini API: $19.500/mes',
          'Vercel hosting: Incluido en mantenimiento'
        ],
        databaseType: 'sqlite',
        isStatic: false,
        icon: 'MessageSquare'
      },
      {
        id: 'chatbot-whatsapp',
        name: 'Chatbot WhatsApp',
        description: 'Asistente virtual para WhatsApp Business automatizado (SQLite)',
        sections: [
          'Configuración WhatsApp Business API',
          'Panel de administración completo',
          'Gestión de conversaciones',
          'Flujos automatizados',
          'Captura y gestión de leads',
          'Integraciones con CRM',
          'Métricas y reportes detallados'
        ],
        features: [
          'Bot personalizado para WhatsApp',
          'Configuración WhatsApp Business API',
          'Panel de administración completo',
          'Entrenamiento con tu información',
          'Flujos de conversación avanzados',
          'Captura y gestión de leads',
          'Base de datos SQLite (gratis)',
          'Métricas y reportes detallados'
        ],
        developmentPrice: '100.000',
        infrastructurePrice: '19.500',
        maintenancePrice: '10.000',
        infrastructureDetails: [
          'WhatsApp API: Según uso (variable)',
          'SQLite + Drizzle: Gratis',
          'Gemini API: $19.500/mes',
          'Vercel hosting: Incluido en mantenimiento'
        ],
        databaseType: 'sqlite',
        isStatic: false,
        icon: 'MessageSquare'
      }
    ]
  },
  
  processSteps: [
    {
      number: "01",
      title: "Descubrimiento",
      description: "Analizamos tu negocio, objetivos y audiencia para diseñar la solución perfecta."
    },
    {
      number: "02", 
      title: "Desarrollo",
      description: "Creo tu solución desde cero utilizando las mejores tecnologías y prácticas."
    },
    {
      number: "03",
      title: "Entrega y Capacitación",
      description: "Te entrego todo funcionando y te capacito para que manejes tu nueva herramienta."
    }
  ],
  
  featuredProjects: [
    {
      title: "E-commerce Boutique",
      description: "Tienda online de moda con experiencia de compra premium y panel administrativo completo.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "Stripe", "Analytics"],
      category: "E-commerce"
    },
    {
      title: "SaaS Dashboard", 
      description: "Panel de control para startup tech con métricas en tiempo real y automatización de reportes.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["React", "Python", "IA", "APIs"],
      category: "SaaS"
    },
    {
      title: "Consultoría Profesional",
      description: "Landing page de alta conversión para consultor con sistema de agenda automática.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      technologies: ["React", "WhatsApp API", "CRM", "Analytics"],
      category: "Landing"
    }
  ],
  
  testimonials: [
    {
      name: "María González",
      role: "Directora",
      company: "Estudio Creativo MG",
      content: "Armando no solo creó nuestra web, sino que transformó completamente cómo operamos. El panel de administración es intuitivo y el chatbot nos ahorra horas de atención al cliente.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Carlos Mendoza",
      role: "CEO",
      company: "TechStart Solutions",
      content: "La calidad del código y la atención al detalle son excepcionales. Nuestro e-commerce procesa más de 200 pedidos mensuales sin problemas.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Ana Rodríguez",
      role: "Founder",
      company: "Boutique Digital",
      content: "La filosofía 'Logic as Aesthetics' se nota en cada detalle. Tenemos una herramienta hermosa que realmente funciona para nuestro negocio.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ],
  
  faqs: [
    {
      question: "¿Por qué no arreglas webs existentes?",
      answer: "Prefiero crear soluciones desde cero porque así puedo garantizar código limpio, rendimiento óptimo y que cada elemento esté diseñado específicamente para tus objetivos de negocio."
    },
    {
      question: "¿Qué incluye el 'autogestionable'?",
      answer: "Cada proyecto incluye un panel de administración personalizado donde puedes editar contenido, gestionar productos, ver métricas y configurar automaciones sin necesidad de programación."
    },
    {
      question: "¿Cuánto tiempo toma un proyecto?",
      answer: "Landing pages: 1-2 semanas. E-commerce: 3-4 semanas. Automatización IA: 2-3 semanas. El tiempo exacto depende de la complejidad y requerimientos específicos."
    },
    {
      question: "¿Incluye hosting y dominio?",
      answer: "No incluyo hosting ni dominio en el precio, pero te ayudo a configurar todo en plataformas confiables y te doy recomendaciones específicas para tu caso."
    },
    {
      question: "¿Ofreces soporte post-entrega?",
      answer: "Sí, incluyo 30 días de soporte gratuito para dudas técnicas y ajustes menores. También ofrezco planes de mantenimiento mensual para proyectos que lo requieran."
    }
  ],
  
  footerDescription: "Especialista en desarrollo web y soluciones de IA para PyMEs que buscan diferenciarse con tecnología inteligente.",
  footerCTA: "¿Listo para transformar tu negocio?",
  finalCTATitle: "Construyamos tu ventaja competitiva",
  finalCTADescription: "Agenda una consulta gratuita de 30 minutos y descubre cómo la tecnología puede impulsar tu negocio.",
  finalCTAButton: "Agendar consulta gratuita"
};

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export const useEditableContent = () => {
  const context = useContext(EditableContentContext);
  if (context === undefined) {
    throw new Error('useEditableContent must be used within an EditableContentProvider');
  }
  return context;
};

interface EditableContentProviderProps {
  children: ReactNode;
}

export const EditableContentProvider: React.FC<EditableContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<EditableContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Cargar contenido inicial desde IndexedDB
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        
        // Inicializar IndexedDB
        await dbManager.init();
        
        // Migrar datos desde localStorage si existen
        await dbManager.migrateFromLocalStorage();
        
        // Cargar contenido desde IndexedDB
        const savedContent = await dbManager.getContent('editableContent');
        
        if (savedContent) {
          // Mergear contenido guardado con valores por defecto para nuevas propiedades
          const mergedContent = { 
            ...defaultContent, 
            ...savedContent,
            // Asegurar que las secciones importantes existen
            hero: {
              ...defaultContent.hero,
              ...savedContent.hero
            },
            company: {
              ...defaultContent.company,
              ...savedContent.company
            },
            pricing: {
              ...defaultContent.pricing,
              ...savedContent.pricing,
              settings: {
                ...defaultContent.pricing.settings,
                ...savedContent.pricing?.settings
              },
              plans: savedContent.pricing?.plans || defaultContent.pricing.plans,
              customServices: savedContent.pricing?.customServices || defaultContent.pricing.customServices
            }
          };
          setContent(mergedContent);
          console.log('Contenido cargado desde IndexedDB');
        } else {
          // Si no hay contenido guardado, usar valores por defecto
          setContent(defaultContent);
          // Guardar valores por defecto en IndexedDB
          await dbManager.saveContent('editableContent', defaultContent);
          console.log('Contenido por defecto guardado en IndexedDB');
        }
        
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error cargando contenido:', error);
        setSaveStatus('error');
        // En caso de error, usar valores por defecto
        setContent(defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const updateContent = async (key: keyof EditableContent, value: any) => {
    try {
      setSaveStatus('saving');
      
      const newContent = { ...content, [key]: value };
      setContent(newContent);
      
      // Guardar en IndexedDB
      await dbManager.saveContent('editableContent', newContent);
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      // Resetear status después de 2 segundos
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error guardando contenido:', error);
      setSaveStatus('error');
      
      // Resetear status después de 3 segundos
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updatePricingSettings = async (settings: Partial<PricingSettings>) => {
    try {
      setSaveStatus('saving');
      
      const newContent = {
        ...content,
        pricing: {
          ...content.pricing,
          settings: {
            ...content.pricing.settings,
            ...settings
          }
        }
      };
      setContent(newContent);
      
      // Guardar en IndexedDB
      await dbManager.saveContent('editableContent', newContent);
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error guardando configuración de precios:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updatePricingPlan = async (planId: string, updates: Partial<PricingPlan>) => {
    try {
      setSaveStatus('saving');
      
      const newPlans = content.pricing.plans.map(plan => 
        plan.id === planId ? { ...plan, ...updates } : plan
      );
      
      const newContent = {
        ...content,
        pricing: {
          ...content.pricing,
          plans: newPlans
        }
      };
      setContent(newContent);
      
      // Guardar en IndexedDB
      await dbManager.saveContent('editableContent', newContent);
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error guardando plan de precios:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateCustomService = async (serviceId: string, updates: Partial<CustomService>) => {
    try {
      setSaveStatus('saving');
      
      const newServices = content.pricing.customServices.map(service => 
        service.id === serviceId ? { ...service, ...updates } : service
      );
      
      const newContent = {
        ...content,
        pricing: {
          ...content.pricing,
          customServices: newServices
        }
      };
      setContent(newContent);
      
      // Guardar en IndexedDB
      await dbManager.saveContent('editableContent', newContent);
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error guardando servicio personalizado:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const resetToDefaults = async () => {
    try {
      setSaveStatus('saving');
      
      setContent(defaultContent);
      await dbManager.saveContent('editableContent', defaultContent);
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error reseteando contenido:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const exportData = async (): Promise<string> => {
    try {
      return await dbManager.exportData();
    } catch (error) {
      console.error('Error exportando datos:', error);
      throw new Error('Error al exportar datos');
    }
  };

  const importData = async (jsonData: string): Promise<void> => {
    try {
      setSaveStatus('saving');
      
      await dbManager.importData(jsonData);
      
      // Recargar contenido después de importar
      const importedContent = await dbManager.getContent('editableContent');
      if (importedContent) {
        const mergedContent = { 
          ...defaultContent, 
          ...importedContent,
          // Asegurar que las secciones importantes existen
          hero: {
            ...defaultContent.hero,
            ...importedContent.hero
          },
          company: {
            ...defaultContent.company,
            ...importedContent.company
          },
          pricing: {
            ...defaultContent.pricing,
            ...importedContent.pricing
          }
        };
        setContent(mergedContent);
      }
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error importando datos:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      throw error;
    }
  };

  const value: EditableContentContextType = {
    content,
    updateContent,
    updatePricingSettings,
    updatePricingPlan,
    updateCustomService,
    resetToDefaults,
    exportData,
    importData,
    isLoading,
    lastSaved,
    saveStatus
  };

  return (
    <EditableContentContext.Provider value={value}>
      {children}
    </EditableContentContext.Provider>
  );
};