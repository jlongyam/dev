// core/interfaces/INetworkAdapter.js

/**
 * Unified network interface for all platforms
 */
class INetworkAdapter {
  // HTTP Methods
  async get(url, options) { throw new Error('Not implemented') }
  async post(url, data, options) { throw new Error('Not implemented') }
  async put(url, data, options) { throw new Error('Not implemented') }
  async delete(url, options) { throw new Error('Not implemented') }

  // WebSocket Methods
  createWebSocket(url, protocols) { throw new Error('Not implemented') }

  // Advanced Features
  async uploadFile(url, filePath, options) { throw new Error('Not implemented') }
  async downloadFile(url, savePath, options) { throw new Error('Not implemented') }

  // Network Status
  getNetworkStatus() { throw new Error('Not implemented') }
  onNetworkStatusChange(callback) { throw new Error('Not implemented') }
}

export default INetworkAdapter;