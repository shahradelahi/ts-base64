import { describe, expect, it } from 'vitest';

import { Base64DecodeStream, Base64EncodeStream } from './stream';

describe('Streaming API', () => {
  it('should encode a stream of strings', async () => {
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

    expect(result).toBe('SGVsbG8sIHdvcmxkIQ==');
  });

  it('should decode a stream of strings', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('SGVsbG8');
        controller.enqueue('sIHdvcmxk');
        controller.enqueue('IQ==');
        controller.close();
      },
    });

    const decodeStream = new Base64DecodeStream();
    const decodedStream = stream.pipeThrough(decodeStream);

    const reader = decodedStream.getReader();
    let result = '';
    let done = false;

    while (!done) {
      const { value, done: d } = await reader.read();
      done = d;
      if (value) {
        result += value;
      }
    }

    expect(result).toBe('Hello, world!');
  });
});

describe('Streaming API with UTF-8 support', () => {
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
    it(`should encode a stream of "${decoded}" correctly`, async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(decoded);
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

      expect(result).toBe(encoded);
    });

    it(`should decode a stream of "${encoded}" correctly`, async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoded);
          controller.close();
        },
      });

      const decodeStream = new Base64DecodeStream();
      const decodedStream = stream.pipeThrough(decodeStream);

      const reader = decodedStream.getReader();
      let result = '';
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          result += value;
        }
      }

      expect(result).toBe(decoded);
    });
  }
});
