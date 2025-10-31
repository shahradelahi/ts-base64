import { describe, expect, it } from 'vitest';

import { encode, fromUint8Array, toDataURL } from './encode';

describe('encode', () => {
  const text = 'Hello, world!';
  const encodedText = 'SGVsbG8sIHdvcmxkIQ==';

  it('should encode a string to Base64', () => {
    expect(encode(text)).toBe(encodedText);
  });

  it('should encode a string to URL-safe Base64', () => {
    const textWithSpecialChars = 'a+b/c=';
    const expected = 'YStiL2M9';
    expect(encode(textWithSpecialChars, { urlSafe: true, omitPadding: true })).toBe(expected);
  });

  it('should convert a Uint8Array to a Base64 string', () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    expect(fromUint8Array(uint8Array)).toBe(encodedText);
  });

  it('should convert a Uint8Array to a URL-safe Base64 string', () => {
    const uint8Array = new Uint8Array([97, 43, 98, 47, 99, 61]);
    const expected = 'YStiL2M9';
    expect(fromUint8Array(uint8Array, { urlSafe: true, omitPadding: true })).toBe(expected);
  });

  it('should encode without padding', () => {
    const text = 'Hello, world';
    const encoded = 'SGVsbG8sIHdvcmxk';
    expect(encode(text, { omitPadding: true })).toBe(encoded);
  });

  it('should encode to a Data URL', () => {
    const mimeType = 'text/plain';
    const dataURL = 'data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==';
    expect(toDataURL(text, mimeType)).toBe(dataURL);
  });

  it('should handle complex MIME types', () => {
    const complexMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const url = toDataURL(text, complexMimeType);
    expect(url.startsWith(`data:${complexMimeType};base64,`)).toBe(true);
  });
});
