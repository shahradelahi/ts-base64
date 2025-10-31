import { describe, expect, it } from 'vitest';

import {
  atob,
  Base64,
  btoa,
  decode,
  encode,
  fromUint8Array,
  isValid,
  isValidURL,
  toUint8Array,
} from './index';
import type { Base64String, Base64UrlString } from './typings';

describe('Base64', () => {
  const text = 'Hello, world!';
  const encodedText = 'SGVsbG8sIHdvcmxkIQ==';
  const urlSafeEncodedText = 'SGVsbG8sIHdvcmxkIQ';

  it('should encode a string to Base64', () => {
    expect(encode(text)).toBe(encodedText);
    expect(Base64.encode(text)).toBe(encodedText);
  });

  it('should decode a Base64 string', () => {
    expect(decode(encodedText as Base64String)).toBe(text);
    expect(Base64.decode(encodedText as Base64String)).toBe(text);
  });

  it('should encode a string to URL-safe Base64', () => {
    const textWithSpecialChars = 'a+b/c=';
    const expected = 'YStiL2M9';
    expect(encode(textWithSpecialChars, { urlSafe: true, omitPadding: true })).toBe(expected);
    expect(Base64.encode(textWithSpecialChars, { urlSafe: true, omitPadding: true })).toBe(
      expected
    );
  });

  it('should decode a URL-safe Base64 string', () => {
    const urlSafeEncoded = 'YStiL2M9';
    const expected = 'a+b/c=';
    expect(decode(urlSafeEncoded as Base64UrlString, { urlSafe: true })).toBe(expected);
    expect(Base64.decode(urlSafeEncoded as Base64UrlString, { urlSafe: true })).toBe(expected);
  });

  it('should check if a string is valid Base64', () => {
    expect(isValid(encodedText)).toBe(true);
    expect(isValid('not base64')).toBe(false);
    expect(Base64.isValid(encodedText)).toBe(true);
    expect(Base64.isValid('not base64')).toBe(false);
  });

  it('should check if a string is valid URL-safe Base64', () => {
    expect(isValidURL(urlSafeEncodedText)).toBe(true);
    expect(isValidURL('not+base64')).toBe(false);
    expect(Base64.isValidURL(urlSafeEncodedText)).toBe(true);
    expect(Base64.isValidURL('not+base64')).toBe(false);
  });

  it('should convert a Uint8Array to a Base64 string', () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    expect(fromUint8Array(uint8Array)).toBe(encodedText);
    expect(Base64.fromUint8Array(uint8Array)).toBe(encodedText);
  });

  it('should convert a Base64 string to a Uint8Array', () => {
    const expectedUint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    expect(toUint8Array(encodedText as Base64String)).toEqual(expectedUint8Array);
    expect(Base64.toUint8Array(encodedText as Base64String)).toEqual(expectedUint8Array);
  });

  it('should polyfill btoa', () => {
    expect(btoa(text)).toBe(encodedText);
    expect(Base64.btoa(text)).toBe(encodedText);
  });

  it('should polyfill atob', () => {
    expect(atob(encodedText as Base64String)).toBe(text);
    expect(Base64.atob(encodedText as Base64String)).toBe(text);
  });

  it('should encode without padding', () => {
    const text = 'Hello, world';
    const encoded = 'SGVsbG8sIHdvcmxk';
    expect(encode(text, { omitPadding: true })).toBe(encoded);
    expect(Base64.encode(text, { omitPadding: true })).toBe(encoded);
  });

  it('should decode unpadded strings', () => {
    const text = 'Hello, world';
    const encoded = 'SGVsbG8sIHdvcmxk';
    expect(decode(encoded as Base64String)).toBe(text);
    expect(Base64.decode(encoded as Base64String)).toBe(text);
  });
});
