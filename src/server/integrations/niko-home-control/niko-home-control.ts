import controller from 'niko-home-control';
import NikoHomeControlLight from './niko-home-control-light.js'

class NikoHomeControl {
  devices = {};

  static defaultOptions = {
    ip: '192.168.1.36',
    port: 8000,
    timeout: 20000,
    events: true
  }

  constructor(options = {}) {
    controller.init({...options, ...NikoHomeControl.defaultOptions});
  }

  async init() {
    const actions = await this.listActions()
    console.log(actions);
    
    for (const action of actions) {
      this.devices[action.id] = new NikoHomeControlLight(this.executeAction, action)
    }
    controller.events.on('listactions', this.#sync.bind(this));
  }

  #sync(actions: {id, data}[]) {
    for (const action of actions) {
      this.devices[action.id].sync(action)
    }
  }

  async listLocations() { return controller.listLocations() }

  async listActions() { return controller.listActions() }

  async listEnergy() { return controller.listEnergy() }

  async executeAction(id: string, value: string) {
    try {
      await controller.executeActions(id, value)
    } catch (error) {
      console.error(error)
    }
  }

  async systemInfo() { return controller.systemInfo() }
}

export { NikoHomeControl as default };
