import { describe, expect, it } from 'vitest';

import { decode } from './decode';
import { encode } from './encode';

describe('UTF-8 support', () => {
  const utf8Strings = {
    'Hello, world! 👋': 'SGVsbG8sIHdvcmxkISDwn5GL',
    '你好,世界!': '5L2g5aW9LOS4lueVjCE=',
    'こんにちは、世界！': '44GT44KT44Gr44Gh44Gv44CB5LiW55WM77yB',
    'Привет, мир!': '0J/RgNC40LLQtdGCLCDQvNC40YAh',
    '안녕하세요, 세계!': '7JWI64WV7ZWY7IS47JqULCDshLjqs4Qh',
    '👋🌍': '8J+Ri/CfjI0=',
    '€15\n': '4oKsMTUK',
    François: 'RnJhbsOnb2lz',
    Jörg: 'SsO2cmc=',
    José: 'Sm9zw6k=',
    Tran: 'VHJhbg==',
    Trần: 'VHLhuqdu',
    أبو: '2KPYqNmI',
  };

  for (const [decoded, encoded] of Object.entries(utf8Strings)) {
    it(`should encode "${decoded}" correctly`, () => {
      expect(encode(decoded)).toBe(encoded);
    });

    it(`should decode "${encoded}" correctly`, () => {
      expect(decode(encoded)).toBe(decoded);
    });
  }
});
