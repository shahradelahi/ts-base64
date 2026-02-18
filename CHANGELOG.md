# @se-oss/base64

## 1.0.3

### Patch Changes

- 6bd938c: Moved `src/index.bench.ts` to a new `bench/` directory, added its own `package.json` and `tsconfig.json`, and updated references.
- d2be4d0: Improved performance by centralizing environment checks and caching `TextEncoder`/`TextDecoder` instances. Optimized the browser encoding path to use chunking for better handling of large strings.
