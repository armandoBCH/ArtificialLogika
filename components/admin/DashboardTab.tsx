import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Globe, 
  Database, 
  DollarSign, 
  Image,
  ShoppingBag,
  ArrowLeft,
  Cloud,

  XCircle
} from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';
import { useRouter } from '../../contexts/RouterContext';

interface DashboardTabProps {
  setActiveTab: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ setActiveTab }) => {
  const { content, error, isOnline } = useEditableContent();
  const { navigateTo } = useRouter();
  
  // Verificar si Supabase está configurado (a través del estado de error)
  // En producción las variables de entorno no están disponibles en el cliente
  const supabaseConfigured = !error || error.includes('demo');
  
  // Status simplificado para la nueva arquitectura API-only
  const dbStatus = {
    provider: supabaseConfigured ? 'supabase' : 'offline',
    initialized: supabaseConfigured && !error,
    connected: supabaseConfigured && !error && isOnline
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Sitio Web</h3>
              <p className="text-sm text-muted-foreground">Estado general</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Secciones</span>
              <span className="text-white">6 activas</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Servicios</span>
              <span className="text-white">{content.services?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Testimonios</span>
              <span className="text-white">{content.testimonials?.length || 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              {dbStatus.connected ? (
                <Cloud className="w-5 h-5 text-blue-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">Base de Datos</h3>
              <p className="text-sm text-muted-foreground">
                {dbStatus.provider === 'supabase' ? 'Supabase API' : 'Sin conexión'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estado</span>
              <span className={dbStatus.connected ? "text-green-400" : "text-red-400"}>
                {dbStatus.connected ? 'Conectada' : 'Desconectada'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Supabase</span>
              <span className={supabaseConfigured ? "text-green-400" : "text-yellow-400"}>
                {supabaseConfigured ? 'Configurado' : 'No configurado'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Auto-save</span>
              <span className={dbStatus.connected ? "text-green-400" : "text-yellow-400"}>
                {dbStatus.connected ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
          {!supabaseConfigured && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-400 mb-2">
                ⚠️ Sin Supabase configurado. API-only requiere configuración:
              </p>
              <Button
                onClick={() => setActiveTab('database')}
                size="sm"
                variant="outline"
                className="text-xs h-7 bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30"
              >
                Configurar Supabase
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Precios</h3>
              <p className="text-sm text-muted-foreground">Completamente editables</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Planes principales</span>
              <span className="text-white">{content.pricing?.plans?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Servicios calculadora</span>
              <span className="text-white">{content.pricing?.customServices?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dólar referencia</span>
              <span className="text-white">${content.pricing?.settings?.exchangeRate || 'N/A'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Proyectos</h3>
              <p className="text-sm text-muted-foreground">Portfolio destacado</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Proyectos destacados</span>
              <span className="text-white">{content.featuredProjects?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Categorías</span>
              <span className="text-white">
                {content.featuredProjects?.length 
                  ? new Set(content.featuredProjects.map((p: any) => p.category)).size 
                  : 0
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tecnologías</span>
              <span className="text-white">
                {content.featuredProjects?.length 
                  ? new Set(content.featuredProjects.flatMap((p: any) => p.technologies || [])).size 
                  : 0
                }
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Button
            onClick={() => setActiveTab('hero')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Globe className="w-6 h-6" />
            <span>Editar Hero</span>
          </Button>
          <Button
            onClick={() => setActiveTab('services')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>Servicios</span>
          </Button>
          <Button
            onClick={() => setActiveTab('pricing')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <DollarSign className="w-6 h-6" />
            <span>Precios</span>
          </Button>
          <Button
            onClick={() => setActiveTab('projects')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Image className="w-6 h-6" />
            <span>Proyectos</span>
          </Button>
          <Button
            onClick={() => setActiveTab('database')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Database className="w-6 h-6" />
            <span>Base de Datos</span>
          </Button>
          <Button
            onClick={() => navigateTo('landing')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Ver Sitio</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardTab;