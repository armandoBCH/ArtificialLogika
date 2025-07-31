import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useEditableContent } from '../contexts/EditableContentContext';
import { hybridManager } from '../db/hybridManager';
import { isSupabaseConfigured } from '../db/config';
import { Database, Download, Upload, RotateCcw, HardDrive, Clock, Package, Cloud, Shield, Settings } from 'lucide-react';

interface DatabaseStats {
  totalEntries: number;
  totalSize: number;
  lastModified: Date | null;
}

const DatabaseManager: React.FC = () => {
  const { exportData, importData, resetToDefaults, saveStatus, lastSaved } = useEditableContent();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalEntries: 0,
    totalSize: 0,
    lastModified: null
  });

  // Get database status
  const dbStatus = hybridManager.getStatus();
  const supabaseConfigured = isSupabaseConfigured();

  // Cargar estadísticas de la base de datos
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Try to get stats from the hybrid manager
        // For now we'll use basic stats until we implement getStats in hybridManager
        setDbStats({
          totalEntries: 1, // At least the main content entry
          totalSize: JSON.stringify(lastSaved).length || 0,
          lastModified: lastSaved ? new Date() : null
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };

    loadStats();
    
    // Actualizar estadísticas cada 10 segundos
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [saveStatus, lastSaved]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await exportData();
      
      // Crear blob y descargar archivo
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `artificial-logika-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar datos');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      await importData(text);
      alert('Datos importados exitosamente');
    } catch (error) {
      console.error('Error importando:', error);
      alert('Error al importar datos: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
      // Limpiar input
      event.target.value = '';
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetToDefaults();
    } catch (error) {
      console.error('Error reseteando:', error);
      alert('Error al resetear contenido');
    } finally {
      setIsResetting(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getSaveStatusBadge = () => {
    switch (saveStatus) {
      case 'saving':
        return <Badge variant="secondary">Guardando...</Badge>;
      case 'saved':
        return <Badge variant="outline" className="text-primary border-primary">Guardado</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Listo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {dbStatus.provider === 'hybrid' || dbStatus.provider === 'supabase' ? (
              <Cloud className="h-5 w-5" />
            ) : (
              <Database className="h-5 w-5" />
            )}
            Estado de la Base de Datos
          </CardTitle>
          <CardDescription>
            {dbStatus.provider === 'hybrid' ? 'Sistema híbrido - Local + Supabase Cloud' :
             dbStatus.provider === 'supabase' ? 'Supabase Cloud - Sincronización automática' :
             'Sistema IndexedDB embebido - Almacenamiento local persistente'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado de guardado */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            {getSaveStatusBadge()}
          </div>

          <Separator />

          {/* Estadísticas de la base de datos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Entradas</p>
                <p className="text-lg font-bold">{dbStats.totalEntries}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <HardDrive className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Tamaño</p>
                <p className="text-lg font-bold">{formatBytes(dbStats.totalSize)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Última modificación</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(dbStats.lastModified)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información técnica */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Proveedor primario:</strong> {dbStatus.primary === 'supabase' ? 'Supabase Cloud' : 'IndexedDB Local'}</p>
            <p><strong>IndexedDB:</strong> {dbStatus.indexeddb ? '✅ Disponible' : '❌ No disponible'}</p>
            <p><strong>Supabase:</strong> {dbStatus.supabase ? '✅ Conectado' : '❌ No configurado'}</p>
            <p><strong>Persistencia:</strong> Automática con cada cambio</p>
            {dbStatus.provider === 'hybrid' && (
              <p><strong>Sincronización:</strong> Bidireccional automática</p>
            )}
          </div>

          {/* Configuración de Supabase */}
          {!supabaseConfigured && (
            <>
              <Separator />
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-blue-400">Habilitar Sincronización en la Nube</h4>
                      <p className="text-sm text-blue-400/80 mt-1">
                        El sistema funciona perfectamente con almacenamiento local. Para habilitar la sincronización en la nube y acceso desde múltiples dispositivos, configura Supabase.
                      </p>
                    </div>
                    <div className="space-y-2 text-xs text-blue-400/70">
                      <p><strong>1.</strong> Crea una cuenta gratuita en <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></p>
                      <p><strong>2.</strong> Crea un nuevo proyecto</p>
                      <p><strong>3.</strong> Ve a Project Settings {'>'} API</p>
                      <p><strong>4.</strong> Agrega las variables a tu archivo <code>.env</code>:</p>
                      <div className="font-mono bg-blue-500/10 p-2 rounded border text-xs">
                        VITE_SUPABASE_URL=https://tu-proyecto.supabase.co<br />
                        VITE_SUPABASE_ANON_KEY=tu-clave-aqui
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Status de inicialización */}
          {!dbStatus.initialized && (
            <>
              <Separator />
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Base de datos inicializándose...</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
          <CardDescription>
            Exportar, importar o resetear el contenido de la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exportar datos */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar Backup'}
            </Button>

            <div className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <Button
                asChild
                disabled={isImporting}
                className="w-full"
                variant="outline"
              >
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? 'Importando...' : 'Importar Backup'}
                </label>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Resetear a valores por defecto */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isResetting}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isResetting ? 'Reseteando...' : 'Resetear a Valores por Defecto'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Resetear toda la base de datos?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente todos los cambios y restaurará 
                  el contenido a los valores por defecto originales. Esta acción no se puede deshacer.
                  <br /><br />
                  <strong>Recomendación:</strong> Exporta un backup antes de continuar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sí, resetear todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p><strong>Nota:</strong> Los datos se guardan automáticamente en IndexedDB con cada cambio. 
            El backup se recomienda antes de hacer cambios importantes o actualizaciones del sistema.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManager;