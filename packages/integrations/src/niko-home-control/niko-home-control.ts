import Controller from '@vandeurenglenn/niko-home-control';
import { EntityType } from '@easy-home/types';
import Integration from './../integration.js'
import NikoHomeControlCover from './entities/cover.js';
import NikoHomeControlLight from './entities/light.js';
import NikoHomeControlDimmable from './entities/dimmable.js';
import { logEntityStateEvent } from '@easy-home/logging'
export * as setup from './setup.js'

class NikoHomeControl extends Integration {
  entities = {}
  controller: Controller
  options

  static defaultOptions = {
    host: '127.0.0.1',
    port: 8000,
    timeout: 20000,
    events: true
  }

  constructor(options = {}) {
    super('niko-home-control')
    this.options = options
  }

  

  async getEntities() {
    const actions = await this.listActions()
    
    for (const data of actions.data) {
      
      let entity

      switch (Number(data.type)) {
        case 4:
          entity = new NikoHomeControlCover(this.executeAction.bind(this), data)
          break
        case 1:
          entity = new NikoHomeControlLight(this.executeAction.bind(this), data)
          break;
        case 2:
          entity = new NikoHomeControlDimmable(this.executeAction.bind(this), data)
          break;
        default:
          console.warn(`
          found unsuported type, ${data.type}
            ${data}
          `);
          break;
      }

      if (entity.type === 4) console.log(entity);
      
      this.entities[String(entity.id)] = entity
    }
  }

  async start() {
    this.controller = new Controller({...NikoHomeControl.defaultOptions, ...this.options});
    await this.controller.connect()
    await this.getEntities()
    await this.controller.startEvents()
    this.controller.on('listactions', this.#onActions.bind(this));
      // this.controller.on('getlive', this.#sync.bind(this));
      // Todo listen to getlive? let peace test
  }


  #onActions = ({ data }) => {
    for (const action of data)
        this.#publishUpdate(action)
}

  #publishUpdate(action) {
    const entity = this.entities[String(action.id)]
    // setState doesn't perform actions like updateState does
    entity.setState(entity)
    
    logEntityStateEvent({
      integration: this.name,
      entity: entity.toJson()
    }, 'change')
  }

  async listLocations() { return this.controller.listLocations() }

  async listActions() { return this.controller.listActions() }

  async listEnergy() { return this.controller.listEnergy() }

  async executeAction(id: string, value: string | number) {
    try {
      await this.controller.executeActions(id, value)
    } catch (error) {
      globalThis.pubsub.publish('execution-error', {
        integration: this.name,
        action: {id, value},
        error
      })
      console.error(error)
    }
  }

  async systemInfo() { return this.controller.systemInfo() }
}

export { NikoHomeControl as default };
