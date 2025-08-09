# Service

[Dev](../../../README.md) / [Core](../README.md) / [Service](./README.md)

Core services

- StorageService - Key-Value Store Abstraction
- HttpService - Client
- LoggerService
- ConfigService
- NetworkService - Wrapper for network adapter [NO]

## Example usage

```js
import { StorageService } from './core/services/StorageService.js';
import HttpService from './core/services/HttpService.js';
import LoggerService from './core/services/LoggerService.js';
import ConfigService from './core/services/ConfigService.js';

// Platform-specific storage adapter
class LocalStorageAdapter {
  async get(key) {
    return localStorage.getItem(key);
  }
  async set(key, value) {
    localStorage.setItem(key, value);
  }
  async delete(key) {
    localStorage.removeItem(key);
  }
  async clear() {
    localStorage.clear();
  }
}

// Initialize services
const config = new ConfigService();
const logger = new LoggerService({ logLevel: config.get('logging.level', 'debug') });
const storage = new StorageService(new LocalStorageAdapter());
const http = new HttpService();
http.baseUrl = config.get('api.baseUrl');

// Example usage
async function main() {
  try {
    logger.info('Application starting');
    
    // Load user preferences
    const userId = await storage.get('userId');
    if (userId) {
      logger.debug('Found existing user', { userId });
      const userData = await http.get(`/users/${userId}`);
      logger.info('User data loaded', { userData });
    } else {
      logger.info('No user found, starting fresh session');
    }
    
    logger.info('Application ready');
  } catch (error) {
    logger.error('Application failed to start', { error });
  }
}

main();
```

### Other example

Conjunction with storage/adapter

```js
// Service initialization
function createFileStorage() {
  if (process.env.STORAGE_TYPE === 's3') {
    return new S3FileStorageAdapter('my-bucket');
  }
  return new LocalFileStorageAdapter(); // Default fallback
}

const fileStorage = createFileStorage();

// Application code doesn't care about implementation
await fileStorage.writeFile('/data/config.json', Buffer.from('{}'));
```

## Example using KV CloudFlare

```js
// core/services/StorageService.js
class StorageService {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async getUser(userId) {
    const data = await this.adapter.get(`user:${userId}`);
    return data ? JSON.parse(data) : null;
  }

  // ... other methods
}

// Usage:
const storage = new StorageService(kvAdapter);
const user = await storage.getUser('123');
```