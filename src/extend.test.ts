import { describe, expect, it } from 'vitest';

import './extend';

describe('prototype extensions', () => {
  const text = 'Hello, world!';
  const encodedText = 'SGVsbG8sIHdvcmxkIQ==';

  it('should extend String.prototype with toBase64', () => {
    expect(text.toBase64()).toBe(encodedText);
  });

  it('should extend String.prototype with fromBase64', () => {
    expect(encodedText.fromBase64()).toBe(text);
  });

  it('should extend String.prototype with toUint8Array', () => {
    const expectedUint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    expect(encodedText.toUint8Array()).toEqual(expectedUint8Array);
  });

  it('should extend Uint8Array.prototype with toBase64', () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    expect(uint8Array.toBase64()).toBe(encodedText);
  });
});
