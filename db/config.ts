import { DatabaseConfig } from './types';

// Development helpers (moved up to be used in getEnvVar)
const isDevelopment = (): boolean => {
  try {
    const value = (import.meta as any)?.env?.NODE_ENV;
    return value === 'development' || value === undefined;
  } catch {
    return true; // Default to development if we can't determine
  }
};

const isDebugMode = (): boolean => {
  try {
    return (import.meta as any)?.env?.VITE_DEBUG_DB === 'true';
  } catch {
    return false;
  }
};

// Safely get environment variables with Vercel compatibility
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // In Vite, environment variables are available in import.meta.env
    // This should work both in development and production with Vercel
    const value = import.meta.env[key];
    
    // Debugging: Always log what we're getting (temporarily for diagnosis)
    console.log(`🔍 Checking environment variable ${key}:`, {
      value: value ? `Found (${value.substring(0, 20)}...)` : 'Not found',
      type: typeof value,
      allEnvKeys: Object.keys(import.meta.env).filter(k => k.includes('TURSO')),
      environment: import.meta.env.NODE_ENV || 'unknown'
    });
    
    // Return the actual value or fallback
    const result = value || fallback;
    
    return result;
  } catch (error) {
    console.error(`❌ Environment variable ${key} access error:`, error);
    return fallback;
  }
};

export const databaseConfig: DatabaseConfig = {
  tursoUrl: getEnvVar('VITE_TURSO_DATABASE_URL', ''),
  tursoToken: getEnvVar('VITE_TURSO_AUTH_TOKEN', ''),
  enableSync: true,
  syncInterval: 30000 // 30 seconds
};

export const isTursoConfigured = (): boolean => {
  const url = databaseConfig.tursoUrl;
  const token = databaseConfig.tursoToken;
  
  // Validate URL format (should be a Turso URL)
  const urlValid = url && url.startsWith('libsql://');
  
  // Validate token format (Turso tokens are typically 50+ characters)
  const tokenValid = token && token.length > 30;
  
  const configured = !!(urlValid && tokenValid);
  
  // Always log for now (for debugging the Vercel issue)
  console.log('🔧 Turso Configuration Check:', {
    configured: configured,
    url: url ? `${url.substring(0, 30)}...` : 'NOT_FOUND',
    urlLength: url?.length || 0,
    urlValid: urlValid,
    token: token ? `${token.substring(0, 20)}...` : 'NOT_FOUND', 
    tokenLength: token?.length || 0,
    tokenValid: tokenValid,
    allAvailableEnvVars: Object.keys(import.meta.env),
    platform: 'Vercel Build'
  });
  
  return configured;
};

export const getTursoConfig = () => {
  const url = databaseConfig.tursoUrl;
  const token = databaseConfig.tursoToken;
  
  if (!url || !token) {
    return {
      available: false,
      url: '',
      token: '',
      error: 'Turso configuration is missing. Please set VITE_TURSO_DATABASE_URL and VITE_TURSO_AUTH_TOKEN environment variables.'
    };
  }
  
  return {
    available: true,
    url,
    token,
    error: null
  };
};

// Environment variables validation
export const validateEnvironment = (): { valid: boolean; missing: string[]; warnings: string[] } => {
  const requiredEnvVars = [
    'VITE_TURSO_DATABASE_URL',
    'VITE_TURSO_AUTH_TOKEN'
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !getEnvVar(varName)
  );
  
  const warnings: string[] = [];
  
  if (missingVars.length > 0) {
    warnings.push(
      `📊 Database mode: IndexedDB only (local storage)\n` +
      `Missing Turso variables: ${missingVars.join(', ')}\n` +
      `Cloud sync is disabled but the app works perfectly with local storage.\n` +
      `To enable cloud sync, add these variables to a .env file:\n` +
      `VITE_TURSO_DATABASE_URL=your_turso_url\n` +
      `VITE_TURSO_AUTH_TOKEN=your_turso_token`
    );
  }
  
  return {
    valid: missingVars.length === 0,
    missing: missingVars,
    warnings
  };
};

// Database connection settings
export const connectionSettings = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
  fallbackToLocal: true
};

// Development helpers (exported for external use)
export { isDevelopment, isDebugMode };

// Log configuration status on import with more friendly messaging
if (isDevelopment()) {
  const validation = validateEnvironment();
  
  if (isDebugMode()) {
    // In debug mode, show full details
    if (!validation.valid) {
      validation.warnings.forEach(warning => console.info(warning));
    } else {
      console.log('✅ Environment variables configured correctly');
    }
  } else {
    // In normal development mode, show a brief, positive message
    if (!validation.valid) {
      console.info(
        '📊 Database: Running with IndexedDB (local storage) - ' + 
        'all features available. Set VITE_DEBUG_DB=true for detailed info.'
      );
    } else {
      console.log('✅ Database: Running with Turso cloud sync enabled');
    }
  }
}