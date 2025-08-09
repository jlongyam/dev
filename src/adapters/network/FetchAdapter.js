// adapters/http/FetchAdapter.js
export class FetchHttpAdapter {
  async get(url) {
    const res = await fetch(url);
    return res.json();
  }

  async post(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return res.json();
  }
  // ...put, delete, etc.
}