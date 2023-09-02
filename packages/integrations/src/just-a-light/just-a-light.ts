import Controller from '@vandeurenglenn/niko-home-control';


class NikoHomeControl {
  devices = {};
  controller: Controller

  static defaultOptions = {
    host: '127.0.0.1',
    port: 8000,
    timeout: 20000,
    events: true
  }

  constructor(options = {}) {
    this.controller = new Controller({...options, ...NikoHomeControl.defaultOptions});
  }

  async init() {
    const actions = await this.listActions()
    
    for (const action of actions.data) {
      // this.devices[action.id] = new NikoHomeControlLight(this.executeAction, action)
    }
    // @ts-ignore
    this.controller.on('listactions', this.#sync.bind(this));
  }

  #sync(actions: {id, data}[]) {
    for (const action of actions) {
      this.devices[action.id].sync(action)
    }
  }

  async listLocations() { return this.controller.listLocations() }

  async listActions() { return this.controller.listActions() }

  async listEnergy() { return this.controller.listEnergy() }

  async executeAction(id: string, value: string) {
    try {
      await this.controller.executeActions(id, value)
    } catch (error) {
      console.error(error)
    }
  }

  async systemInfo() { return this.controller.systemInfo() }
}

export { NikoHomeControl as default };
