// adapters/network/BrowserNetworkAdapter.js
import INetworkAdapter from '../../core/interfaces/INetworkAdapter.js';

export default class BrowserNetworkAdapter extends INetworkAdapter {
  constructor() {
    super();
    this._networkStatus = 'online';
    window.addEventListener('online', () => this._handleNetworkChange(true));
    window.addEventListener('offline', () => this._handleNetworkChange(false));
  }

  // HTTP Implementation
  async get(url, options = {}) {
    const response = await fetch(url, {
      method: 'GET',
      ...options
    });
    return this._processResponse(response);
  }

  async post(url, data, options = {}) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return this._processResponse(response);
  }

  // WebSocket Implementation
  createWebSocket(url, protocols = []) {
    return new WebSocket(url, protocols);
  }

  // File Transfer
  async uploadFile(url, fileBlob, options = {}) {
    const formData = new FormData();
    formData.append('file', fileBlob);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      ...options
    });
    return this._processResponse(response);
  }

  // Network Status
  getNetworkStatus() {
    return navigator.onLine ? 'online' : 'offline';
  }

  onNetworkStatusChange(callback) {
    this._networkChangeCallback = callback;
  }

  // Private Methods
  async _processResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  }

  _handleNetworkChange(isOnline) {
    this._networkStatus = isOnline ? 'online' : 'offline';
    if (this._networkChangeCallback) {
      this._networkChangeCallback(this._networkStatus);
    }
  }
}