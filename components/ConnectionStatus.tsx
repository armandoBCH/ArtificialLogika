import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Database,
  Cloud,
  Settings
} from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';

interface ConnectionStatusProps {
  variant?: 'full' | 'compact';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ variant = 'full' }) => {
  const { loading, error, isOnline } = useEditableContent();

  // Determinar estado y configuración de visualización
  const getStatusConfig = () => {
    if (loading) {
      return {
        icon: Loader2,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        title: 'Conectando...',
        message: 'Cargando contenido desde Turso',
        type: 'loading' as const
      };
    }

    if (!isOnline) {
      return {
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        title: 'Sin conexión a internet',
        message: 'Usando contenido por defecto. La edición no estará disponible.',
        type: 'error' as const
      };
    }

    if (error) {
      if (error.includes('modo demo') || error.includes('variables de entorno') || error.includes('API not available')) {
        return {
          icon: AlertTriangle,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          title: 'Modo Demo Activo',
          message: 'La aplicación está funcionando con contenido de demostración. Para habilitar la edición completa, configura Supabase en el panel de administración.',
          type: 'info' as const
        };
      } else if (error.includes('guardados localmente')) {
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          title: 'Sincronización limitada',
          message: 'Los cambios se guardan localmente pero no se sincronizan con Supabase. Configura la base de datos para persistencia completa.',
          type: 'warning' as const
        };
      } else {
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          title: 'Error de conexión',
          message: error,
          type: 'error' as const
        };
      }
    }

    // Estado conectado correctamente
    return {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      title: 'Conectado a Supabase',
      message: 'Todos los cambios se sincronizan automáticamente con la base de datos.',
      type: 'success' as const
    };
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  // Versión compacta para landing page
  if (variant === 'compact') {
    // Solo mostrar si hay un error crítico, no en modo demo
    if (!error || statusConfig.type === 'success' || statusConfig.type === 'info') {
      return null;
    }

    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Alert className={`${statusConfig.bgColor} ${statusConfig.borderColor} shadow-lg`}>
          <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 ${statusConfig.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <AlertDescription className="text-xs text-muted-foreground">
                Error de conexión. Verifica tu conexión a internet.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  // Versión completa para admin
  return (
    <Alert className={`${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      <div className="flex items-start gap-3">
        <Icon 
          className={`w-5 h-5 ${statusConfig.color} flex-shrink-0 ${loading ? 'animate-spin' : ''}`} 
        />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${statusConfig.color} mb-1`}>
            {statusConfig.title}
          </h4>
          <AlertDescription className="text-xs text-muted-foreground">
            {statusConfig.message}
          </AlertDescription>
          
          {/* Indicadores adicionales */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {error ? 'Local' : 'Supabase'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {/* Instrucciones para resolver */}
          {statusConfig.type === 'warning' && (
            <div className="mt-3 p-2 bg-background/50 rounded border border-border/50">
              <div className="flex items-start gap-2">
                <Settings className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Para habilitar la edición:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Ve a Vercel Dashboard → Project Settings → Environment Variables</li>
                    <li>Agrega VITE_SUPABASE_URL con tu URL de proyecto Supabase</li>
                    <li>Agrega VITE_SUPABASE_ANON_KEY con tu clave anónima</li>
                    <li>Redeploy el proyecto</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default ConnectionStatus;