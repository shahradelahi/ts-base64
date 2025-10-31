import { decode, toUint8Array } from './decode';
import { encode, encodeURL, fromUint8Array } from './encode';
import type { Base64String, Base64UrlString } from './typings';

declare global {
  interface String {
    /**
     * Encodes the string to Base64.
     * @param urlSafe If `true`, encodes to a URL-safe Base64 string.
     * @returns The Base64 encoded string.
     */
    toBase64(urlSafe?: boolean): Base64String | Base64UrlString;
    /**
     * Decodes the Base64 string.
     * @returns The decoded string.
     */
    fromBase64(): string;
    /**
     * Converts the Base64 string to a Uint8Array.
     * @returns The Uint8Array.
     */
    toUint8Array(): Uint8Array;
  }

  interface Uint8Array {
    /**
     * Encodes the Uint8Array to a Base64 string.
     * @param urlSafe If `true`, encodes to a URL-safe Base64 string.
     * @returns The Base64 encoded string.
     */
    toBase64(urlSafe?: boolean): Base64String | Base64UrlString;
  }
}

if (!String.prototype.toBase64) {
  Object.defineProperty(String.prototype, 'toBase64', {
    value: function (urlSafe?: boolean): Base64String | Base64UrlString {
      if (urlSafe) {
        return encodeURL(this.toString(), { omitPadding: true });
      }
      return encode(this.toString());
    },
    writable: true,
    configurable: true,
  });
}

if (!String.prototype.fromBase64) {
  Object.defineProperty(String.prototype, 'fromBase64', {
    value: function (): string {
      return decode(this.toString() as Base64String);
    },
    writable: true,
    configurable: true,
  });
}

if (!String.prototype.toUint8Array) {
  Object.defineProperty(String.prototype, 'toUint8Array', {
    value: function (): Uint8Array {
      return toUint8Array(this.toString() as Base64String);
    },
    writable: true,
    configurable: true,
  });
}

if (!Uint8Array.prototype.toBase64) {
  Object.defineProperty(Uint8Array.prototype, 'toBase64', {
    value: function (urlSafe?: boolean): Base64String | Base64UrlString {
      return fromUint8Array(this, { urlSafe });
    },
    writable: true,
    configurable: true,
  });
}
