// adapters/network/ReactNativeNetworkAdapter.js
import INetworkAdapter from '../../core/interfaces/INetworkAdapter.js';
import { NetInfo } from '@react-native-community/netinfo';

export default class ReactNativeNetworkAdapter extends INetworkAdapter {
  constructor() {
    super();
    this._networkStatus = 'unknown';
    this._unsubscribe = NetInfo.addEventListener(state => {
      this._networkStatus = state.isConnected ? 'online' : 'offline';
      if (this._networkChangeCallback) {
        this._networkChangeCallback(this._networkStatus);
      }
    });
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
  async uploadFile(url, fileUri, options = {}) {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: options.mimeType || 'application/octet-stream',
      name: options.fileName || 'file'
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers
      },
      ...options
    });
    return this._processResponse(response);
  }

  // Network Status
  getNetworkStatus() {
    return this._networkStatus;
  }

  onNetworkStatusChange(callback) {
    this._networkChangeCallback = callback;
  }

  cleanup() {
    this._unsubscribe && this._unsubscribe();
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
}