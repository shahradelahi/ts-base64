import { B64_LOOKUP, B64_REGEX, B64_URL_REGEX } from './constants';
import { InvalidBase64Error, InvalidDataURLError } from './errors';
import type {
  Base64DecodeOptions,
  Base64String,
  Base64UrlString,
  MaybeBase64,
  NotBase64,
} from './typings';

/**
 * Checks if a string is a valid Base64 encoded string.
 *
 * @param value The string to check.
 * @param options The options for decoding.
 * @returns `true` if the string is a valid Base64 encoded string, `false` otherwise.
 * @example
 * ```ts
 * import { isValid } from '@se-oss/base64';
 *
 * console.log(isValid('SGVsbG8sIHdvcmxkIQ==')); // true
 * console.log(isValid('not base64')); // false
 * ```
 */
export function isValid(
  value: MaybeBase64,
  options: Base64DecodeOptions = {}
): value is Base64String {
  if (typeof value !== 'string') {
    return false;
  }
  if (options.urlSafe) {
    return B64_URL_REGEX.test(value);
  }
  return B64_REGEX.test(value);
}

/**
 * Checks if a string is a valid URL-safe Base64 encoded string.
 *
 * @param value The string to check.
 * @returns `true` if the string is a valid URL-safe Base64 encoded string, `false` otherwise.
 * @example
 * ```ts
 * import { isValidURL } from '@se-oss/base64';
 *
 * console.log(isValidURL('P7_f')); // true
 * console.log(isValidURL('SGVsbG8sIHdvcmxkIQ==')); // false
 * ```
 */
export function isValidURL(value: MaybeBase64): value is Base64UrlString {
  if (typeof value !== 'string') {
    return false;
  }
  return B64_URL_REGEX.test(value);
}

const textDecoder = new TextDecoder();

/**
 * Decodes a Base64 encoded string.
 *
 * @param value The Base64 encoded string to decode.
 * @param options The options for decoding.
 * @returns The decoded string.
 * @throws {InvalidBase64Error} If the input is not a valid Base64 string.
 * @example
 * ```ts
 * import { decode } from '@se-oss/base64';
 *
 * const decoded = decode('SGVsbG8sIHdvcmxkIQ==');
 * console.log(decoded); // 'Hello, world!'
 * ```
 */
export function decode(value: MaybeBase64, options: Base64DecodeOptions = {}): NotBase64 {
  if (typeof value !== 'string') {
    throw new InvalidBase64Error('The value to decode must be a string.');
  }

  let base64: string = value;
  if (options.urlSafe) {
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  }

  while (base64.length % 4) {
    base64 += '=';
  }

  // Node.js environment
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  // Browser environment
  if (typeof TextDecoder !== 'undefined' && typeof atob !== 'undefined') {
    const binaryString = atob(base64);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return textDecoder.decode(uint8Array);
  }

  // Fallback for other environments
  const lookup = B64_LOOKUP;
  let result = '';
  let i = 0;

  const sanitizedValue = base64.replace(/[^A-Za-z0-9+/=]/g, '');

  while (i < sanitizedValue.length) {
    const enc1 = lookup[sanitizedValue.charAt(i++)];
    const enc2 = lookup[sanitizedValue.charAt(i++)];
    const enc3 = lookup[sanitizedValue.charAt(i++)];
    const enc4 = lookup[sanitizedValue.charAt(i++)];

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    result += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      result += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      result += String.fromCharCode(chr3);
    }
  }

  return result;
}

/**
 * Decodes a URL-safe Base64 encoded string.
 *
 * @param value The URL-safe Base64 encoded string to decode.
 * @returns The decoded string.
 * @example
 * ```ts
 * import { decodeURL } from '@se-oss/base64';
 *
 * const decoded = decodeURL('P7_f');
 * console.log(decoded); // '?\xbf\xff'
 * ```
 */
export function decodeURL(value: Base64UrlString): NotBase64 {
  return decode(value, { urlSafe: true });
}

/**
 * Converts a Base64 encoded string to a `Uint8Array`.
 *
 * @param value The Base64 encoded string to convert.
 * @param options The options for decoding.
 * @returns The `Uint8Array`.
 * @example
 * ```ts
 * import { toUint8Array } from '@se-oss/base64';
 *
 * const uint8 = toUint8Array('SGVsbG8sIHdvcmxkIQ==');
 * console.log(uint8); // Uint8Array(13) [ 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 ]
 * ```
 */
export function toUint8Array(value: MaybeBase64, options: Base64DecodeOptions = {}): Uint8Array {
  if (typeof value !== 'string') {
    throw new InvalidBase64Error('The value to decode must be a string.');
  }

  let base64: string = value;
  if (options.urlSafe) {
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  }

  // Node.js environment
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }

  // Browser environment
  if (typeof TextDecoder !== 'undefined' && typeof atob !== 'undefined') {
    const binaryString = atob(base64);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
  }

  while (base64.length % 4) {
    base64 += '=';
  }

  const lookup = B64_LOOKUP;
  const bytes = new Uint8Array(((base64.length * 3) / 4) | 0);
  let i = 0;
  let j = 0;

  const sanitizedValue = base64.replace(/[^A-Za-z0-9+/=]/g, '');

  while (i < sanitizedValue.length) {
    const enc1 = lookup[sanitizedValue.charAt(i++)];
    const enc2 = lookup[sanitizedValue.charAt(i++)];
    const enc3 = lookup[sanitizedValue.charAt(i++)];
    const enc4 = lookup[sanitizedValue.charAt(i++)];

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    bytes[j++] = chr1;

    if (enc3 !== 64) {
      bytes[j++] = chr2;
    }
    if (enc4 !== 64) {
      bytes[j++] = chr3;
    }
  }

  return bytes.slice(0, j);
}

/**
 * Decodes a Base64-encoded Data URL.
 *
 * @param dataURL The Data URL to decode.
 * @returns An object containing the decoded data and the MIME type.
 * @throws {InvalidDataURLError} If the input is not a valid Data URL.
 * @example
 * ```ts
 * import { fromDataURL } from '@se-oss/base64';
 *
 * const { data, mimeType } = fromDataURL('data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==');
 * console.log(data); // 'Hello, world!'
 * console.log(mimeType); // 'text/plain'
 * ```
 */
export function fromDataURL(dataURL: string): { data: NotBase64; mimeType: string } {
  const match = dataURL.match(/^data:(?<mime>[\w/\-+.]{1,100});base64,(?<data>.*)$/);

  if (!match?.groups) {
    throw new InvalidDataURLError('Invalid Data URL.');
  }

  const { mime, data } = match.groups;
  const decoded = decode(data as Base64String);

  return { data: decoded, mimeType: mime };
}
