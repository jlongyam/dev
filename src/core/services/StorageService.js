// core/services/StorageService.js
class StorageService {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async get(key, defaultValue = null) {
    try {
      const value = await this.adapter.get(key);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      console.error(`StorageService.get failed for key ${key}:`, error);
      return defaultValue;
    }
  }

  async set(key, value) {
    try {
      await this.adapter.set(key, value);
    } catch (error) {
      console.error(`StorageService.set failed for key ${key}:`, error);
    }
  }

  async delete(key) {
    try {
      await this.adapter.delete(key);
    } catch (error) {
      console.error(`StorageService.delete failed for key ${key}:`, error);
    }
  }

  async clear() {
    try {
      await this.adapter.clear();
    } catch (error) {
      console.error('StorageService.clear failed:', error);
    }
  }
}

// Platform-specific adapters would implement these methods
class StorageAdapter {
  async get(key) { throw new Error('Not implemented'); }
  async set(key, value) { throw new Error('Not implemented'); }
  async delete(key) { throw new Error('Not implemented'); }
  async clear() { throw new Error('Not implemented'); }
}

export { StorageService, StorageAdapter };