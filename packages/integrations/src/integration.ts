import { encode } from '@vandeurenglenn/base32';

export default class Integration {
  name: string
  uid = encode(crypto.getRandomValues(new Uint8Array(24)))

  constructor(name) {
    this.name = name
  }

  addEntity(entity) {
    globalThis.pubsub.publish('entity-added', {
      integration: this.name,
      entity
    })
  }

  updateState() {
    
  }
}