// Configuración central de la base de datos IndexedDB
export const DB_CONFIG = {
  name: 'ArtificialLogikaDB',
  version: 1,
  stores: {
    content: {
      name: 'content',
      keyPath: 'id',
      indexes: [
        { name: 'lastModified', keyPath: 'lastModified', unique: false },
        { name: 'version', keyPath: 'version', unique: false }
      ]
    }
  }
} as const;

// Tipos para TypeScript
export interface DBRecord {
  id: string;
  data: any;
  lastModified: Date;
  version: number;
  checksum?: string; // Para verificación de integridad futura
}

export interface DBStats {
  totalEntries: number;
  totalSize: number;
  lastModified: Date | null;
  oldestEntry: Date | null;
  averageSize: number;
}

// Utilidades de validación
export const validateContentData = (data: any): boolean => {
  try {
    // Verificar que sea un objeto válido
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    // Verificar que se puede serializar
    JSON.stringify(data);
    
    return true;
  } catch {
    return false;
  }
};

// Generar checksum simple para verificación de integridad
export const generateChecksum = (data: any): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};