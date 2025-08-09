# Platforms

[Dev](../../README.md) / [Platforms](./README.md)

Platforms implementations

- [Desktop](./desktop/README.md)
- [Mobile](./mobile/README.md)
- [Terminal](./terminal/README.md)
- [Server](./server/README.md)

## Example

```js
// core/platform.js
export function getNetworkAdapter() {
  if (typeof window !== 'undefined') {
    return new BrowserNetworkAdapter();
  }
  if (typeof process !== 'undefined') {
    return new NodeNetworkAdapter();
  }
  // ...other platform checks
}
```
