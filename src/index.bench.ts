import { Base64 as jsBase64 } from 'js-base64';
import { bench, describe } from 'vitest';

import { decode, fromDataURL, toUint8Array } from './decode';
import { encode, fromUint8Array, toDataURL } from './encode';

const smallString = 'Hello, world!';
const mediumString = 'a'.repeat(1024);
const largeString = 'a'.repeat(1024 * 1024);

const encodedSmallString = encode(smallString);
const encodedMediumString = encode(mediumString);
const encodedLargeString = encode(largeString);

describe('encode', () => {
  bench('native', () => {
    btoa(smallString);
    btoa(mediumString);
    btoa(largeString);
  });

  bench('@se-oss/base64', () => {
    encode(smallString);
    encode(mediumString);
    encode(largeString);
  });

  bench('js-base64', () => {
    jsBase64.encode(smallString);
    jsBase64.encode(mediumString);
    jsBase64.encode(largeString);
  });
});

describe('decode', () => {
  bench('native', () => {
    atob(encodedSmallString);
    atob(encodedMediumString);
    atob(encodedLargeString);
  });

  bench('@se-oss/base64', () => {
    decode(encodedSmallString);
    decode(encodedMediumString);
    decode(encodedLargeString);
  });

  bench('js-base64', () => {
    jsBase64.decode(encodedSmallString);
    jsBase64.decode(encodedMediumString);
    jsBase64.decode(encodedLargeString);
  });
});

const smallUint8Array = new Uint8Array([
  72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
]);
const mediumUint8Array = new Uint8Array(1024);
const largeUint8Array = new Uint8Array(1024 * 1024);

describe('fromUint8Array', () => {
  bench('@se-oss/base64', () => {
    fromUint8Array(smallUint8Array);
    fromUint8Array(mediumUint8Array);
    fromUint8Array(largeUint8Array);
  });

  bench('js-base64', () => {
    jsBase64.fromUint8Array(smallUint8Array);
    jsBase64.fromUint8Array(mediumUint8Array);
    jsBase64.fromUint8Array(largeUint8Array);
  });
});

describe('toUint8Array', () => {
  bench('@se-oss/base64', () => {
    toUint8Array(encodedSmallString);
    toUint8Array(encodedMediumString);
    toUint8Array(encodedLargeString);
  });

  bench('js-base64', () => {
    jsBase64.toUint8Array(encodedSmallString);
    jsBase64.toUint8Array(encodedMediumString);
    jsBase64.toUint8Array(encodedLargeString);
  });
});

const mimeType = 'text/plain';
const smallDataURL = toDataURL(smallString, mimeType);
const mediumDataURL = toDataURL(mediumString, mimeType);
const largeDataURL = toDataURL(largeString, mimeType);

describe('toDataURL', () => {
  bench('@se-oss/base64', () => {
    toDataURL(smallString, mimeType);
    toDataURL(mediumString, mimeType);
    toDataURL(largeString, mimeType);
  });
});

describe('fromDataURL', () => {
  bench('@se-oss/base64', () => {
    fromDataURL(smallDataURL);
    fromDataURL(mediumDataURL);
    fromDataURL(largeDataURL);
  });
});
