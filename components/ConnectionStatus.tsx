import React from 'react';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Database,
  Cloud
} from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';

const ConnectionStatus: React.FC = () => {
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
        message: 'Cargando contenido desde Supabase',
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
      if (error.includes('404') || error.includes('API endpoints no disponibles')) {
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          title: 'Configuración de Supabase pendiente',
          message: 'Usando contenido por defecto. Configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel para habilitar la edición.',
          type: 'warning' as const
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
        </div>
      </div>
    </Alert>
  );
};

export default ConnectionStatus;