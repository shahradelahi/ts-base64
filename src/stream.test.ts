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
