<h1 align="center">
  <sup>@se-oss/base64</sup>
  <br>
  <a href="https://github.com/shahradelahi/ts-base64/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/ts-base64/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@se-oss/base64"><img src="https://img.shields.io/npm/v/@se-oss/base64.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/@se-oss/base64"><img src="https://img.shields.io/bundlephobia/minzip/@se-oss/base64" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=@se-oss/base64"><img src="https://packagephobia.com/badge?p=@se-oss/base64" alt="Install Size"></a>
</h1>

_@se-oss/base64_ is a robust and high-performance Base64 library for TypeScript, providing a comprehensive set of tools for encoding and decoding with support for URL-safe strings, Uint8Array conversion, and a class-based API.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Performance](#-performance)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install @se-oss/base64
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install @se-oss/base64
```

**yarn**

```bash
yarn add @se-oss/base64
```

</details>

## 📖 Usage

### Basic Usage

Simple encoding and decoding of UTF-8 strings.

```ts
import { decode, encode } from '@se-oss/base64';

const encoded = encode('Hello, world!'); // 'SGVsbG8sIHdvcmxkIQ=='
const decoded = decode(encoded); // 'Hello, world!'
```

### URL-Safe Encoding

Easily handle Base64 for URLs by using the URL-safe alphabet.

```ts
import { decodeURL, encodeURL } from '@se-oss/base64';

const encoded = encodeURL('a+b/c='); // 'YStiL2M9'
const decoded = decodeURL(encoded);
```

### Uint8Array Support

Native support for `Uint8Array` conversion without intermediate string overhead where possible.

```ts
import { fromUint8Array, toUint8Array } from '@se-oss/base64';

const bytes = new Uint8Array([72, 101, 108, 108, 111]);
const encoded = fromUint8Array(bytes);
const decoded = toUint8Array(encoded);
```

### Streaming API

Handle large datasets efficiently using Web `TransformStream` to encode or decode data in chunks.

```ts
import { Base64EncodeStream } from '@se-oss/base64';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello');
    controller.enqueue(' World');
    controller.close();
  },
});

const encodedStream = stream.pipeThrough(new Base64EncodeStream());
```

### Prototype Extensions

Opt-in to extend native prototypes for a more fluent and convenient API.

```ts
import '@se-oss/base64/extend';

'Hello'.toBase64();
'SGVsbG8='.fromBase64();
new Uint8Array([72, 101]).toBase64();
```

### Validation

Verify if a string is a valid Base64 or URL-safe Base64 encoded string.

```ts
import { isValid, isValidURL } from '@se-oss/base64';

isValid('SGVsbG8='); // true
isValidURL('YStiL2M'); // true
```

### Data URL

Helper functions for generating and parsing Data URLs.

```ts
import { fromDataURL, toDataURL } from '@se-oss/base64';

const dataUrl = toDataURL('Hello', 'text/plain');
const { data, mimeType } = fromDataURL(dataUrl);
```

### Advanced Options

Omit padding characters for cleaner strings or specify URL-safety in generic functions.

```ts
import { encode } from '@se-oss/base64';

const unpadded = encode('Hello', { omitPadding: true }); // 'SGVsbG8'
```

## 🚀 Performance

The benchmarks are run against the native `btoa`/`atob` functions and the popular `js-base64` library.

| Function         | @se-oss/base64 (ops/sec) | js-base64 (ops/sec) | Native (ops/sec) |
| :--------------- | :----------------------- | :------------------ | :--------------- |
| `encode`         | **3,920.79**             | 3,521.89            | 2,139.68         |
| `decode`         | **3,267.53**             | 761.08              | 3,169.99         |
| `fromUint8Array` | 3,577.44                 | **3,821.32**        | -                |
| `toUint8Array`   | **3,961.72**             | 762.16              | -                |
| `toDataURL`      | **3,558.89**             | -                   | -                |
| `fromDataURL`    | **1,218.19**             | -                   | -                |

_Benchmark script: [`bench/index.bench.ts`](bench/index.bench.ts)_

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/base64).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-base64).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-base64/graphs/contributors).
