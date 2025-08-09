// adapters/storage/CloudflareKVAdapter.js
export class CloudflareKVAdapter {
  constructor(kvNamespace) {
    this.kv = kvNamespace; // CF KV namespace binding
  }

  async get(key) {
    return await this.kv.get(key);
  }

  async set(key, value, options = {}) {
    await this.kv.put(key, value, {
      expiration: options.ttl, // TTL in seconds
      metadata: options.metadata
    });
  }

  async delete(key) {
    await this.kv.delete(key);
  }

  async list(options = {}) {
    const result = await this.kv.list(options);
    return result.keys.map(k => k.name);
  }
}