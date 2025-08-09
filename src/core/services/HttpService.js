// core/services/HttpService.js
class HttpService {
  constructor() {
    this.baseUrl = '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async get(url, options = {}) {
    return this._request('GET', url, null, options);
  }

  async post(url, body, options = {}) {
    return this._request('POST', url, body, options);
  }

  async put(url, body, options = {}) {
    return this._request('PUT', url, body, options);
  }

  async delete(url, options = {}) {
    return this._request('DELETE', url, null, options);
  }

  async _request(method, url, body, options) {
    const headers = { ...this.defaultHeaders, ...options.headers };
    const fullUrl = this.baseUrl + url;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error(`HttpService._request failed for ${method} ${url}:`, error);
      throw error;
    }
  }
}

export default HttpService;