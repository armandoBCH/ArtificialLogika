import { createClient } from '@supabase/supabase-js'

// Safely get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    return import.meta?.env?.[key] || fallback;
  } catch (error) {
    console.warn(`Environment variable ${key} not available:`, error);
    return fallback;
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', '');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', '');

// Only create client if both URL and key are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types for our database
export interface SupabaseContent {
  id: string
  user_id?: string
  content_type: string
  content_data: any
  created_at: string
  updated_at: string
}

// Database operations for Supabase
export class SupabaseManager {
  private isAvailable(): boolean {
    return !!(supabase && supabaseUrl && supabaseAnonKey);
  }

  async init(): Promise<boolean> {
    if (!this.isAvailable()) {
      console.log('🔒 Supabase not configured - environment variables missing');
      return false;
    }

    try {
      // Test connection
      const { data, error } = await supabase!.from('content').select('count').limit(1);
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Supabase connection failed:', error);
        return false;
      }
      console.log('✅ Supabase connected successfully');
      return true;
    } catch (error) {
      console.error('Supabase initialization failed:', error);
      return false;
    }
  }

  async saveContent(key: string, data: any): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Supabase is not available - check environment variables');
    }

    try {
      const { error } = await supabase!
        .from('content')
        .upsert({
          id: key,
          content_type: key,
          content_data: data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(`Failed to save to Supabase: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
  }

  async getContent(key: string): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('Supabase is not available - check environment variables');
    }

    try {
      const { data, error } = await supabase!
        .from('content')
        .select('content_data')
        .eq('id', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, return null
          return null;
        }
        throw new Error(`Failed to get from Supabase: ${error.message}`);
      }

      return data?.content_data || null;
    } catch (error) {
      console.error('Error getting from Supabase:', error);
      throw error;
    }
  }

  async deleteContent(key: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Supabase is not available - check environment variables');
    }

    try {
      const { error } = await supabase!
        .from('content')
        .delete()
        .eq('id', key);

      if (error) {
        throw new Error(`Failed to delete from Supabase: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
  }

  async exportData(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Supabase is not available - check environment variables');
    }

    try {
      const { data, error } = await supabase!
        .from('content')
        .select('*');

      if (error) {
        throw new Error(`Failed to export from Supabase: ${error.message}`);
      }

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting from Supabase:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Supabase is not available - check environment variables');
    }

    try {
      const data = JSON.parse(jsonData);
      
      if (Array.isArray(data)) {
        // Import multiple records
        const { error } = await supabase!
          .from('content')
          .upsert(data);

        if (error) {
          throw new Error(`Failed to import to Supabase: ${error.message}`);
        }
      } else {
        // Import single record (legacy format)
        await this.saveContent('editableContent', data);
      }
    } catch (error) {
      console.error('Error importing to Supabase:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Supabase is not available - check environment variables');
    }

    try {
      const { error } = await supabase!
        .from('content')
        .delete()
        .neq('id', 'never-match'); // Delete all records

      if (error) {
        throw new Error(`Failed to clear Supabase: ${error.message}`);
      }
    } catch (error) {
      console.error('Error clearing Supabase:', error);
      throw error;
    }
  }

  // Check if Supabase is properly configured
  isConfigured(): boolean {
    return this.isAvailable();
  }

  // Get configuration status
  getConfigStatus(): { configured: boolean; url: boolean; key: boolean } {
    return {
      configured: this.isAvailable(),
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    };
  }
}

export const supabaseManager = new SupabaseManager();