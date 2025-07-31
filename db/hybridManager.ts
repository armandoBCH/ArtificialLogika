import { dbManager as indexedDBManager } from './indexedDB'
import { supabaseManager } from './supabase'
import { validateEnvironment, isDebugMode } from './config'

export type DatabaseProvider = 'supabase' | 'indexeddb' | 'hybrid'

export interface DatabaseManagerInterface {
  init(): Promise<void>
  saveContent(key: string, data: any): Promise<void>
  getContent(key: string): Promise<any>
  deleteContent(key: string): Promise<void>
  exportData(): Promise<string>
  importData(jsonData: string): Promise<void>
  clearAll(): Promise<void>
  migrateFromLocalStorage(): Promise<void>
  getProvider(): DatabaseProvider
}

class HybridDatabaseManager implements DatabaseManagerInterface {
  private primaryProvider: 'supabase' | 'indexeddb' = 'indexeddb' // Default to safe option
  private supabaseAvailable = false
  private indexedDBAvailable = false
  private initializationComplete = false

  async init(): Promise<void> {
    if (this.initializationComplete) {
      return; // Already initialized
    }

    console.log('🔄 Initializing Hybrid Database Manager...')
    
    // Always initialize IndexedDB first as it's our fallback
    try {
      await indexedDBManager.init()
      this.indexedDBAvailable = true
      console.log('✅ IndexedDB initialized successfully')
    } catch (error) {
      console.error('❌ IndexedDB initialization failed:', error)
      this.indexedDBAvailable = false
    }

    // Try to initialize Supabase (optional)
    try {
      const envValidation = validateEnvironment()
      
      if (envValidation.valid) {
        this.supabaseAvailable = await supabaseManager.init()
        if (this.supabaseAvailable) {
          console.log('✅ Supabase initialized successfully')
          this.primaryProvider = 'supabase'
        } else {
          console.log('⚠️ Supabase connection failed, using IndexedDB')
        }
      } else {
        console.log('🔒 Supabase not configured, using IndexedDB only')
        if (isDebugMode()) {
          envValidation.warnings.forEach(warning => console.warn(warning))
        }
      }
    } catch (error) {
      console.warn('⚠️ Supabase initialization failed:', error)
      this.supabaseAvailable = false
    }

    // Ensure we have at least one working database
    if (!this.supabaseAvailable && !this.indexedDBAvailable) {
      throw new Error('❌ No database providers available. Cannot initialize application.')
    }

    // Set primary provider based on what's available
    if (!this.supabaseAvailable && this.indexedDBAvailable) {
      this.primaryProvider = 'indexeddb'
    }

    console.log(`📊 Primary database provider: ${this.primaryProvider}`)
    
    // Migrate from localStorage if needed
    try {
      await this.migrateFromLocalStorage()
    } catch (error) {
      console.warn('⚠️ Migration from localStorage failed:', error)
    }

    // Sync data if both providers are available
    if (this.supabaseAvailable && this.indexedDBAvailable) {
      try {
        await this.syncFromIndexedDBToSupabase()
      } catch (error) {
        console.warn('⚠️ Initial sync failed:', error)
      }
    }

    this.initializationComplete = true
    console.log('✅ Hybrid Database Manager initialized successfully')
  }

  private async syncFromIndexedDBToSupabase(): Promise<void> {
    try {
      console.log('🔄 Syncing data from IndexedDB to Supabase...')
      
      // Get content from IndexedDB
      const localContent = await indexedDBManager.getContent('editableContent')
      
      if (localContent) {
        // Check if Supabase has newer data
        const supabaseContent = await supabaseManager.getContent('editableContent')
        
        if (!supabaseContent) {
          // No data in Supabase, upload from IndexedDB
          await supabaseManager.saveContent('editableContent', localContent)
          console.log('📤 Synced data from IndexedDB to Supabase')
        } else {
          // Both have data, use the more recent one (you might want to add timestamps)
          console.log('📊 Both providers have data, using Supabase as source of truth')
        }
      }
    } catch (error) {
      console.warn('⚠️ Sync failed:', error)
    }
  }

