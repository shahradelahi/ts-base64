---
"@se-oss/base64": patch
---

Improved performance by centralizing environment checks and caching `TextEncoder`/`TextDecoder` instances. Optimized the browser encoding path to use chunking for better handling of large strings.
