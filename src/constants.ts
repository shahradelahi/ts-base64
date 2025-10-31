/**
 * The Base64 character set.
 * @private
 */
export const B64_CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * A regular expression to test for valid Base64 encoded strings.
 *
 * @private
 */
export const B64_REGEX = /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?$/;

/**
 * A regular expression to test for valid URL-safe Base64 encoded strings.
 *
 * @private
 */
export const B64_URL_REGEX = /^(?:[A-Za-z\d-_]{4})*(?:[A-Za-z\d-_]{2,3})?$/;

/**
 * A lookup table for Base64 characters.
 * @private
 */
export const B64_LOOKUP: Record<string, number> = {};
for (let i = 0; i < B64_CHAR_SET.length; i++) {
  B64_LOOKUP[B64_CHAR_SET[i]] = i;
}
