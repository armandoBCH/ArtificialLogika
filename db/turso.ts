import { createClient } from '@libsql/client';

// Configuración de Turso
const tursoUrl = process.env.TURSO_DATABASE_URL || import.meta.env.VITE_TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN || import.meta.env.VITE_TURSO_AUTH_TOKEN;

// Crear cliente de Turso
export const turso = createClient({
  url: tursoUrl || '',
  authToken: tursoToken || ''
});

// Verificar si Turso está configurado
export const isTursoConfigured = (): boolean => {
  return !!(tursoUrl && tursoToken);
};

// Obtener configuración de Turso
export const getTursoConfig = () => {
  if (!tursoUrl || !tursoToken) {
    return {
      available: false,
      url: '',
      token: '',
      error: 'Turso configuration is missing. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.'
    };
  }
  
  return {
    available: true,
    url: tursoUrl,
    token: tursoToken,
    error: null
  };
};

// Tipos para Turso
export interface TursoRecord {
  id: string;
  content_type: string;
  content_data: any;
  created_at?: string;
  updated_at?: string;
}

export interface TursoResponse {
  success: boolean;
  data?: any;
  error?: string;
} 