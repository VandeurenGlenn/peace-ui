import { encode } from '@vandeurenglenn/base32';

export const objectToUint8Array = (object: {} | []) =>
  new TextEncoder().encode(JSON.stringify(object))

export const uint8ArrayToObject = (uint8Array: Uint8Array) =>
  JSON.parse(new TextDecoder().decode(uint8Array))


export const generateUid = () => encode(crypto.getRandomValues(new Uint8Array(24)))