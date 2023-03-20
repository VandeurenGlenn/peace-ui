import SocketRequestClient from 'socket-request-client'

export default class Client {
  constructor() {
    this.#client = SocketRequestClient()
  }
}