import { DatabaseConfig } from './types';

// Safely get environment variables
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    return (import.meta as any)?.env?.[key] || fallback;
  } catch (error) {
    console.warn(`Environment variable ${key} not available, using fallback`);
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
  return !!(databaseConfig.supabaseUrl && databaseConfig.supabaseAnonKey);
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

// Development helpers
export const isDevelopment = (): boolean => {
  try {
    return getEnvVar('NODE_ENV', 'development') === 'development' || 
           getEnvVar('VITE_DEV_MODE', 'false') === 'true';
  } catch {
    return true; // Default to development if we can't determine
  }
};

export const isDebugMode = (): boolean => {
  try {
    return getEnvVar('VITE_DEBUG_DB', 'false') === 'true';
  } catch {
    return false;
  }
};

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