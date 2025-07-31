import { 
  LayoutDashboard, 
  Building, 
  Sparkles, 
  Briefcase, 
  Calculator, 
  FolderOpen, 
  Database,
  Settings
} from 'lucide-react';

export const adminTabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Resumen general del sistema'
  },
  {
    id: 'company',
    label: 'Empresa',
    icon: Building,
    description: 'Información de la empresa y contacto'
  },
  {
    id: 'hero',
    label: 'Hero',
    icon: Sparkles,
    description: 'Sección principal de la página'
  },
  {
    id: 'services',
    label: 'Servicios',
    icon: Briefcase,
    description: 'Servicios principales ofrecidos'
  },
  {
    id: 'pricing',
    label: 'Precios',
    icon: Calculator,
    description: 'Planes y calculadora de precios'
  },
  {
    id: 'projects',
    label: 'Proyectos',
    icon: FolderOpen,
    description: 'Proyectos destacados y portfolio'
  },
  {
    id: 'database',
    label: 'Base de Datos',
    icon: Database,
    description: 'Configuración y sincronización'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    description: 'Configuración general del sistema'
  }
] as const;

export type AdminTabId = typeof adminTabs[number]['id'];

// Constants for badge colors
export const badgeColors = {
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/20 text-green-400 border-green-500/20',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  red: 'bg-red-500/20 text-red-400 border-red-500/20',
  gray: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
  primary: 'bg-primary/20 text-primary border-primary/20'
} as const;

// Constants for service icons
export const serviceIcons = [
  'Globe',
  'MessageSquare',
  'Zap',
  'ShoppingCart',
  'Users',
  'BarChart',
  'Shield',
  'Smartphone',
  'Laptop',
  'Database',
  'Cloud',
  'Settings'
] as const;

// Constants for database types
export const databaseTypes = [
  { value: 'none', label: 'Sin Base de Datos' },
  { value: 'sqlite', label: 'SQLite (Gratis)' },
  { value: 'supabase', label: 'Supabase Pro' }
] as const;

// Constants for project categories
export const projectCategories = [
  'Landing',
  'E-commerce',
  'SaaS',
  'Portfolio',
  'Corporate',
  'Blog',
  'Dashboard',
  'Mobile App',
  'API',
  'Other'
] as const;

// Constants for save status
export const saveStatuses = {
  idle: { text: 'Guardado', color: 'bg-green-500' },
  saving: { text: 'Guardando...', color: 'bg-yellow-500' },
  saved: { text: 'Guardado', color: 'bg-green-500' },
  error: { text: 'Error', color: 'bg-red-500' }
} as const;