import { decode } from './decode';
import { fromUint8Array } from './encode';
import type { Base64String, TransformStream } from './typings';

/**
 * A TransformStream that encodes a stream of strings or Uint8Arrays into Base64.
 * @example
 * ```ts
 * import { Base64EncodeStream } from '@se-oss/base64';
 *
 * const stream = new ReadableStream({
 *   start(controller) {
 *     controller.enqueue('Hello');
 *     controller.enqueue(', ');
 *     controller.enqueue('world!');
 *     controller.close();
 *   },
 * });
 *
 * const encodeStream = new Base64EncodeStream();
 * const encodedStream = stream.pipeThrough(encodeStream);
 *
 * const reader = encodedStream.getReader();
 * let result = '';
 * let done = false;
 *
 * while (!done) {
 *   const { value, done: d } = await reader.read();
 *   done = d;
 *   if (value) {
 *     result += value;
 *   }
 * }
 *
 * console.log(result); // 'SGVsbG8sIHdvcmxkIQ=='
 * ```
 */
export class Base64EncodeStream implements TransformStream<string | Uint8Array, Base64String> {
  public readonly readable: ReadableStream<Base64String>;
  public readonly writable: WritableStream<string | Uint8Array>;
  private buffer = new Uint8Array(0);

  constructor() {
    const transformer = {
      transform: (
        chunk: string | Uint8Array,
        controller: TransformStreamDefaultController<Base64String>
      ) => {
        const chunkBuffer = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;

        const combinedBuffer = new Uint8Array(this.buffer.length + chunkBuffer.length);
        combinedBuffer.set(this.buffer);
        combinedBuffer.set(chunkBuffer, this.buffer.length);
        this.buffer = combinedBuffer;

        const remaining = this.buffer.length % 3;
        const toProcess = this.buffer.subarray(0, this.buffer.length - remaining);
        this.buffer = this.buffer.subarray(this.buffer.length - remaining);

        if (toProcess.length > 0) {
          controller.enqueue(fromUint8Array(toProcess));
        }
      },
      flush: (controller: TransformStreamDefaultController<Base64String>) => {
        if (this.buffer.length > 0) {
          controller.enqueue(fromUint8Array(this.buffer));
        }
      },
    };
    const stream = new globalThis.TransformStream(transformer);
    this.readable = stream.readable;
    this.writable = stream.writable;
  }
}

/**
 * A TransformStream that decodes a stream of Base64 strings into strings.
 * @example
 * ```ts
 * import { Base64DecodeStream } from '@se-oss/base64';
 *
 * const stream = new ReadableStream({
 *   start(controller) {
 *     controller.enqueue('SGVsbG8');
 *     controller.enqueue('sIHdvcmxk');
 *     controller.enqueue('IQ==');
 *     controller.close();
 *   },
 * });
 *
 * const decodeStream = new Base64DecodeStream();
 * const decodedStream = stream.pipeThrough(decodeStream);
 *
 * const reader = decodedStream.getReader();
 * let result = '';
 * let done = false;
 *
 * while (!done) {
 *   const { value, done: d } = await reader.read();
 *   done = d;
 *   if (value) {
 *     result += value;
 *   }
 * }
 *
 * console.log(result); // 'Hello, world!'
 * ```
 */
export class Base64DecodeStream implements TransformStream<Base64String, string> {
  public readonly readable: ReadableStream<string>;
  public readonly writable: WritableStream<Base64String>;
  private buffer = '';

  constructor() {
    const transformer = {
      transform: (chunk: Base64String, controller: TransformStreamDefaultController<string>) => {
        this.buffer += chunk;
        const remaining = this.buffer.length % 4;
        const toProcess = this.buffer.slice(0, this.buffer.length - remaining);
        this.buffer = this.buffer.slice(this.buffer.length - remaining);
        if (toProcess.length > 0) {
          controller.enqueue(decode(toProcess as Base64String));
        }
      },
      flush: (controller: TransformStreamDefaultController<string>) => {
        if (this.buffer.length > 0) {
          controller.enqueue(decode(this.buffer as Base64String));
        }
      },
    };
    const stream = new globalThis.TransformStream(transformer);
    this.readable = stream.readable;
    this.writable = stream.writable;
  }
}
