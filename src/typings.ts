/**
 * A branded type to provide compile-time safety for distinguishing different string types.
 * @template T The base type (e.g., string).
 * @template U A unique brand identifier (e.g., 'Base64').
 */
type Brand<T, U> = T & { readonly __brand: U };

/**
 * Represents a Base64 encoded string.
 * Using a branded type for compile-time safety.
 */
export type Base64String = Brand<string, 'Base64'>;

/**
 * Represents a URL-safe Base64 encoded string.
 * Using a branded type for compile-time safety.
 */
export type Base64UrlString = Brand<string, 'Base64Url'>;

/**
 * Represents a string that is not Base64 encoded.
 */
export type NotBase64 = string;

/**
 * Represents a value that may or may not be Base64 encoded.
 */
export type MaybeBase64 = unknown;

/**
 * Represents a readable stream of data.
 */
export type ReadableStream<T> = globalThis.ReadableStream<T>;

/**
 * Represents a transform stream that can be used to modify data as it is being read.
 */
export type TransformStream<I, O> = globalThis.TransformStream<I, O>;

/**
 * Options for Base64 encoding.
 */
export interface Base64EncodeOptions<SafeURL extends boolean = false> {
  /**
   * If `true`, the padding characters (`=`) will be omitted from the encoded string.
   */
  omitPadding?: boolean;

  /**
   * If `true`, the URL-safe alphabet will be used.
   */
  urlSafe?: SafeURL;
}

/**
 * Options for Base64 decoding.
 */
export interface Base64DecodeOptions {
  /**
   * If `true`, the URL-safe alphabet will be used for decoding.
   */
  urlSafe?: boolean;
}
