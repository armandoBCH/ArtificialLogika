import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para el contenido editable
export interface HeroContent {
  title: string;
  subtitle: string;
  dynamicTexts: string[];
  description: string;
  ctaText: string;
  ctaTextLong: string;
  trustText: string;
  stats: Array<{
    number: string;
    label: string;
    sublabel: string;
  }>;
}

export interface ServiceContent {
  title: string;
  description: string;
  icon: string;
  features: string[];
  businessValue: string;
  roi: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverable: string;
}

export interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  result?: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  founderName: string;
  founderTitle: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  credentials: string[];
}

export interface EditableContent {
  company: CompanyInfo;
  hero: HeroContent;
  services: ServiceContent[];
  processSteps: ProcessStep[];
  pricing: PricingPlan[];
  faq: FAQItem[];
  testimonials: TestimonialItem[];
  valueProposition: {
    title: string;
    subtitle: string;
    points: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  psychologicalTriggers: {
    scarcity: string;
    urgency: string;
    authority: string;
    socialProof: string;
  };
}

// Contenido actualizado más realista para emprendimiento joven
const defaultContent: EditableContent = {
  company: {
    name: "Artificial Lógika",
    tagline: "Software + IA",
    email: "info@artificiallogika.com",
    phone: "+34 600 000 000",
    address: "Madrid, España",
    founderName: "Alex Rodríguez",
    founderTitle: "Developer & Fundador • Especialista en automatización",
    socialMedia: {
      linkedin: "https://linkedin.com/company/artificial-logika",
      twitter: "https://twitter.com/artificiallogika",
      instagram: "https://instagram.com/artificiallogika"
    },
    credentials: [
      "Especialista en automatización",
      "Desarrollador full-stack",
      "Experto en integración de IA",
      "Enfoque en soluciones prácticas"
    ]
  },
  hero: {
    title: "Transformamos",
    subtitle: "en ventaja competitiva",
    dynamicTexts: [
      "tu lógica de negocio",
      "ideas brillantes",
      "procesos manuales",
      "páginas web desde cero",
      "ecommerce que convierte",
      "sistemas inteligentes"
    ],
    description: "Creamos soluciones digitales desde cero, completamente autogestionables, que automatizan procesos y potencian tu negocio. Páginas web, ecommerce, chatbots inteligentes y sistemas que trabajan por ti las 24 horas.",
    ctaText: "Ver cómo ayudo",
    ctaTextLong: "Descubrir cómo puedo ayudarte",
    trustText: "Proyectos completados • Enfoque personalizado • Resultados reales",
    stats: [
      { number: "10+", label: "Horas ahorradas", sublabel: "por semana promedio" },
      { number: "2x", label: "Más eficiencia", sublabel: "en procesos clave" },
      { number: "24/7", label: "Funcionamiento", sublabel: "automático" }
    ]
  },
  services: [
    {
      title: "Páginas Web & Ecommerce",
      description: "Creamos desde cero sitios web, tiendas online y landing pages completamente autogestionables que convierten visitantes en clientes. Diseño moderno, carga rápida y panel de administración incluido.",
      icon: "Globe",
      features: [
        "Diseño único optimizado para conversión", 
        "Desarrollo completo desde cero",
        "Ecommerce con pasarela de pagos integrada",
        "Carga súper rápida (<3 segundos)",
        "Responsive en todos los dispositivos",
        "Panel de administración autogestionable",
        "SEO técnico incluido",
        "Hosting y configuración completa"
      ],
      businessValue: "Presencia digital profesional que convierte y vende",
      roi: "Mejora conversiones 50-150%"
    },
    {
      title: "Chatbots & Asistentes IA",
      description: "Desarrollamos chatbots inteligentes completamente autogestionables que atienden a tus clientes 24/7, responden preguntas y capturan leads automáticamente. Panel de control incluido.",
      icon: "MessageSquare",
      features: [
        "Respuestas automáticas 24/7",
        "Integración con WhatsApp/Web",
        "Captura de leads automática",
        "Respuestas personalizadas",
        "Analytics de conversaciones",
        "Escalado a humano cuando es necesario"
      ],
      businessValue: "Atención al cliente automatizada",
      roi: "Ahorra 20+ horas/semana"
    },
    {
      title: "Automatización de Procesos", 
      description: "Diseñamos sistemas de automatización completamente autogestionables para eliminar tareas repetitivas: reportes automáticos, seguimiento de clientes, gestión de inventario y workflows inteligentes.",
      icon: "Zap",
      features: [
        "Sistemas de automatización custom",
        "Integración entre herramientas existentes", 
        "Workflows inteligentes personalizados",
        "Reportes automáticos programados",
        "Notificaciones y alertas inteligentes",
        "Dashboards de control en tiempo real"
      ],
      businessValue: "Libera tiempo para tareas importantes",
      roi: "Ahorra 10-15 horas/semana"
    }
  ],
  processSteps: [
    {
      step: 1,
      title: "Conversación Inicial (Gratuita)",
      description: "Hablamos 30-60 minutos para entender exactamente qué necesitas y cómo puedo ayudarte. Sin compromisos, solo una charla honesta.",
      duration: "1-2 días",
      deliverable: "Propuesta clara con cronograma y precio exacto"
    },
    {
      step: 2,
      title: "Planificación y Diseño",
      description: "Diseño la solución, creamos prototipos si es necesario, y te muestro exactamente cómo va a funcionar antes de empezar.",
      duration: "3-5 días",
      deliverable: "Plan detallado + prototipos + cronograma"
    },
    {
      step: 3,
      title: "Desarrollo",
      description: "Construyo tu solución paso a paso, manteniéndote informado del progreso. Puedes ver y testear mientras desarrollo.",
      duration: "1-3 semanas",
      deliverable: "Solución funcionando + testing + ajustes"
    },
    {
      step: 4,
      title: "Entrega y Seguimiento",
      description: "Te entrego todo funcionando, te enseño a usarlo, y quedo disponible para dudas y ajustes menores.",
      duration: "Ongoing",
      deliverable: "Capacitación + documentación + soporte básico"
    }
  ],
  pricing: [
    {
      name: "Consulta & Análisis",
      subtitle: "Empezamos aquí",
      price: "Gratuita",
      period: "",
      description: "Conversación de 60 minutos para entender tu situación y diseñar la mejor solución",
      features: [
        "Análisis de tu situación actual",
        "Identificación de oportunidades",
        "Propuesta personalizada",
        "Presupuesto detallado",
        "Sin compromisos",
        "Consejos útiles aunque no trabajemos juntos"
      ],
      popular: false,
      cta: "Agendar conversación"
    },
    {
      name: "Proyecto Personalizado",
      subtitle: "La mayoría de proyectos",
      price: "€800 - €5,000",
      period: "",
      description: "Creación completa desde cero y autogestionable: landing pages, ecommerce, chatbots inteligentes y sistemas de automatización",
      features: [
        "Desarrollo completo desde cero",
        "Solución 100% personalizada y autogestionable",
        "Entrega en 1-4 semanas según complejidad",
        "Capacitación completa del equipo",
        "2-3 meses de ajustes post-lanzamiento",
        "Documentación técnica completa",
        "Integración con sistemas existentes",
        "Soporte durante toda la implementación"
      ],
      popular: true,
      cta: "Ver qué necesito"
    },
    {
      name: "Consultoría Continua",
      subtitle: "Apoyo constante",
      price: "€200/mes",
      period: "",
      description: "Soporte técnico y optimizaciones continuas para tus sistemas",
      features: [
        "Soporte técnico prioritario",
        "Optimizaciones mensuales",
        "Consulta estratégica",
        "Updates y mantenimiento",
        "Sin compromisos de tiempo",
        "Cancelación cuando quieras"
      ],
      popular: false,
      cta: "Consultar disponibilidad"
    }
  ],
  faq: [
    {
      id: 1,
      question: "¿Realmente puedes hacer todo eso siendo solo una persona?",
      answer: "Me enfoco en hacer pocas cosas pero muy bien. Trabajo con las tecnologías que domino y si tu proyecto requiere algo que está fuera de mi expertise, te lo diré honestamente y te recomendaré alternativas.",
      category: "Capacidad"
    },
    {
      id: 2,
      question: "¿Cuántos proyectos puedes manejar al mismo tiempo?",
      answer: "Normalmente trabajo con 3-5 proyectos simultáneamente, dependiendo de la complejidad. Prefiero dar buen servicio a pocos clientes que servicio mediocre a muchos.",
      category: "Capacidad"
    },
    {
      id: 3,
      question: "¿Cuánto tiempo realmente toma completar un proyecto?",
      answer: "Landing pages: 1-2 semanas. Sitios web completos: 2-4 semanas. Ecommerce: 3-6 semanas. Chatbots: 1-3 semanas. Automatizaciones: 1-4 semanas dependiendo de la complejidad. Siempre doy fechas realistas.",
      category: "Tiempo"
    },
    {
      id: 4,
      question: "¿Qué pasa si no funciona como esperaba?",
      answer: "Trabajo contigo hasta que funcione bien. Si hay un problema técnico, lo arreglo sin costo. Si simplemente no te gusta el resultado, revisamos qué salió mal y lo ajustamos.",
      category: "Garantía"
    },
    {
      id: 5,
      question: "¿Por qué debería elegirte en lugar de una agencia grande?",
      answer: "Porque trabajas directamente conmigo, no con un account manager. Soy más flexible, más rápido para cambios, y mucho más barato. El trade-off es que no tengo un equipo de 20 personas.",
      category: "Diferenciación"
    },
    {
      id: 6,
      question: "¿Trabajas con cualquier tipo de negocio?",
      answer: "Trabajo mejor con pequeñas y medianas empresas que necesitan soluciones prácticas. No soy la mejor opción para corporaciones gigantes o proyectos que requieren equipos enormes.",
      category: "Clientes"
    },
    {
      id: 7,
      question: "¿Cómo sé si realmente necesito automatización?",
      answer: "Si pasas más de 2 horas semanales haciendo tareas repetitivas, o si pierdes clientes porque no puedes responder rápido, probablemente te beneficiarías. En la consulta gratuita lo analizamos juntos.",
      category: "Necesidad"
    },
    {
      id: 8,
      question: "¿Puedes crear un ecommerce que realmente venda?",
      answer: "Sí, creo ecommerce completamente desde cero y autogestionables, optimizados para conversiones. Incluyo pasarelas de pago, gestión de inventario, panel de administración y todas las funcionalidades necesarias para vender online efectivamente.",
      category: "Ecommerce"
    }
  ],
  testimonials: [
    {
      name: "María García",
      role: "Fundadora",
      company: "Estudio Creativo",
      content: "Alex me ayudó a automatizar mi proceso de presupuestos. Antes tardaba 2 horas por presupuesto, ahora 15 minutos. Simple pero efectivo.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
      result: "⏰ Ahorro 6 horas/semana"
    },
    {
      name: "Carlos Mendoza",
      role: "Gerente",
      company: "Consultoría Legal",
      content: "El chatbot que me hizo responde las preguntas básicas de clientes 24/7. Ya no pierdo clientes porque no puedo contestar el teléfono.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      result: "📞 +30% más consultas capturadas"
    },
    {
      name: "Ana López",
      role: "Dueña",
      company: "Tienda Online",
      content: "Alex me creó un ecommerce completamente desde cero. Con checkout optimizado, pagos seguros, y diseño enfocado en conversión. Ahora realmente vendo online.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      result: "🛒 +200% ventas online"
    }
  ],
  valueProposition: {
    title: "¿Por qué trabajar conmigo?",
    subtitle: "Porque entiendo que necesitas soluciones que funcionen, no tecnología complicada",
    points: [
      {
        title: "Trabajo directo contigo",
        description: "No hay intermediarios. Hablas conmigo, yo desarrollo tu proyecto, yo te entrego el resultado.",
        icon: "User"
      },
      {
        title: "Enfoque práctico",
        description: "No vendo tecnología complicada. Creo soluciones desde cero que resuelven problemas reales y generan resultados medibles.",
        icon: "Target"
      },
      {
        title: "Precios honestos",
        description: "Te digo exactamente cuánto va a costar desde el principio. Sin sorpresas, sin letra pequeña.",
        icon: "DollarSign"
      }
    ]
  },
  psychologicalTriggers: {
    scarcity: "Enfoque personalizado en cada proyecto",
    urgency: "Cada día sin automatizar pierdes tiempo valioso",
    authority: "Especialista en automatización y desarrollo web",
    socialProof: "Proyectos completados • Clientes satisfechos • Resultados reales"
  }
};

interface EditableContentContextType {
  content: EditableContent;
  updateContent: (section: keyof EditableContent, data: any) => void;
  resetToDefault: () => void;
}

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export const EditableContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<EditableContent>(defaultContent);

  // Cargar contenido del localStorage al inicializar
  useEffect(() => {
    const savedContent = localStorage.getItem('artificialLogika_content');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setContent({ ...defaultContent, ...parsedContent });
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
  }, []);

  // Guardar en localStorage cuando el contenido cambie
  useEffect(() => {
    localStorage.setItem('artificialLogika_content', JSON.stringify(content));
  }, [content]);

  const updateContent = (section: keyof EditableContent, data: any) => {
    setContent(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const resetToDefault = () => {
    setContent(defaultContent);
    localStorage.removeItem('artificialLogika_content');
  };

  return (
    <EditableContentContext.Provider value={{ content, updateContent, resetToDefault }}>
      {children}
    </EditableContentContext.Provider>
  );
};

export const useEditableContent = () => {
  const context = useContext(EditableContentContext);
  if (context === undefined) {
    throw new Error('useEditableContent must be used within an EditableContentProvider');
  }
  return context;
};