  async saveContent(key: string, data: any): Promise<void> {
    const errors: Error[] = []

    // Always try to save to IndexedDB first (it's more reliable)
    if (this.indexedDBAvailable) {
      try {
        await indexedDBManager.saveContent(key, data)
        if (isDebugMode()) console.log('💾 Saved to IndexedDB')
      } catch (error) {
        console.error('Error saving to IndexedDB:', error)
        errors.push(error as Error)
      }
    }

    // Try to save to Supabase if available
    if (this.supabaseAvailable) {
      try {
        await supabaseManager.saveContent(key, data)
        if (isDebugMode()) console.log('💾 Saved to Supabase')
      } catch (error) {
        console.error('Error saving to Supabase:', error)
        errors.push(error as Error)
      }
    }

    // Only throw error if ALL save attempts failed
    if (errors.length > 0 && errors.length === this.getActiveProviderCount()) {
      throw new Error(`All save attempts failed: ${errors.map(e => e.message).join(', ')}`)
    }
  }

  async getContent(key: string): Promise<any> {
    // Try primary provider first
    try {
      if (this.primaryProvider === 'supabase' && this.supabaseAvailable) {
        const content = await supabaseManager.getContent(key)
        if (content !== null) {
          if (isDebugMode()) console.log('📖 Retrieved from Supabase')
          return content
        }
      } else if (this.indexedDBAvailable) {
        const content = await indexedDBManager.getContent(key)
        if (content !== null) {
          if (isDebugMode()) console.log('📖 Retrieved from IndexedDB')
          return content
        }
      }
    } catch (error) {
      console.error(`Error reading from ${this.primaryProvider}:`, error)
    }

    // Try fallback provider
    try {
      if (this.primaryProvider === 'supabase' && this.indexedDBAvailable) {
        const content = await indexedDBManager.getContent(key)
        if (content !== null) {
          if (isDebugMode()) console.log('📖 Fallback retrieved from IndexedDB')
          return content
        }
      } else if (this.primaryProvider === 'indexeddb' && this.supabaseAvailable) {
        const content = await supabaseManager.getContent(key)
        if (content !== null) {
          if (isDebugMode()) console.log('📖 Fallback retrieved from Supabase')
          return content
        }
      }
    } catch (error) {
      console.error('Fallback read also failed:', error)
    }

    return null
  }

  async deleteContent(key: string): Promise<void> {
    const errors: Error[] = []

    // Try to delete from all available providers
    if (this.supabaseAvailable) {
      try {
        await supabaseManager.deleteContent(key)
        if (isDebugMode()) console.log('🗑️ Deleted from Supabase')
      } catch (error) {
        console.error('Error deleting from Supabase:', error)
        errors.push(error as Error)
      }
    }

    if (this.indexedDBAvailable) {
      try {
        await indexedDBManager.deleteContent(key)
        if (isDebugMode()) console.log('🗑️ Deleted from IndexedDB')
      } catch (error) {
        console.error('Error deleting from IndexedDB:', error)
        errors.push(error as Error)
      }
    }

    if (errors.length > 0 && errors.length === this.getActiveProviderCount()) {
      throw new Error(`All delete attempts failed: ${errors.map(e => e.message).join(', ')}`)
    }
  }

  async exportData(): Promise<string> {
    // Try primary provider first
    try {
      if (this.primaryProvider === 'supabase' && this.supabaseAvailable) {
        return await supabaseManager.exportData()
      } else if (this.indexedDBAvailable) {
        return await indexedDBManager.exportData()
      }
    } catch (error) {
      console.error(`Error exporting from ${this.primaryProvider}:`, error)
    }

    // Try fallback provider
    try {
      if (this.primaryProvider === 'supabase' && this.indexedDBAvailable) {
        return await indexedDBManager.exportData()
      } else if (this.primaryProvider === 'indexeddb' && this.supabaseAvailable) {
        return await supabaseManager.exportData()
      }
    } catch (error) {
      console.error('Fallback export also failed:', error)
    }

    throw new Error('Export failed from all providers')
  }

