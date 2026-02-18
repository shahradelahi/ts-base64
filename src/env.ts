/**
 * @private
 */
export const IS_NODE = typeof Buffer !== 'undefined';

/**
 * @private
 */
export const HAS_BTOA = typeof btoa !== 'undefined';

/**
 * @private
 */
export const HAS_ATOB = typeof atob !== 'undefined';

/**
 * @private
 */
export const TEXT_ENCODER = new TextEncoder();

/**
 * @private
 */
export const TEXT_DECODER = new TextDecoder();
