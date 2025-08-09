# Storage

[Dev](../../../README.md) / [Adapters](../README.md) / [Storage](./README.md)

Storage implementations

- Web Browser - LocalStorageAdapter, IndexedDBAdapter
- Mobile (React Native) - AsyncStorageAdapter
- Node.js/Server - FileStorageAdapter, RedisStorageAdapter
- Terminal Apps - JsonFileStorageAdapter

## Modules

- LocalStorageAdapter [NO]
- AsyncStorageAdapter [NO]
- FileStorageAdapter [NO]
- MemoryStorageAdapter [OK]

## Example

```js
// Service initialization with fallback logic
import { MemoryStorageAdapter } from './adapters/storage/MemoryStorageAdapter';
import { LocalStorageAdapter } from './adapters/storage/LocalStorageAdapter';

function getBestStorageAdapter() {
  try {
    // Try platform-specific adapter first
    return new LocalStorageAdapter();
  } catch (error) {
    console.warn('Falling back to memory storage');
    return new MemoryStorageAdapter();
  }
}

const storageService = new StorageService(getBestStorageAdapter());
```

Other, platform difference handler

```js
// In LocalFileStorageAdapter
async listFiles(dir) {
  return fs.readdir(dir); // Node.js
}

// In BrowserFileStorageAdapter 
async listFiles(dir) {
  return Object.keys(localStorage) // Browser fallback
}
``

## CloudFlare usage example

```js
## KV cloudflare example

```js
// Use directly when Cloudflare is the primary target
import { CloudflareKVAdapter } from './adapters/storage/CloudflareKVAdapter';

const kvAdapter = new CloudflareKVAdapter(env.MY_KV_NAMESPACE);
await kvAdapter.set('user:123', JSON.stringify(userData), { 
  ttl: 3600 // 1 hour expiration
});
```

### Special KV

A. Namespace Managemen

```js
// For multi-tenant apps
class MultiTenantKVAdapter {
  constructor(kvNamespace, tenantId) {
    this.kv = kvNamespace;
    this.prefix = `tenant_${tenantId}_`;
  }

  async get(key) {
    return this.kv.get(this.prefix + key);
  }
  // ... other methods
}
```

B. Atomic Operations

```js
// Cloudflare KV doesn't support transactions, so:
class KVWithLocks {
  constructor(kvNamespace) {
    this.kv = kvNamespace;
    this.locks = new Map();
  }

  async atomicUpdate(key, updateFn) {
    while (this.locks.has(key)) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    this.locks.set(key, true);
    try {
      const current = await this.get(key);
      const updated = await updateFn(current);
      await this.set(key, updated);
      return updated;
    } finally {
      this.locks.delete(key);
    }
  }
}
```

### KV Mocking examples

```js
// adapters/storage/MockKVAdapter.js
export class MockKVAdapter {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    return this.store.get(key);
  }

  async put(key, value) {
    this.store.set(key, value);
  }
  // ... implement other KV methods
}

// In your tests:
test('KV operations', async () => {
  const mockKV = new MockKVAdapter();
  const service = new StorageService(mockKV);
  
  await service.set('test', 'value');
  expect(await service.get('test')).toBe('value');
});
```

### Batching optimization

```js
class KVBatchWriter {
  constructor(kvNamespace, batchSize = 100) {
    this.kv = kvNamespace;
    this.batch = [];
    this.batchSize = batchSize;
  }

  async set(key, value) {
    this.batch.push({ key, value });
    if (this.batch.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush() {
    await Promise.all(
      this.batch.map(({ key, value }) => this.kv.put(key, value))
    );
    this.batch = [];
  }
}
```

Caching layer:

```js
class KVCachedAdapter {
  constructor(kvAdapter, cache = new Map()) {
    this.kv = kvAdapter;
    this.cache = cache;
  }

  async get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const value = await this.kv.get(key);
    this.cache.set(key, value);
    return value;
  }
}
```

Error handling

```js
class KVWithRetries {
  constructor(kvAdapter, maxRetries = 3) {
    this.kv = kvAdapter;
    this.maxRetries = maxRetries;
  }

  async get(key) {
    let lastError;
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await this.kv.get(key);
      } catch (error) {
        lastError = error;
        await new Promise(r => setTimeout(r, 100 * (i + 1)));
      }
    }
    throw lastError;
  }
}
```