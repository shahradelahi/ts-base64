import { B64_CHAR_SET } from './constants';
import type { Base64EncodeOptions, Base64String, Base64UrlString, NotBase64 } from './typings';

const textEncoder = new TextEncoder();

/**
 * Encodes a string into a Base64 encoded string.
 *
 * @param value The string to encode.
 * @param options The options for encoding.
 * @returns The Base64 encoded string.
 * @throws {TypeError} If the value to encode is not a string.
 * @example
 * ```ts
 * import { encode } from '@se-oss/base64';
 *
 * const encoded = encode('Hello, world!');
 * console.log(encoded); // 'SGVsbG8sIHdvcmxkIQ=='
 * ```
 */
export function encode<
  SafeURL extends boolean,
  Result = SafeURL extends true ? Base64UrlString : Base64String,
>(value: NotBase64, options: Base64EncodeOptions<SafeURL> = {}): Result {
  if (typeof (value as unknown) !== 'string') {
    throw new TypeError('The value to encode must be a string.');
  }

  let result: string;

  // Node.js environment
  if (typeof Buffer !== 'undefined') {
    result = Buffer.from(value, 'utf-8').toString('base64');
  }
  // Browser environment
  else if (typeof TextEncoder !== 'undefined' && typeof btoa !== 'undefined') {
    const uint8Array = textEncoder.encode(value);

    let binaryString = '';
    const chunkSize = 4096;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binaryString += String.fromCharCode.apply(
        null,
        Array.from(uint8Array.subarray(i, i + chunkSize))
      );
    }
    result = btoa(binaryString);
  }
  // Fallback for other environments
  else {
    let res = '';
    const chars = B64_CHAR_SET;
    let i = 0;

    while (i < value.length) {
      const char1 = value.charCodeAt(i++);
      const char2 = value.charCodeAt(i++);
      const char3 = value.charCodeAt(i++);

      const b1 = char1 >> 2;
      const b2 = ((char1 & 3) << 4) | (char2 >> 4);
      let b3 = ((char2 & 15) << 2) | (char3 >> 6);
      let b4 = char3 & 63;

      if (isNaN(char2)) {
        b3 = b4 = 64;
      } else if (isNaN(char3)) {
        b4 = 64;
      }

      res += chars.charAt(b1) + chars.charAt(b2) + chars.charAt(b3) + chars.charAt(b4);
    }
    result = res;
  }

  if (options.urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_');
  }

  if (options.omitPadding) {
    result = result.replace(/=+$/, '');
  }

  return result as Result;
}

/**
 * Encodes a string into a URL-safe Base64 encoded string.
 *
 * @param value The string to encode.
 * @param options The options for encoding.
 * @returns The URL-safe Base64 encoded string.
 * @example
 * ```ts
 * import { encodeURL } from '@se-oss/base64';
 *
 * // The input contains characters that are not URL-safe in Base64
 * const encoded = encodeURL('?\xbf\xff');
 * console.log(encoded); // 'P7_f'
 * ```
 */
export function encodeURL(value: NotBase64, options: Base64EncodeOptions = {}): Base64UrlString {
  return encode(value, { ...options, urlSafe: true }) as Base64UrlString;
}

/**
 * Converts a `Uint8Array` to a Base64 encoded string.
 *
 * @param value The `Uint8Array` to convert.
 * @param options The options for encoding.
 * @returns The Base64 encoded string.
 * @throws {TypeError} If the value to convert is not a Uint8Array.
 * @example
 * ```ts
 * import { fromUint8Array } from '@se-oss/base64';
 *
 * const uint8 = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
 * const encoded = fromUint8Array(uint8);
 * console.log(encoded); // 'SGVsbG8sIHdvcmxkIQ=='
 * ```
 */
export function fromUint8Array(
  value: Uint8Array,
  options: Base64EncodeOptions = {}
): Base64String | Base64UrlString {
  if (typeof value !== 'object' || value.constructor.name !== 'Uint8Array') {
    throw new TypeError('The value to convert must be a Uint8Array.');
  }

  let result: string;

  if (typeof Buffer !== 'undefined') {
    result = Buffer.from(value).toString('base64');
  }
  // Browser environment
  else if (typeof btoa !== 'undefined') {
    let binaryString = '';
    const chunkSize = 4096;
    for (let i = 0; i < value.length; i += chunkSize) {
      binaryString += String.fromCharCode.apply(null, Array.from(value.subarray(i, i + chunkSize)));
    }
    result = btoa(binaryString);
  }
  // Fallback
  else {
    let res = '';
    const chars = B64_CHAR_SET;
    for (let i = 0; i < value.length; i += 3) {
      const byte1 = value[i];
      const byte2 = value[i + 1];
      const byte3 = value[i + 2];

      const b1 = byte1 >> 2;
      const b2 = ((byte1 & 3) << 4) | (byte2 >> 4);
      let b3 = ((byte2 & 15) << 2) | (byte3 >> 6);
      let b4 = byte3 & 63;

      if (isNaN(byte2)) {
        b3 = b4 = 64;
      } else if (isNaN(byte3)) {
        b4 = 64;
      }

      res += chars.charAt(b1) + chars.charAt(b2) + chars.charAt(b3) + chars.charAt(b4);
    }
    result = res;
  }

  if (options.urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_');
  }

  if (options.omitPadding) {
    result = result.replace(/=/g, '');
  }

  return result as Base64String | Base64UrlString;
}

/**
 * Encodes a string into a Base64-encoded Data URL.
 *
 * @param value The string to encode.
 * @param mimeType The MIME type of the data.
 * @param options The options for encoding.
 * @returns The Base64-encoded Data URL.
 * @example
 * ```ts
 * import { toDataURL } from '@se-oss/base64';
 *
 * const dataURL = toDataURL('Hello, world!', 'text/plain');
 * console.log(dataURL); // 'data:text/plain;base64,SGVsbG8sIHdvcmxkIQ=='
 * ```
 */
export function toDataURL(
  value: NotBase64,
  mimeType: string,
  options: Base64EncodeOptions = {}
): string {
  const encoded = encode(value, options);
  return `data:${mimeType};base64,${encoded}`;
}
