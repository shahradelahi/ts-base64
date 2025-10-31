# @se-oss/base64

[![CI](https://github.com/shahradelahi/ts-base64/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/shahradelahi/ts-base64/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/base64.svg)](https://www.npmjs.com/package/@se-oss/base64)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@se-oss/base64)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/base64)](https://packagephobia.com/result?p=@se-oss/base64)

`@se-oss/base64` is a library for Base64 for TypeScript, and it provides a comprehensive set of tools for Base64 encoding and decoding, with support for URL-safe encoding, Uint8Array conversion, and a class-based API.

---

- [Installation](#-installation)
- [Usage](#-usage)
  - [Functions](#functions)
  - [Class](#class)
  - [Streaming API](#streaming-api)
  - [Prototype Extensions](#prototype-extensions)
- [Advanced Configuration](#advanced-configuration)
  - [Omitting Padding](#omitting-padding)
- [Error Handling](#error-handling)
- [Performance](#-performance)
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

You can use the library as a collection of functions or as a class.

### Functions

```typescript
import {
  decode,
  decodeURL,
  encode,
  encodeURL,
  fromUint8Array,
  isValid,
  toUint8Array,
} from '@se-oss/base64';

const text = 'Hello, world!';

// Encode and decode
const encoded = encode(text); // 'SGVsbG8sIHdvcmxkIQ=='
const decoded = decode(encoded); // 'Hello, world!'

// URL-safe encode and decode
const urlSafeEncoded = encodeURL(text); // 'SGVsbG8sIHdvcmxkIQ'
const urlSafeDecoded = decodeURL(urlSafeEncoded); // 'Hello, world!'

// Check for valid Base64
isValid(encoded); // true
isValid('not base64'); // false

// Work with Uint8Arrays
const uint8Array = new Uint8Array([
  72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
]);
const encodedFromUint8Array = fromUint8Array(uint8Array); // 'SGVsbG8sIHdvcmxkIQ=='
const decodedToUint8Array = toUint8Array(encodedFromUint8Array); // Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33])
```

### Class

```typescript
import { Base64 } from '@se-oss/base64';

const text = 'Hello, world!';

// Encode and decode
const encoded = Base64.encode(text); // 'SGVsbG8sIHdvcmxkIQ=='
const decoded = Base64.decode(encoded); // 'Hello, world!'

// URL-safe encode and decode
const urlSafeEncoded = Base64.encodeURL(text); // 'SGVsbG8sIHdvcmxkIQ'
const urlSafeDecoded = Base64.decodeURL(urlSafeEncoded); // 'Hello, world!'

// Check for valid Base64
Base64.isValid(encoded); // true
Base64.isValid('not base64'); // false

// Work with Uint8Arrays
const uint8Array = new Uint8Array([
  72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
]);
const encodedFromUint8Array = Base64.fromUint8Array(uint8Array); // 'SGVsbG8sIHdvcmxkIQ=='
const decodedToUint8Array = Base64.toUint8Array(encodedFromUint8Array); // Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33])
```

### Streaming API

The library provides a streaming API for encoding and decoding large data without high memory consumption.

```typescript
import { Base64DecodeStream, Base64EncodeStream } from '@se-oss/base64';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello');
    controller.enqueue(', ');
    controller.enqueue('world!');
    controller.close();
  },
});

const encodeStream = new Base64EncodeStream();
const encodedStream = stream.pipeThrough(encodeStream);

const reader = encodedStream.getReader();
let result = '';
let done = false;

while (!done) {
  const { value, done: d } = await reader.read();
  done = d;
  if (value) {
    result += value;
  }
}

console.log(result); // 'SGVsbG8sIHdvcmxkIQ=='
```

### Prototype Extensions

You can opt-in to prototype extensions to add `toBase64`, `fromBase64`, and `toUint8Array` methods to `String.prototype` and `Uint8Array.prototype`.

```typescript
import '@se-oss/base64/extend';

const text = 'Hello, world!';
const encodedText = 'SGVsbG8sIHdvcmxkIQ==';

// String extensions
text.toBase64(); // 'SGVsbG8sIHdvcmxkIQ=='
encodedText.fromBase64(); // 'Hello, world!'
encodedText.toUint8Array(); // Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33])

// Uint8Array extension
const uint8Array = new Uint8Array([
  72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
]);
uint8Array.toBase64(); // 'SGVsbG8sIHdvcmxkIQ=='
```

## Advanced Configuration

### Omitting Padding

You can omit the padding characters (`=`) from the encoded string by passing an options object to the `encode` function.

```typescript
import { encode } from '@se-oss/base64';

const text = 'Hello, world';
const encoded = encode(text, { omitPadding: true }); // 'SGVsbG8sIHdvcmxk'
```

The `decode` function can handle both padded and unpadded strings.

## 🚀 Performance

The benchmarks are run against the native `btoa`/`atob` functions and the popular `js-base64` library.

| Function         | @se-oss/base64 (ops/sec) | js-base64 (ops/sec) | Native (ops/sec) |
| :--------------- | :----------------------- | :------------------ | :--------------- |
| `encode`         | 1,567.04                 | 1,547.28            | **1,985.42**     |
| `decode`         | 2,303.86                 | 656.18              | **2,965.57**     |
| `fromUint8Array` | **3,741.40**             | 3,476.93            | -                |
| `toUint8Array`   | **3,941.51**             | 763.89              | -                |
| `toDataURL`      | **1,580.90**             | -                   | -                |
| `fromDataURL`    | **899.29**               | -                   | -                |

_Benchmark script: [`src/index.bench.ts`](src/index.bench.ts)_

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-base64)

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-base64/graphs/contributors).
