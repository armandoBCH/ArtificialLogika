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
  Info
} from 'lucide-react';
import { useEditableContent } from '../../contexts/EditableContentContext';

const SupabaseConfig: React.FC = () => {
  const { isOnline, error, getAllContent } = useEditableContent();
  const [serverEnvCheck, setServerEnvCheck] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    checkServerEnvironment();
  }, []);

  const checkServerEnvironment = async () => {
    try {
      const response = await fetch('/api/check-env');
      const data = await response.json();
      setServerEnvCheck(data);
    } catch (error) {
      console.error('Failed to check server environment:', error);
      setServerEnvCheck({ error: 'Failed to connect to API endpoint' });
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await checkServerEnvironment();
      // Trigger a re-render of the context
      window.location.reload();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const allContent = await getAllContent();
      const exportData = {
        version: "2.0",
        exported_at: new Date().toISOString(),
        data: allContent
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      alert('Por favor pega los datos JSON para importar');
      return;
    }
    
    setIsImporting(true);
    try {
      const importData = JSON.parse(importText);
      
      if (!importData.data || !Array.isArray(importData.data)) {
        throw new Error('Formato de datos inválido');
      }

      // Importar cada elemento
      for (const item of importData.data) {
        const response = await fetch('/api/content-by-type?' + new URLSearchParams({ 
          type: item.content_type 
        }), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            content_data: item.content_data
          }),
        });

        if (!response.ok) {
          throw new Error(`Error importing ${item.content_type}: ${response.statusText}`);
        }
      }
      
      setImportText('');
      setShowImport(false);
      alert('✅ Datos importados exitosamente');
      
      // Refrescar página para cargar los nuevos datos
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert('❌ Error al importar: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
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

  const hasSupabaseEnv = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  const isSupabaseWorking = hasSupabaseEnv && !error && serverEnvCheck?.supabase?.urlConfigured;

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
              Configuración y estado de Supabase (Solo API)
            </p>
          </div>
        </div>

        {/* New simplified status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm">Sistema</span>
            </div>
            <div className="flex-1 text-right">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                API Only
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-green-400" />
              <span className="text-sm">Supabase</span>
            </div>
            <div className="flex-1 text-right">
              {isSupabaseWorking ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="p-4 bg-card/30 rounded-lg border border-primary/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-primary">🔍 Estado de la Conexión</h4>
            <Button
              onClick={checkServerEnvironment}
              variant="ghost"
              size="sm"
              className="text-xs"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Verificar
            </Button>
          </div>
          
          <div className="text-xs space-y-2 font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-white">VITE_SUPABASE_URL:</div>
                <div className={hasSupabaseEnv ? 'text-green-400' : 'text-red-400'}>
                  {hasSupabaseEnv ? '✅ Disponible' : '❌ No encontrada'}
                </div>
              </div>
              
              <div>
                <div className="text-white">VITE_SUPABASE_ANON_KEY:</div>
                <div className={hasSupabaseEnv ? 'text-green-400' : 'text-red-400'}>
                  {hasSupabaseEnv ? '✅ Disponible' : '❌ No encontrada'}
                </div>
              </div>
            </div>
            
            {serverEnvCheck && (
              <div className="pt-2 border-t border-border/30">
                <div className="text-white">Información del servidor:</div>
                {serverEnvCheck.error ? (
                  <div className="text-red-400">Error: {serverEnvCheck.error}</div>
                ) : (
                  <>
                    <div className={serverEnvCheck.supabase?.urlConfigured ? 'text-green-400' : 'text-red-400'}>
                      URL en servidor: {serverEnvCheck.supabase?.urlConfigured ? '✅ Configurada' : '❌ No encontrada'}
                    </div>
                    <div className={serverEnvCheck.supabase?.keyConfigured ? 'text-green-400' : 'text-red-400'}>
                      Key en servidor: {serverEnvCheck.supabase?.keyConfigured ? '✅ Configurada' : '❌ No encontrada'}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {!hasSupabaseEnv && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Supabase no configurado:</strong> Las variables de entorno no están disponibles.
              <br />
              <strong>Para Vercel:</strong> Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Project Settings.
              <br />
              <strong>Estado actual:</strong> La aplicación no funcionará correctamente sin Supabase.
            </AlertDescription>
          </Alert>
        )}

        {hasSupabaseEnv && !isSupabaseWorking && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Supabase configurado pero no conectado:</strong> Variables cargadas desde Vercel.
              <br />
              <strong>Posibles causas:</strong> Verificar que la tabla 'content' exista en Supabase.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <Button
            onClick={refreshStatus}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refrescar Estado
          </Button>
          
          <Badge variant="secondary" className={isOnline ? 'text-green-400' : 'text-red-400'}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Badge>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Gestión de Datos</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isExporting || !isSupabaseWorking}
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Exportar Backup
            </Button>
            
            <Button
              onClick={() => setShowImport(!showImport)}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!isSupabaseWorking}
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
                  disabled={!importText.trim() || isImporting}
                  className="flex items-center gap-2"
                >
                  {isImporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
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
        
        {!hasSupabaseEnv && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Variables faltantes:</strong> VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
            </AlertDescription>
          </Alert>
        )}
        
        {showEnvVars && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Para Vercel:</strong> Configura estas variables en Project Settings → Environment Variables:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg">
                <code className="flex-1 text-sm font-mono text-white">
                  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('VITE_SUPABASE_URL')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg">
                <code className="flex-1 text-sm font-mono text-white">
                  VITE_SUPABASE_ANON_KEY=tu-clave-publica-jwt
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Configuración en Vercel:</strong>
                <br />1. Ve a tu proyecto en Vercel Dashboard
                <br />2. Settings → Environment Variables
                <br />3. Añade las variables para Production, Preview y Development
                <br />4. No crear archivo .env local por seguridad
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