  async importData(jsonData: string): Promise<void> {
    const errors: Error[] = []

    // Try to import to all available providers
    if (this.supabaseAvailable) {
      try {
        await supabaseManager.importData(jsonData)
        if (isDebugMode()) console.log('📥 Imported to Supabase')
      } catch (error) {
        console.error('Error importing to Supabase:', error)
        errors.push(error as Error)
      }
    }

    if (this.indexedDBAvailable) {
      try {
        await indexedDBManager.importData(jsonData)
        if (isDebugMode()) console.log('📥 Imported to IndexedDB')
      } catch (error) {
        console.error('Error importing to IndexedDB:', error)
        errors.push(error as Error)
      }
    }

    if (errors.length > 0 && errors.length === this.getActiveProviderCount()) {
      throw new Error(`All import attempts failed: ${errors.map(e => e.message).join(', ')}`)
    }
  }

  async clearAll(): Promise<void> {
    const errors: Error[] = []

    // Try to clear all available providers
    if (this.supabaseAvailable) {
      try {
        await supabaseManager.clearAll()
        if (isDebugMode()) console.log('🧹 Cleared Supabase')
      } catch (error) {
        console.error('Error clearing Supabase:', error)
        errors.push(error as Error)
      }
    }

    if (this.indexedDBAvailable) {
      try {
        await indexedDBManager.clearAllContent()
        if (isDebugMode()) console.log('🧹 Cleared IndexedDB')
      } catch (error) {
        console.error('Error clearing IndexedDB:', error)
        errors.push(error as Error)
      }
    }

    if (errors.length > 0 && errors.length === this.getActiveProviderCount()) {
      throw new Error(`All clear attempts failed: ${errors.map(e => e.message).join(', ')}`)
    }
  }

  async migrateFromLocalStorage(): Promise<void> {
    // Delegate to IndexedDB manager since it already has this functionality
    if (this.indexedDBAvailable) {
      try {
        await indexedDBManager.migrateFromLocalStorage()
      } catch (error) {
        console.warn('Migration from localStorage failed:', error)
      }
    }
  }

  getProvider(): DatabaseProvider {
    if (this.supabaseAvailable && this.indexedDBAvailable) {
      return 'hybrid'
    } else if (this.supabaseAvailable) {
      return 'supabase'
    } else if (this.indexedDBAvailable) {
      return 'indexeddb'
    }
    throw new Error('No database providers available')
  }

  // Helper methods
  private getActiveProviderCount(): number {
    return (this.supabaseAvailable ? 1 : 0) + (this.indexedDBAvailable ? 1 : 0)
  }

  // Additional utility methods
  getStatus(): { 
    primary: string, 
    supabase: boolean, 
    indexeddb: boolean,
    provider: DatabaseProvider,
    initialized: boolean
  } {
    return {
      primary: this.primaryProvider,
      supabase: this.supabaseAvailable,
      indexeddb: this.indexedDBAvailable,
      provider: this.getProvider(),
      initialized: this.initializationComplete
    }
  }

  async forceSyncToSupabase(): Promise<void> {
    if (!this.supabaseAvailable || !this.indexedDBAvailable) {
      throw new Error('Both providers must be available for sync')
    }

    const content = await indexedDBManager.getContent('editableContent')
    if (content) {
      await supabaseManager.saveContent('editableContent', content)
      console.log('🔄 Force synced to Supabase')
    }
  }

  async forceSyncFromSupabase(): Promise<void> {
    if (!this.supabaseAvailable || !this.indexedDBAvailable) {
      throw new Error('Both providers must be available for sync')
    }

    const content = await supabaseManager.getContent('editableContent')
    if (content) {
      await indexedDBManager.saveContent('editableContent', content)
      console.log('🔄 Force synced from Supabase')
    }
  }

  // Check if the manager is ready to use
  isReady(): boolean {
    return this.initializationComplete && (this.supabaseAvailable || this.indexedDBAvailable)
  }
}

export const hybridManager = new HybridDatabaseManager()

// Export as default manager for backward compatibility
export { hybridManager as dbManager }