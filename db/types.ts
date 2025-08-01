export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableSync: boolean;
  syncInterval: number;
}

export interface DBRecord {
  id: string;
  user_id?: string;
  content_type: string;
  content_data: any;
  created_at?: string;
  updated_at?: string;
}

export interface ContentData {
  [key: string]: any;
}

export interface DatabaseResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface SyncStatus {
  lastSync: Date;
  isOnline: boolean;
  pendingChanges: number;
} 