---
name: gateway-timeout-fallback
description: Wrapper skill to handle LLM API requests with configurable timeouts and automatic fallback model switching when the primary model hangs.
---

# Gateway Timeout Fallback

This skill provides a robust wrapper around LLM fetch requests. If the primary model request hangs and exceeds the configured timeout, it will automatically abort the request and retry using a fallback model.

## Usage

```javascript
const { fetchWithFallback } = require('./skills/gateway-timeout-fallback');

// Example usage:
const response = await fetchWithFallback(
  primaryRequestFunction,
  fallbackRequestFunction,
  { timeoutMs: 10000 }
);
```