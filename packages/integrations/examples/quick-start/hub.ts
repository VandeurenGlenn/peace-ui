class DummyAPI {
  constructor(ip, port) {

  }
}

export default class Hub {
  api

  constructor(ip, port) {
    console.log({ip, port});
    this.api = new DummyAPI(ip, port)
    this.api.on('device-added', globalThis.easyHome.publish)
  }

  devices() {
    return this.api.dosomething
  }
}