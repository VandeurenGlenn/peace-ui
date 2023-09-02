import type { IntegrationConfig } from "../../../types/config.js"
import { Cover, Light } from "../../../types/src/types.js"
import Hub from "./hub.js"

// !important, setup doenst run if not include & the integration will faill to load since we require an ip etc to connect the device api
export * as setup from '../../src/niko-home-control/setup.js'

class MyIntegration {
  hub: Hub
  config: IntegrationConfig
  devices: {
    covers: Cover[],
    lights: Light[]
  } = {
    covers: [],
    lights: []
  }

  constructor(config) {
    this.config = config // config containing { name, ip etc} (see setup.ts)
    this.init() // not needed we just do it outside to have it clean plus when we want to use async/await
  }

  async init() {

    this.hub = new Hub(this.config.ip, this.config.port)

    // always load devices on start, we keep config stored but that's all
    const devices = await this.hub.devices()
    for (const device of devices) {
      if (device.type === 4) this.devices.covers.push(device)
      else if (device.type === 2) this.devices.lights.push(device)
    }
  }

  execute(id, value) {
    try {
    
      this.hub.execute(id, value)
    } catch (error) {
      throw error
    }
    
  }
}

// functions aren't supported so we export the class
export default MyIntegration