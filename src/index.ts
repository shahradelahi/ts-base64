import {
  decode as atob,
  decode,
  decodeURL,
  fromDataURL,
  isValid,
  isValidURL,
  toUint8Array,
} from './decode';
import { encode as btoa, encode, encodeURL, fromUint8Array, toDataURL } from './encode';
import { InvalidBase64Error, InvalidDataURLError } from './errors';

export {
  encode,
  decode,
  encodeURL,
  decodeURL,
  isValid,
  isValidURL,
  fromUint8Array,
  toUint8Array,
  toDataURL,
  fromDataURL,
  btoa,
  atob,
  InvalidBase64Error,
  InvalidDataURLError,
};

/**
 * A class that provides Base64 encoding and decoding functions.
 */
export class Base64 {
  public static encode = encode;
  public static decode = decode;
  public static encodeURL = encodeURL;
  public static decodeURL = decodeURL;
  public static isValid = isValid;
  public static isValidURL = isValidURL;
  public static fromUint8Array = fromUint8Array;
  public static toUint8Array = toUint8Array;
  public static fromDataURL = fromDataURL;
  public static toDataURL = toDataURL;
  public static btoa = btoa;
  public static atob = atob;
}

export * from './stream';
export type * from './typings';
