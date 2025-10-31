import { describe, expect, it } from 'vitest';

import { decode, fromDataURL, isValid, isValidURL, toUint8Array } from './decode';
import { InvalidDataURLError } from './errors';
import type { Base64String, Base64UrlString } from './typings';

describe('decode', () => {
  const text = 'Hello, world!';
  const encodedText = 'SGVsbG8sIHdvcmxkIQ==';
  const urlSafeEncodedText = 'SGVsbG8sIHdvcmxkIQ';

  it('should decode a Base64 string', () => {
    expect(decode(encodedText as Base64String)).toBe(text);
  });

  it('should decode a URL-safe Base64 string', () => {
    const urlSafeEncoded = 'YStiL2M9';
    const expected = 'a+b/c=';
    expect(decode(urlSafeEncoded as Base64UrlString, { urlSafe: true })).toBe(expected);
  });

  it('should check if a string is valid Base64', () => {
    expect(isValid(encodedText)).toBe(true);
    expect(isValid('not base64')).toBe(false);
  });

  it('should check if a string is valid URL-safe Base64', () => {
    expect(isValidURL(urlSafeEncodedText)).toBe(true);
    expect(isValidURL('not+base64')).toBe(false);
  });

  it('should check if a string is valid URL-safe Base64 with isValid', () => {
    expect(isValid(urlSafeEncodedText, { urlSafe: true })).toBe(true);
    expect(isValid('not+base64', { urlSafe: true })).toBe(false);
  });

  it('should convert a Base64 string to a Uint8Array', () => {
    const expectedUint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    expect(toUint8Array(encodedText as Base64String)).toEqual(expectedUint8Array);
  });

  it('should convert a URL-safe Base64 string to a Uint8Array', () => {
    const urlSafeEncoded = 'YStiL2M9';
    const expectedUint8Array = new Uint8Array([97, 43, 98, 47, 99, 61]);
    expect(toUint8Array(urlSafeEncoded as Base64UrlString)).toEqual(expectedUint8Array);
  });

  it('should decode unpadded strings', () => {
    const text = 'Hello, world';
    const encoded = 'SGVsbG8sIHdvcmxk';
    expect(decode(encoded as Base64String)).toBe(text);
  });

  it('should decode from a Data URL', () => {
    const mimeType = 'text/plain';
    const dataURL = 'data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==';
    const { data, mimeType: extractedMimeType } = fromDataURL(dataURL);
    expect(data).toBe(text);
    expect(extractedMimeType).toBe(mimeType);
  });

  it('should throw an InvalidDataURLError for an invalid Data URL', () => {
    const invalidDataURL = 'not a data url';
    expect(() => fromDataURL(invalidDataURL)).toThrow(InvalidDataURLError);
  });
});
