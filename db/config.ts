import { DatabaseConfig } from './types';

// Define types for environment variables to ensure type safety
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly NODE_ENV?: string;
  readonly MODE?: string;
  readonly VITE_DEBUG_DB?: string;
  [key: string]: any;
}

// Safe access to import.meta with proper typing
const getImportMeta = (): { env?: ImportMetaEnv } => {
  try {
    // In some environments, import.meta might not be available or initialized
    if (typeof import.meta === 'undefined') {
      return {};
    }
    return (import.meta as any) || {};
  } catch (error) {
    return {};
  }
};

// Development helpers (moved up to be used in getEnvVar)
const isDevelopment = (): boolean => {
  try {
    const meta = getImportMeta();
    const value = meta.env?.NODE_ENV;
    // Default to development if NODE_ENV is not set or undefined
    return !value || value === 'development';
  } catch {
    return true; // Default to development if we can't determine
  }
};

const isDebugMode = (): boolean => {
  try {
    const meta = getImportMeta();
    return meta.env?.VITE_DEBUG_DB === 'true';
  } catch {
    return false; // Default to no debug
  }
};

// Safely get environment variables with Vercel compatibility
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // Get import.meta safely
    const meta = getImportMeta();
    
    // Check if env is available and has properties
    if (!meta.env || typeof meta.env !== 'object') {
      // Silent fallback - no console spam in normal usage
      return fallback;
    }
    
    // Get the value from environment variables
    const value = meta.env[key];
    
    // Debugging: Log status (only in debug mode)
    if (isDevelopment() && isDebugMode()) {
      console.log(`🔍 Environment variable ${key}:`, {
        value: value ? `Found (${value.substring(0, 20)}...)` : 'Not found',
        type: typeof value,
        metaEnvAvailable: !!meta.env,
        totalEnvVars: Object.keys(meta.env || {}).length
      });
    }
    
    // Return the actual value or fallback
    return value || fallback;
    
  } catch (error) {
    // Silent fallback in production, log only in debug mode
    if (isDevelopment() && isDebugMode()) {
      console.info(`🔧 Using local storage for ${key} (environment access error)`);
    }
    return fallback;
  }
};

// Initialize database configuration
export const databaseConfig: DatabaseConfig = {
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
  enableSync: true,
  syncInterval: 30000 // 30 seconds
};

export const isSupabaseConfigured = (): boolean => {
  try {
    const url = databaseConfig.supabaseUrl;
    const key = databaseConfig.supabaseAnonKey;
    
    // Validate URL format (should be a Supabase URL)
    const urlValid = url && url.startsWith('https://') && url.includes('.supabase.co');
    
    // Validate key format (JWT tokens are typically 50+ characters)
    const keyValid = key && key.length > 50 && key.includes('.');
    
    const configured = !!(urlValid && keyValid);
    
    // Debug logging (only in debug mode)
    if (isDevelopment() && isDebugMode()) {
      const meta = getImportMeta();
      console.log('🔧 Supabase Configuration Check:', {
        configured: configured,
        url: url ? `${url.substring(0, 30)}...` : 'NOT_FOUND',
        urlLength: url?.length || 0,
        urlValid: urlValid,
        key: key ? `${key.substring(0, 20)}...` : 'NOT_FOUND', 
        keyLength: key?.length || 0,
        keyValid: keyValid,
        metaEnvAvailable: !!meta.env,
        totalEnvVars: meta.env ? Object.keys(meta.env).length : 0
      });
    }
    
    return configured;
  } catch (error) {
    // Only warn in debug mode
    if (isDevelopment() && isDebugMode()) {
      console.warn('⚠️ Supabase configuration check failed:', error);
    }
    return false;
  }
};

export const getSupabaseConfig = () => {
  const url = databaseConfig.supabaseUrl;
  const anonKey = databaseConfig.supabaseAnonKey;
  
  if (!url || !anonKey) {
    return {
      available: false,
      url: '',
      anonKey: '',
      error: 'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    };
  }
  
  return {
    available: true,
    url,
    anonKey,
    error: null
  };
};

// Environment variables validation
export const validateEnvironment = (): { valid: boolean; missing: string[]; warnings: string[] } => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !getEnvVar(varName)
  );
  
  const warnings: string[] = [];
  
  if (missingVars.length > 0) {
    warnings.push(
      `📊 Local Storage Mode: All features available with IndexedDB\n` +
      `Cloud sync: Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel to enable`
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

// Log configuration status on import with friendly messaging
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
        '🟢 Artificial Lógika: Running with local storage (IndexedDB) - all features work perfectly!\n' + 
        '💡 To enable cloud sync, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.\n' +
        '🔧 Set VITE_DEBUG_DB=true for detailed environment info.'
      );
    } else {
      console.log('✅ Artificial Lógika: Cloud sync enabled with Supabase');
    }
  }
}