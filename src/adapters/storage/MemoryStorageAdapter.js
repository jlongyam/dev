// adapters/storage/MemoryStorageAdapter.js
export class MemoryStorageAdapter {
  constructor() {
    this._store = new Map(); // Using Map for better performance
  }

  async get(key) {
    return this._store.get(key);
  }

  async set(key, value) {
    this._store.set(key, value);
  }

  async delete(key) {
    return this._store.delete(key);
  }

  async clear() {
    this._store.clear();
  }

  async keys() {
    return [...this._store.keys()];
  }

  async has(key) {
    return this._store.has(key);
  }
}