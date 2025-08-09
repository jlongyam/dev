// adapters/network/NodeNetworkAdapter.js
import INetworkAdapter from '../../core/interfaces/INetworkAdapter.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

export default class NodeNetworkAdapter extends INetworkAdapter {
  constructor() {
    super();
    this._isOnline = true;
  }

  // HTTP Implementation
  async get(url, options = {}) {
    return this._httpRequest(url, 'GET', null, options);
  }

  async post(url, data, options = {}) {
    return this._httpRequest(url, 'POST', data, options);
  }

  // WebSocket Implementation
  createWebSocket(url, protocols = []) {
    return new WebSocket(url, protocols);
  }

  // File Transfer
  async uploadFile(url, filePath, options = {}) {
    const fileStream = fs.createReadStream(filePath);
    return this._httpRequest(url, 'POST', fileStream, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/octet-stream'
      }
    });
  }

  async downloadFile(url, savePath, options = {}) {
    const fileStream = fs.createWriteStream(savePath);
    return new Promise((resolve, reject) => {
      this._getHttpModule(url).get(url, (response) => {
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(savePath);
        });
      }).on('error', reject);
    });
  }

  // Network Status (simplified for Node)
  getNetworkStatus() {
    return this._isOnline ? 'online' : 'offline';
  }

  // Private Methods
  async _httpRequest(url, method, data, options = {}) {
    return new Promise((resolve, reject) => {
      const req = this._getHttpModule(url).request(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      }, (res) => {
        let responseData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP error! status: ${res.statusCode}`));
          } else {
            try {
              resolve(JSON.parse(responseData));
            } catch {
              resolve(responseData);
            }
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        if (typeof data.pipe === 'function') {
          data.pipe(req);
        } else {
          req.write(JSON.stringify(data));
          req.end();
        }
      } else {
        req.end();
      }
    });
  }

  _getHttpModule(url) {
    return url.startsWith('https://') ? https : http;
  }
}