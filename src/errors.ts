/**
 * Custom error class for invalid Base64 strings.
 */
export class InvalidBase64Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBase64Error';
  }
}

/**
 * Custom error class for invalid Data URLs.
 */
export class InvalidDataURLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDataURLError';
  }
}
