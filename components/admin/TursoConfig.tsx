import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Database, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

interface TursoStatus {
  configured: boolean;
  urlConfigured: boolean;
  tokenConfigured: boolean;
  urlLength: number;
  tokenLength: number;
}

export default function TursoConfig() {
  const [serverEnvCheck, setServerEnvCheck] = useState<TursoStatus | null>(null);
  const [clientEnvCheck, setClientEnvCheck] = useState<TursoStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkServerEnvironment = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/test-turso');
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 TursoConfig test result:', data);
        
        // Convertir el resultado del test a formato TursoStatus
        const tursoStatus = {
          configured: data.summary?.configured || false,
          urlConfigured: data.environment?.urlConfigured || false,
          tokenConfigured: data.environment?.tokenConfigured || false,
          urlLength: data.environment?.urlLength || 0,
          tokenLength: data.environment?.tokenLength || 0
        };
        
        setServerEnvCheck(tursoStatus);
        setLastCheck(new Date());
      } else {
        console.error('Failed to check server environment');
      }
    } catch (error) {
      console.error('Error checking server environment:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const checkClientEnvironment = () => {
    const url = import.meta.env.VITE_TURSO_DATABASE_URL;
    const token = import.meta.env.VITE_TURSO_AUTH_TOKEN;
    
    setClientEnvCheck({
      configured: !!(url && token),
      urlConfigured: !!url,
      tokenConfigured: !!token,
      urlLength: url?.length || 0,
      tokenLength: token?.length || 0
    });
  };

  useEffect(() => {
    checkServerEnvironment();
    checkClientEnvironment();
  }, []);

  const getStatusColor = (configured: boolean) => {
    return configured ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getStatusIcon = (configured: boolean) => {
    return configured ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configuración de Turso
          </CardTitle>
          <CardDescription>
            Verifica el estado de las variables de entorno de Turso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado del servidor:</span>
              {serverEnvCheck && (
                <Badge className={getStatusColor(serverEnvCheck.configured)}>
                  {getStatusIcon(serverEnvCheck.configured)}
                  {serverEnvCheck.configured ? 'Configurado' : 'No configurado'}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkServerEnvironment}
              disabled={isChecking}
            >
              {isChecking ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Verificar
            </Button>
          </div>

          {serverEnvCheck && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">URL de Turso:</span>
                  <Badge variant={serverEnvCheck.urlConfigured ? "default" : "destructive"}>
                    {serverEnvCheck.urlConfigured ? '✓' : '✗'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Longitud: {serverEnvCheck.urlLength} caracteres
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Token de Turso:</span>
                  <Badge variant={serverEnvCheck.tokenConfigured ? "default" : "destructive"}>
                    {serverEnvCheck.tokenConfigured ? '✓' : '✗'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Longitud: {serverEnvCheck.tokenLength} caracteres
                </div>
              </div>
            </div>
          )}

          {clientEnvCheck && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Estado del cliente:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">URL de Turso:</span>
                    <Badge variant={clientEnvCheck.urlConfigured ? "default" : "destructive"}>
                      {clientEnvCheck.urlConfigured ? '✓' : '✗'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Longitud: {clientEnvCheck.urlLength} caracteres
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Token de Turso:</span>
                    <Badge variant={clientEnvCheck.tokenConfigured ? "default" : "destructive"}>
                      {clientEnvCheck.tokenConfigured ? '✓' : '✗'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Longitud: {clientEnvCheck.tokenLength} caracteres
                  </div>
                </div>
              </div>
            </div>
          )}

          {lastCheck && (
            <div className="text-xs text-muted-foreground">
              Última verificación: {lastCheck.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {serverEnvCheck && !serverEnvCheck.configured && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Las variables de entorno de Turso no están configuradas en Vercel. 
            Para configurar, ve a tu proyecto en Vercel → Settings → Environment Variables 
            y agrega VITE_TURSO_DATABASE_URL y VITE_TURSO_AUTH_TOKEN.
          </AlertDescription>
        </Alert>
      )}

      {serverEnvCheck && serverEnvCheck.configured && (
        <Alert className="border-green-500/20 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">
            Turso está correctamente configurado. La aplicación puede sincronizar datos con la base de datos en la nube.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 