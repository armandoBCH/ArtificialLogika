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
    // For Vite applications, environment variables are available in import.meta.env
    const value = (import.meta as any)?.env?.[key];
    
    // Return the actual value or fallback
    const result = value || fallback;
    
    // Only log in development mode and for debugging
    if (isDevelopment() && isDebugMode() && key.includes('SUPABASE')) {
      if (result && result !== fallback) {
        console.log(`✅ Environment variable ${key} loaded from Vercel`);
      } else {
        console.log(`⚠️ Environment variable ${key} not found - using local storage only`);
      }
    }
    
    return result;
  } catch (error) {
    if (isDevelopment()) {
      console.warn(`Environment variable ${key} access error:`, error);
    }
    return fallback;
  }
};

export const databaseConfig: DatabaseConfig = {
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
  enableSync: true,
  syncInterval: 30000 // 30 seconds
};

export const isSupabaseConfigured = (): boolean => {
  const url = databaseConfig.supabaseUrl;
  const key = databaseConfig.supabaseAnonKey;
  
  // Validate URL format (should be a Supabase URL)
  const urlValid = url && url.startsWith('https://') && url.includes('.supabase.co');
  
  // Validate key format (JWT tokens are typically 100+ characters)
  const keyValid = key && key.length > 100 && key.includes('.');
  
  const configured = !!(urlValid && keyValid);
  
  // Only log in debug mode to avoid console spam
  if (isDevelopment() && isDebugMode()) {
    if (configured) {
      console.log('✅ Supabase configured correctly from Vercel environment variables');
    } else {
      console.log('⚠️ Supabase configuration status:', { 
        hasUrl: !!url, 
        hasKey: !!key,
        urlValid: !!urlValid,
        keyValid: !!keyValid,
        source: 'Vercel environment variables'
      });
    }
  }
  
  return configured;
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
      `📊 Database mode: IndexedDB only (local storage)\n` +
      `Missing Supabase variables: ${missingVars.join(', ')}\n` +
      `Cloud sync is disabled but the app works perfectly with local storage.\n` +
      `To enable cloud sync, add these variables to a .env file:\n` +
      `VITE_SUPABASE_URL=your_supabase_url\n` +
      `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
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
      console.log('✅ Database: Running with Supabase cloud sync enabled');
    }
  }
}