export interface SupabaseContent {
  id: string;
  user_id?: string;
  content_type: string;
  content_data: any;
  created_at: string;
  updated_at: string;
}

export interface DatabaseStatus {
  primary: string;
  supabase: boolean;
  indexeddb: boolean;
  provider: 'supabase' | 'indexeddb' | 'hybrid' | 'unknown';
}

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableSync: boolean;
  syncInterval: number;
}

export interface CustomBadge {
  id: string;
  text: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray' | 'primary';
}

export interface CustomService {
  id: string;
  name: string;
  description: string;
  sections: string[];
  features: string[];
  developmentPrice: string;
  infrastructurePrice: string;
  maintenancePrice: string;
  infrastructureDetails: string[];
  databaseType: 'none' | 'sqlite' | 'supabase';
  isStatic: boolean;
  isDynamic?: boolean;
  icon: string;
  customBadges?: CustomBadge[];
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  timeframe: string;
  description: string;
  outcomes: string[];
  icon: string;
  color: string;
  popular: boolean;
  cta: string;
  value: string;
  badge: string;
}

export interface PricingSettings {
  exchangeRate: string;
  headerTitle: string;
  headerSubtitle: string;
  headerDescription: string;
  headerHighlight: string;
  bottomSectionTitle: string;
  bottomSectionDescription: string;
  bottomSectionCTA: string;
  bottomSectionNote: string;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  badges: {
    sqliteText: string;
    supabaseText: string;
    noDatabaseText: string;
    hostingFreeText: string;
    dynamicText: string;
  };
}

export type DatabaseProvider = 'supabase' | 'indexeddb' | 'hybrid';

export interface DatabaseManagerInterface {
  init(): Promise<void>;
  saveContent(key: string, data: any): Promise<void>;
  getContent(key: string): Promise<any>;
  deleteContent(key: string): Promise<void>;
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<void>;
  clearAll(): Promise<void>;
  migrateFromLocalStorage(): Promise<void>;
  getProvider(): DatabaseProvider;
}