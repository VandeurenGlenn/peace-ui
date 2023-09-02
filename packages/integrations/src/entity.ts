import { encode } from '@vandeurenglenn/base32';

export default class Entity {
  name: string
  uid = encode(crypto.getRandomValues(new Uint8Array(24)))

  constructor(name) {
    this.name = name

  }
}