import { EntityType } from '@easy-home/types';
import Integration from '../integration.js'
import { encode } from '@vandeurenglenn/base32';
export * as setup from './setup.js'
import {Adb, Client} from '@devicefarmer/adbkit';
import { join } from 'path';
console.log(process.env);

interface Options {
  host?: string;
  port?: number;
  bin?: string;
  timeout?: number;
}

class Android extends Integration {
  entities = {}
  controller: Client

  constructor(options: Options = {}) {
    super('android')
    options.bin = join(process.env['npm_config_local_prefix'], 'node_modules/android-tools-bin/dist/darwin/x86/adb')
    this.controller = Adb.createClient(options)
  }

  async start() {
    const devices  = await this.controller.listDevices()
    console.log(devices);
    const tracker = await this.controller.trackDevices()
        tracker.on('add', (device) => console.log('Device %s was plugged in', device.id));
        tracker.on('remove', (device) => console.log('Device %s was unplugged', device.id));
        tracker.on('end', () => console.log('Tracking stopped'));
    this.entities = devices
    return
    const actions = await this.listActions()
    
    for (const action of actions.data) {
      const uid = encode(crypto.getRandomValues(new Uint8Array(24)))
      const entity: {
        uid: string
        action
        type: EntityType
        location?: string
        dimmable?: boolean
      } = {
        uid,
        action,
        type: 'light',
        location: action.location
      }

      switch (Number(action.type)) {
        case 4:
          entity.type = 'cover'
          break
        case 1:
          break;
        case 2:
          entity.dimmable = true
          break;

        default:
          console.warn(`
          found unsuported type, ${action.type}
            ${action}
          `);
          break;
      }

      this.entities[String(action.id)] = entity
      globalThis.pubsub.publish('entity-added', {
        integration: this.name,
        entity
      })
    }
    // @ts-ignore
    this.controller.on('listactions', this.#onActions.bind(this));
    // this.controller.on('getlive', this.#sync.bind(this));
    // Todo listen to getlive? let peace test
  }


  #onActions = ({ data }) => {
    for (const action of data)
        this.#publishUpdate(action)
}

  #publishUpdate(action) {
    this.entities[String(action.id)].value1 = action.value1
    const device = this.entities[String(action.id)]
    globalThis.pubsub.publish('state-change', {
      integration: this.name,
      uid: device.uid,
      id: action.id,
      state: action.value1
    })
  }

  async listLocations() { return this.controller.listLocations() }

  async listActions() { return this.controller.listActions() }

  async listEnergy() { return this.controller.listEnergy() }

  async executeAction(id: string, value: string) {
    try {
      this.entities[id].value1 = value
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

export { Android as default };
