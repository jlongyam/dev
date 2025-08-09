// adapters/storage/LocalFileStorageAdapter.js
import fs from 'fs/promises';
import { IFileStorageAdapter } from './IFileStorageAdapter';

export class LocalFileStorageAdapter extends IFileStorageAdapter {
  async readFile(path) {
    return fs.readFile(path);
  }
  
  async writeFile(path, content) {
    await fs.writeFile(path, content);
  }
  // ...implement other methods
}