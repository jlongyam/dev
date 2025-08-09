# Network

[Dev](../../../README.md) / [Adapters](../README.md) / [Network](./README.md)

## Network implementations

Protocols:

- WebSockets
- TCP/UDP (for terminals/servers)
- Bluetooth (for mobile)



## HTTP implementations

HTTP/HTTPS protocol implementations - handles requests.

Implements methods:

- `get()`,
- `post()`,
- `put()`,
- `delete()`

Implementations:

- Browser: `fetch()` or XMLHttpRequest
- Node.js: `http`/`https` modules
- React Native: `Fetch` API or `Axios`

## Modules:

- FetchAdapter - Browser [OK] (optional)
- BrowserNetworkAdapter - fetch + WebSocket [OK]
- NodeNetworkAdapter - node http + ws [OK]
- MobileNetworkAdapter - RN Networking + sockets [NO]

## Usage

```js
// In your application code
import BrowserNetworkAdapter from './adapters/network/BrowserNetworkAdapter';
// or import NodeNetworkAdapter from './adapters/network/NodeNetworkAdapter';
// or import ReactNativeNetworkAdapter from './adapters/network/ReactNativeNetworkAdapter';

const network = new BrowserNetworkAdapter();

// HTTP Example
const users = await network.get('https://api.example.com/users');

// WebSocket Example
const socket = network.createWebSocket('wss://api.example.com/realtime');
socket.onmessage = (event) => {
  console.log('Message:', event.data);
};

// Network Status
console.log('Current status:', network.getNetworkStatus());
network.onNetworkStatusChange((status) => {
  console.log('Network status changed:', status);
});
```