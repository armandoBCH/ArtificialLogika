// Esquemas y tipos para la base de datos IndexedDB
import { type DBRecord } from './types';

// Esquema de información de la empresa
export interface CompanyInfo {
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
}

// Esquema de la sección Hero
export interface HeroSection {
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
}

// Esquema principal del contenido editable
export interface EditableContentSchema {
  // Company Information
  company: CompanyInfo;
  
  // Hero Section
  hero: HeroSection;
  
  // Legacy hero properties for backward compatibility
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  
  // Value Proposition
  valueProps: ValuePropItem[];
  
  // Services
  services: ServiceItem[];
  
  // Process Steps
  processSteps: ProcessStepItem[];
  
  // Featured Projects
  featuredProjects: ProjectItem[];
  
  // Testimonials
  testimonials: TestimonialItem[];
  
  // FAQ
  faqs: FAQItem[];
  
  // Footer
  footerDescription: string;
  footerCTA: string;
  finalCTATitle: string;
  finalCTADescription: string;
  finalCTAButton: string;
}

export interface ValuePropItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  price: string;
  originalPrice?: string;
  popular?: boolean;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Registro específico para contenido editable
export interface ContentRecord extends DBRecord {
  id: 'editableContent';
  data: EditableContentSchema;
}

// Funciones de validación de esquema
export const validateEditableContent = (data: any): data is EditableContentSchema => {
  if (!data || typeof data !== 'object') return false;
  
  // Validar información de la empresa
  if (!validateCompanyInfo(data.company)) return false;
  
  // Validar sección hero
  if (!validateHeroSection(data.hero)) return false;
  
  // Validar propiedades requeridas del contenido
  const requiredStringProps = [
    'heroTitle', 'heroSubtitle', 'heroDescription', 'heroCTA',
    'footerDescription', 'footerCTA', 'finalCTATitle', 
    'finalCTADescription', 'finalCTAButton'
  ];
  
  for (const prop of requiredStringProps) {
    if (typeof data[prop] !== 'string') return false;
  }
  
  // Validar arrays
  const requiredArrayProps = [
    'valueProps', 'services', 'processSteps', 
    'featuredProjects', 'testimonials', 'faqs'
  ];
  
  for (const prop of requiredArrayProps) {
    if (!Array.isArray(data[prop])) return false;
  }
  
  return true;
};

export const validateCompanyInfo = (company: any): company is CompanyInfo => {
  if (!company || typeof company !== 'object') return false;
  
  const requiredProps = ['name', 'tagline', 'phone', 'email', 'address', 'founderName', 'founderTitle'];
  for (const prop of requiredProps) {
    if (typeof company[prop] !== 'string') return false;
  }
  
  // Validar redes sociales
  if (!company.socialMedia || typeof company.socialMedia !== 'object') return false;
  const socialProps = ['linkedin', 'twitter', 'github'];
  for (const prop of socialProps) {
    if (typeof company.socialMedia[prop] !== 'string') return false;
  }
  
  return true;
};

export const validateHeroSection = (hero: any): hero is HeroSection => {
  if (!hero || typeof hero !== 'object') return false;
  
  const requiredStringProps = ['title', 'subtitle', 'description', 'ctaText', 'ctaTextLong', 'trustText'];
  for (const prop of requiredStringProps) {
    if (typeof hero[prop] !== 'string') return false;
  }
  
  // Validar dynamicTexts array
  if (!Array.isArray(hero.dynamicTexts)) return false;
  for (const text of hero.dynamicTexts) {
    if (typeof text !== 'string') return false;
  }
  
  // Validar stats array
  if (!Array.isArray(hero.stats)) return false;
  for (const stat of hero.stats) {
    if (!stat || typeof stat !== 'object') return false;
    if (typeof stat.number !== 'string' || typeof stat.label !== 'string' || typeof stat.sublabel !== 'string') {
      return false;
    }
  }
  
  return true;
};

export const validateValueProp = (item: any): item is ValuePropItem => {
  return (
    typeof item?.icon === 'string' &&
    typeof item?.title === 'string' &&
    typeof item?.description === 'string'
  );
};

export const validateService = (item: any): item is ServiceItem => {
  return (
    typeof item?.title === 'string' &&
    typeof item?.description === 'string' &&
    Array.isArray(item?.features) &&
    typeof item?.price === 'string'
  );
};

export const validateTestimonial = (item: any): item is TestimonialItem => {
  return (
    typeof item?.name === 'string' &&
    typeof item?.role === 'string' &&
    typeof item?.company === 'string' &&
    typeof item?.content === 'string' &&
    typeof item?.avatar === 'string'
  );
};

// Migraciones de esquema para futuras versiones
export const migrations = {
  1: {
    // Migración inicial - agregar información de empresa
    up: (data: any) => {
      if (!data.company) {
        data.company = {
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
        };
      }
      return data;
    },
    down: (data: any) => {
      delete data.company;
      return data;
    }
  },
  2: {
    // Migración para agregar sección hero estructurada
    up: (data: any) => {
      if (!data.hero) {
        data.hero = {
          title: "Transformamos",
          subtitle: "en ventaja competitiva", 
          description: data.heroDescription || "Creo sitios web, e-commerce y herramientas de automatización que impulsan tu negocio hacia el siguiente nivel. Todo autogestionable, sin dependencias.",
          ctaText: "Conversemos",
          ctaTextLong: data.heroCTA || "Conversemos sobre tu proyecto",
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
        };
      }
      return data;
    },
    down: (data: any) => {
      delete data.hero;
      return data;
    }
  }
  // Futuras migraciones se agregarán aquí
};

export const applyMigrations = (data: any, fromVersion: number, toVersion: number) => {
  let migratedData = { ...data };
  
  for (let version = fromVersion + 1; version <= toVersion; version++) {
    if (migrations[version as keyof typeof migrations]) {
      migratedData = migrations[version as keyof typeof migrations].up(migratedData);
    }
  }
  
  return migratedData;
};

// Función para aplicar migración automática a datos existentes
export const migrateExistingData = (data: any): EditableContentSchema => {
  const currentVersion = 2;
  const migratedData = applyMigrations(data, 0, currentVersion);
  
  // Asegurar que todos los campos requeridos existen
  return {
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
      },
      ...migratedData.company
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
      ],
      ...migratedData.hero
    },
    heroTitle: "Transformamos ideas en ventaja competitiva",
    heroSubtitle: "Desarrollo web y soluciones de IA para PyMEs ambiciosas",
    heroDescription: "Creo sitios web, e-commerce y herramientas de automatización que impulsan tu negocio hacia el siguiente nivel. Todo autogestionable, sin dependencias.",
    heroCTA: "Conversemos sobre tu proyecto",
    valueProps: [],
    services: [],
    processSteps: [],
    featuredProjects: [],
    testimonials: [],
    faqs: [],
    footerDescription: "Especialista en desarrollo web y soluciones de IA para PyMEs que buscan diferenciarse con tecnología inteligente.",
    footerCTA: "¿Listo para transformar tu negocio?",
    finalCTATitle: "Construyamos tu ventaja competitiva",
    finalCTADescription: "Agenda una consulta gratuita de 30 minutos y descubre cómo la tecnología puede impulsar tu negocio.",
    finalCTAButton: "Agendar consulta gratuita",
    ...migratedData
  };
};