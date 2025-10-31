import { decode } from './decode';
import { encode } from './encode';
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
  private buffer = '';

  constructor() {
    const transformer = {
      transform: (
        chunk: string | Uint8Array,
        controller: TransformStreamDefaultController<Base64String>
      ) => {
        const str =
          typeof chunk === 'string' ? chunk : String.fromCharCode.apply(null, Array.from(chunk));
        this.buffer += str;
        let result = '';
        while (this.buffer.length >= 3) {
          const slice = this.buffer.slice(0, 3);
          this.buffer = this.buffer.slice(3);
          result += encode(slice);
        }
        if (result) {
          controller.enqueue(result as Base64String);
        }
      },
      flush: (controller: TransformStreamDefaultController<Base64String>) => {
        if (this.buffer.length > 0) {
          controller.enqueue(encode(this.buffer));
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
        let result = '';
        while (this.buffer.length >= 4) {
          const slice = this.buffer.slice(0, 4);
          this.buffer = this.buffer.slice(4);
          result += decode(slice as Base64String);
        }
        if (result) {
          controller.enqueue(result);
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
