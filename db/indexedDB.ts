// Configuración y operaciones de IndexedDB
const DB_NAME = 'ArtificialLogikaDB';
const DB_VERSION = 1;
const STORE_NAME = 'content';

export interface ContentData {
  id: string;
  data: any;
  lastModified: Date;
  version: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Crear object store si no existe
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // Crear índices para búsquedas eficientes
          store.createIndex('lastModified', 'lastModified', { unique: false });
          store.createIndex('version', 'version', { unique: false });
        }
      };
    });
  }

  async saveContent(id: string, data: any): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const contentData: ContentData = {
        id,
        data,
        lastModified: new Date(),
        version: Date.now()
      };

      const request = store.put(contentData);

      request.onsuccess = () => {
        console.log(`Content saved successfully: ${id}`);
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving content:', request.error);
        reject(request.error);
      };
    });
  }

  async getContent(id: string): Promise<any | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => {
        console.error('Error getting content:', request.error);
        reject(request.error);
      };
    });
  }

  async getAllContent(): Promise<Record<string, any>> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result;
        const contentMap: Record<string, any> = {};
        
        results.forEach((item: ContentData) => {
          contentMap[item.id] = item.data;
        });
        
        resolve(contentMap);
      };

      request.onerror = () => {
        console.error('Error getting all content:', request.error);
        reject(request.error);
      };
    });
  }

  async deleteContent(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`Content deleted successfully: ${id}`);
        resolve();
      };

      request.onerror = () => {
        console.error('Error deleting content:', request.error);
        reject(request.error);
      };
    });
  }

  async clearAllContent(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All content cleared successfully');
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing content:', request.error);
        reject(request.error);
      };
    });
  }

  async exportData(): Promise<string> {
    const allContent = await this.getAllContent();
    return JSON.stringify(allContent, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Limpiar contenido existente
      await this.clearAllContent();
      
      // Importar nuevo contenido
      for (const [id, content] of Object.entries(data)) {
        await this.saveContent(id, content);
      }
      
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Error al importar datos: formato JSON inválido');
    }
  }

  async migrateFromLocalStorage(): Promise<void> {
    const localStorageData = localStorage.getItem('artificialLogika_content');
    
    if (localStorageData) {
      try {
        const data = JSON.parse(localStorageData);
        
        // Verificar si ya tenemos datos en IndexedDB
        const existingData = await this.getAllContent();
        const hasExistingData = Object.keys(existingData).length > 0;
        
        if (!hasExistingData) {
          console.log('Migrando datos desde localStorage a IndexedDB...');
          
          for (const [id, content] of Object.entries(data)) {
            await this.saveContent(id, content);
          }
          
          // Crear backup del localStorage antes de limpiarlo
          localStorage.setItem('artificialLogika_content_backup', localStorageData);
          localStorage.removeItem('artificialLogika_content');
          
          console.log('Migración completada exitosamente');
        }
      } catch (error) {
        console.error('Error durante la migración:', error);
      }
    }
  }

  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    lastModified: Date | null;
  }> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results: ContentData[] = request.result;
        let totalSize = 0;
        let lastModified: Date | null = null;

        results.forEach((item) => {
          totalSize += JSON.stringify(item.data).length;
          if (!lastModified || item.lastModified > lastModified) {
            lastModified = item.lastModified;
          }
        });

        resolve({
          totalEntries: results.length,
          totalSize,
          lastModified
        });
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

export const dbManager = new IndexedDBManager();