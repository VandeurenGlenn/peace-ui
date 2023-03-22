import SocketRequestClient from './../../node_modules/socket-request-client/src/socket-request-client.js'

export default class Client {
  #client;

  constructor() {
    this.init()
    
    
  }

  async init() {
    this.#client = await SocketRequestClient('ws://localhost:6006', 'peace-api')
  }

  #request(url: string, params?: object) {
    this.#client.request({url, params})
  }

  async config() { return this.#request('config') }
    
  async integrations() { return this.#request('integrations') }
    
  async supportedIntegrations() { return this.#request('supportedIntegrations') }
    
  async addIntegration(integration: string, config: object) { return this.#request('addIntegration', { integration, config }) }
  
  async changeIntegration(integration: string, config: object) { return this.#request('changeIntegration', { integration, config }) }
  
  async removeIntegration(integration: string) {
    return this.#request('removeIntegration', {integration})
  }

  async interact(integration: string, id: string, action: string, value: string | number) {
    return this.#request('interact', { integration, id, action, value })
  }

  async devices() {
    return this.#request('devices')
  }
}