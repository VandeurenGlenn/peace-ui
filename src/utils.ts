export const objectToUint8Array = (object: {} | []) =>
  new TextEncoder().encode(JSON.stringify(object))

export const uint8ArrayToObject = (uint8Array: Uint8Array) =>
  JSON.parse(new TextDecoder().decode(uint8Array))