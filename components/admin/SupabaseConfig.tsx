import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';

import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  Download,
  Upload,

  Settings,
  Cloud,
  HardDrive,
  Info
} from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';
import { validateEnvironment, getSupabaseConfig } from '../../db/config';

const SupabaseConfig: React.FC = () => {
  const {
    getDatabaseStatus,
    forceSyncToSupabase,
    forceSyncFromSupabase,
    exportData,
    importData,

  } = useEditableContent();

  const [status, setStatus] = useState(getDatabaseStatus());
  const [envValidation, setEnvValidation] = useState(validateEnvironment());
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    refreshStatus();
  }, []);

  const refreshStatus = () => {
    setStatus(getDatabaseStatus());
    setEnvValidation(validateEnvironment());
    setSupabaseConfig(getSupabaseConfig());
  };

  const handleSyncToSupabase = async () => {
    if (!supabaseConfig.available) {
      alert('Supabase no está configurado. Configura las variables de entorno primero.');
      return;
    }

    setIsSyncing(true);
    try {
      await forceSyncToSupabase();
      refreshStatus();
      alert('✅ Datos sincronizados a Supabase exitosamente');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('❌ Error al sincronizar a Supabase: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncFromSupabase = async () => {
    if (!supabaseConfig.available) {
      alert('Supabase no está configurado. Configura las variables de entorno primero.');
      return;
    }

    setIsSyncing(true);
    try {
      await forceSyncFromSupabase();
      refreshStatus();
      alert('✅ Datos sincronizados desde Supabase exitosamente');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('❌ Error al sincronizar desde Supabase: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `artificial-logika-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('✅ Backup exportado exitosamente');
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Error al exportar: ' + (error as Error).message);
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      alert('Por favor pega los datos JSON para importar');
      return;
    }
    
    try {
      await importData(importText);
      setImportText('');
      setShowImport(false);
      refreshStatus();
      alert('✅ Datos importados exitosamente');
    } catch (error) {
      console.error('Import failed:', error);
      alert('❌ Error al importar: ' + (error as Error).message);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('📋 Copiado al portapapeles');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('❌ Error al copiar');
    }
  };

  const getStatusColor = (provider: string) => {
    switch (provider) {
      case 'hybrid': return 'bg-primary/20 text-primary border-primary/20';
      case 'supabase': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'indexeddb': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      default: return 'bg-red-500/20 text-red-400 border-red-500/20';
    }
  };

  const getStatusIcon = (provider: string) => {
    switch (provider) {
      case 'hybrid': return <Database className="w-4 h-4" />;
      case 'supabase': return <Cloud className="w-4 h-4" />;
      case 'indexeddb': return <HardDrive className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Estado de la Base de Datos</h3>
            <p className="text-sm text-muted-foreground">
              Configuración y sincronización de Supabase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
            <Badge variant="secondary" className={getStatusColor(status.provider)}>
              {getStatusIcon(status.provider)}
              <span className="ml-2 capitalize">{status.provider}</span>
            </Badge>
            <div className="flex-1 text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshStatus}
                className="text-muted-foreground hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-green-400" />
              <span className="text-sm">Supabase</span>
            </div>
            <div className="flex-1 text-right">
              {status.supabase ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Local</span>
            </div>
            <div className="flex-1 text-right">
              {status.indexeddb ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {!supabaseConfig.available && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Supabase no configurado:</strong> {supabaseConfig.error}
              <br />
              La aplicación funcionará solo con almacenamiento local (IndexedDB).
            </AlertDescription>
          </Alert>
        )}

        {supabaseConfig.available && !status.supabase && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Supabase configurado pero no conectado:</strong> Verifica la URL y clave de API, y que la tabla 'content' exista en tu proyecto.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Sync Controls */}
      {supabaseConfig.available && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sincronización</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleSyncToSupabase}
              disabled={isSyncing || !status.supabase}
              className="flex items-center gap-2"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Subir a Supabase
            </Button>
            
            <Button
              onClick={handleSyncFromSupabase}
              disabled={isSyncing || !status.supabase}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Descargar de Supabase
            </Button>
          </div>
          
          {!status.supabase && supabaseConfig.available && (
            <p className="text-sm text-muted-foreground mt-2">
              ⚠️ La sincronización no está disponible. Verifica la conexión a Supabase.
            </p>
          )}
        </Card>
      )}

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Gestión de Datos</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Backup
            </Button>
            
            <Button
              onClick={() => setShowImport(!showImport)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar Datos
            </Button>
          </div>
          
          {showImport && (
            <div className="space-y-2">
              <Label htmlFor="import-data" className="text-white">
                Pegar datos JSON:
              </Label>
              <textarea
                id="import-data"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={10}
                className="w-full p-3 bg-card border border-border/50 rounded-lg text-white font-mono text-sm"
                placeholder="Pegar aquí el JSON exportado..."
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Importar
                </Button>
                <Button
                  onClick={() => setShowImport(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Environment Variables */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Variables de Entorno</h3>
          <Button
            onClick={() => setShowEnvVars(!showEnvVars)}
            variant="outline"
            size="sm"
          >
            {showEnvVars ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
        
        {!envValidation.valid && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Variables faltantes:</strong> {envValidation.missing.join(', ')}
            </AlertDescription>
          </Alert>
        )}
        
        {showEnvVars && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para habilitar Supabase, añade estas variables a tu archivo .env:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg">
                <code className="flex-1 text-sm font-mono text-white">
                  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('VITE_SUPABASE_URL=https://tu-proyecto.supabase.co')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg">
                <code className="flex-1 text-sm font-mono text-white">
                  VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Estas variables deben configurarse en tu proveedor de hosting (Vercel, Netlify, etc.) para que funcionen en producción.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Card>

      {/* SQL Schema */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Esquema SQL para Supabase</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ejecuta este código SQL en tu editor de Supabase para crear las tablas necesarias:
        </p>
        
        <div className="relative">
          <pre className="bg-card/50 p-4 rounded-lg text-sm font-mono text-white overflow-x-auto max-h-80">
{`-- Enable RLS (Row Level Security)
alter table if exists public.content enable row level security;

-- Create content table
create table if not exists public.content (
  id text primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  content_type text not null,
  content_data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create policies
create policy "Users can manage own content" on public.content
  for all using (auth.uid() = user_id or user_id is null);

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger content_updated_at
  before update on public.content
  for each row execute function public.handle_updated_at();`}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(`-- Enable RLS (Row Level Security)
alter table if exists public.content enable row level security;

-- Create content table
create table if not exists public.content (
  id text primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  content_type text not null,
  content_data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create policies
create policy "Users can manage own content" on public.content
  for all using (auth.uid() = user_id or user_id is null);

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger content_updated_at
  before update on public.content
  for each row execute function public.handle_updated_at();`)}
            className="absolute top-2 right-2"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SupabaseConfig;