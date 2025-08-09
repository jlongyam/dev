// adapters/storage/IFileStorageAdapter.js
// This sould be in core/Interface folder
export class IFileStorageAdapter {
  async readFile(path) { throw new Error("Not implemented") }
  async writeFile(path, content) { throw new Error("Not implemented") }
  // ...other methods
}