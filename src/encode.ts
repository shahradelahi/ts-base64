import { B64_CHAR_SET } from './constants';
import type { Base64EncodeOptions, Base64String, Base64UrlString, NotBase64 } from './typings';

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
    const uint8Array = new TextEncoder().encode(value);

    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    result = btoa(binaryString);
  }
  // Fallback for other environments
  else {
    const utf8Bytes = new TextEncoder().encode(value);
    result = fromUint8Array(utf8Bytes, {
      omitPadding: options.omitPadding,
      urlSafe: options.urlSafe,
    });
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
export function fromUint8Array<
  SafeURL extends boolean,
  Result = SafeURL extends true ? Base64UrlString : Base64String,
>(value: Uint8Array, options: Base64EncodeOptions<SafeURL> = {}): Result {
  if (typeof value !== 'object' || value.constructor.name !== 'Uint8Array') {
    throw new TypeError('The value to convert must be a Uint8Array.');
  }

  let result: string;

  // Node.js environment
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
    let i = 0;
    const len = value.length;

    while (i < len) {
      const remainingBytes = len - i;

      const chr1 = value[i++];
      const chr2 = i < len ? value[i++] : 0;
      const chr3 = i < len ? value[i++] : 0;

      const enc1 = chr1 >> 2;
      const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      const enc3 = remainingBytes > 1 ? ((chr2 & 15) << 2) | (chr3 >> 6) : 64;
      const enc4 = remainingBytes > 2 ? chr3 & 63 : 64;

      res += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }
    result = res;
  }

  if (options.urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_');
  }

  if (options.omitPadding) {
    result = result.replace(/=/g, '');
  }

  return result as Result;
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
