import {SocketRequestClient} from 'socket-request-client'
import type Connection from 'socket-request-client/connection'
import { Entities } from './context/entities.js'

export default class Client {
  #client: Connection


  async init() {
    const client = new SocketRequestClient('ws://localhost:6006', 'easy-home-api')
    this.#client = await client.init()
  }

  #send(url: string, params?: object) {
    return this.#client.send({url, params})
  }

  #request(url: string, params?: object) {
    return this.#client.request({url, params})
  }

  async config() { return this.#request('config') }
    
  async integrations() { return this.#request('integrations') }

  async panels() { return this.#request('panels') }
    
  async supportedIntegrations() { return this.#request('supportedIntegrations') }
    
  async getSetup(integration: string) { return this.#request('getSetup', { integration }) }

  async validateSetupStep(integration: string, step: number, config: {}) { return this.#request('validateSetupStep', { integration, step, config }) }

  async addIntegration(integration: string, config: object) { return this.#request('addIntegration', { integration, config }) }

  async loadIntegration(integration: string) { return this.#request('loadIntegration', { integration }) }

  async startIntegration(integration: string) { return this.#request('startIntegration', { integration }) }

  async stopIntegration(integration: string) { return this.#request('stopIntegration', { integration }) }

  async restartIntegration(integration: string) { return this.#request('restartIntegration', { integration }) }
  
  async changeIntegration(integration: string, config: object) { return this.#request('changeIntegration', { integration, config }) }
  
  async removeIntegration(integration: string) {
    return this.#request('removeIntegration', {integration})
  }

  async interact(integration: string, id: string, action: string, value: string | number) {
    return this.#send('interact', { integration, id, action, value })
  }

  async entities(): Promise<{[index: string]: Entities}> {
    return this.#request('entities')
  }

  async logs() {
    return this.#request('logs')
  }

  async started() {
    return this.#request('started')
  }

  get pubsub() {
    return this.#client.pubsub
  }
}