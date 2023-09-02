import LeofcoinStorage from '@leofcoin/storage'
import { objectToUint8Array, uint8ArrayToObject } from '@easy-home/utils/utils.js'
import { Entities, IntegrationConfigEntry, IntegrationsConfig, IntegrationSetup, IntegrationSetups } from '@easy-home/types'
import integrationsManifest from '@easy-home/integrations/manifest.js'
import { logEntityAdded, logEntityLoaded, logIntegrationError, logIntegrationEvent, logIntegrationLoaded, logIntegrationRestart, logIntegrationStarted, logIntegrationStopped } from '@easy-home/logging'
const configStore = new LeofcoinStorage('config', '.peace-ui')
await configStore.init()

await configStore.put('integrations', objectToUint8Array({}))
if (!await configStore.has('integrations')) await configStore.put('integrations', objectToUint8Array({}))
if (!await configStore.has('panels')) await configStore.put('panels', objectToUint8Array([]))




export default class IntegrationsController {
  integrations: {
    [index: string]: {
      entities: Entities,
      start: () => Promise<void>
    }
  } = {}
  panelsConfig = {}
  integrationsConfig = {}
  integrationSetups: IntegrationSetups = {}

  constructor() {
    
  }

  async getIntegrationSetup(integration: string) {
    if (this.integrationSetups[integration]) {
      this.integrationSetups[integration].timestamp = new Date().getTime()
      return this.integrationSetups[integration].setup
    }
    const importee = await import(integrationsManifest[integration].import)
    const setup: IntegrationSetup = importee.setup.default
    
    this.integrationSetups[integration] = {
      setup,
      timestamp: new Date().getTime()
    }
    return setup
  }

  async init() {
    this.integrationsConfig = uint8ArrayToObject(await configStore.get('integrations'))
    this.panelsConfig = uint8ArrayToObject(await configStore.get('panels'))



    // soft clean interval
    // Todo: should we up time more and base clean on memory usage?
    const cleanup = () => {
      // checks if cleanup is needed every 5 minutes
      setTimeout(() => {
        for (const entry in Object.entries(this.integrationSetups)) {
          // @ts-ignore
          if (entry[1].timestamp + 5 * 60_000 >= new Date().getTime()) delete this.integrationSetups[entry[0]]
        }
        cleanup()
      }, 5 * 60_000)
    }
  }

  async loadIntegration(integration: string) {
    const importee = await import(integrationsManifest[integration].import)
    const config = this.integrationsConfig[integration].config
    this.integrations[integration] = new importee.default(config)
    logIntegrationLoaded(integration)
    return this.integrations[integration]
  }

  async startIntegration(integration: string) {
    try {
      await this.integrations[integration].start()
      const entities = this.integrationsConfig[integration].entities
      
      for (const entity of Object.values(this.integrations[integration].entities)) {
        if (entities?.[String(entity.id)]) {
          logEntityLoaded(`${integration}.${entity.type}.${entity.name}`)
        } else {
          logEntityAdded(`${integration}.${entity.type}.${entity.name}`)
          logEntityLoaded(`${integration}.${entity.type}.${entity.name}`)
        }
        
      }
      this.panelsConfig = this.integrations[integration].entities
      logIntegrationStarted(integration)
    } catch (error) {
      console.log({error});
      
      logIntegrationError({ error, integration })
      throw error
    }
  }

  async validateIntegrationConfig({integration, config, step}: {integration: string, config, step?}) {
    console.log(step);
    
    if (!integration) {
      // Todo: should fire error
      console.error('integration undefined')
      errors.push(new Error('integration undefined'))
    }
    if (integrationsManifest[integration].hasSetup && !config) {
      errors.push(new Error(`${integration}: integration needs to be setup`))
    }
    if (this.integrationsConfig[integration]) {
      errors.push(new Error(`${integration}: integration already setup`))
    }

    const errors = []
    const setup = {...await this.getIntegrationSetup(integration)}
    if (step !== undefined) setup.entries = [setup.entries[step]]
    console.log(setup.entries);
    
    for (const entry of setup.entries) {
      // @ts-ignore
      if (entry.inputs) {
        // @ts-ignore
        for (const input of entry.inputs) {
          // @ts-ignore
          if (input.validate) {
            // @ts-ignore
            const result = input.validate(config[input.name])
            
            if (result && result.error) {
              // @ts-ignore
              errors.push(new Error(`${input.name}: ${result.error}`))
            }
          }
        }
      }
    }

    if (errors.length > 0) 
      throw new AggregateError(
          errors, `${integration}: Error validating config.`)
  }
 
  async addIntegration(name, config) {
    this.integrationsConfig[name] = {
      name,
      config
    }

    await configStore.put('integrations', objectToUint8Array(this.integrationsConfig))
  }

  async changeIntegration({ integration, config }) {
    await this.validateIntegrationConfig({ integration, config })

    this.integrationsConfig[integration].config = config
    await configStore.put('integrations', objectToUint8Array(this.integrationsConfig))

    await this.restartIntegration(integration)
  }

  async removeIntegration (integration) {
    if (!integration) throw Error('remove: integration undefined')
    this.unloadIntegration(integration)
    this.unloadIntegrationConfig(integration)

    await configStore.put('integrations', objectToUint8Array(this.integrationsConfig))
  }

  /**
   * unloads the integration
   * 
   * when a integration is updated or its config got changed
   * we reimport the integration and load it again
   */
  unloadIntegration(integration) {
    delete this.integrations[integration]
  }

  unloadIntegrationConfig(integration) {
    delete this.integrationsConfig[integration]
  }

  async restartIntegration(integration) {
    logIntegrationRestart(integration)
    this.unloadIntegration(integration)
    logIntegrationStopped(integration)
    await this.loadIntegration(integration)
    await this.startIntegration(integration)
  }

  /**
   * starts all integrations
   * @param exclude Array including integrations by their name to be ignored on start
   * @returns integrations
   */
  async startIntegrations(exclude?: string[]) {
    for (const [integrationName, integration] of Object.entries(this.integrationsConfig)) {
      try {
        console.log(integration);
        if (exclude?.includes(integrationName)) return console.warn(`StartIntegrations: ignored ${integrationName}`);
        await this.loadIntegration(integrationName)
        await this.startIntegration(integrationName)
      } catch (error) {
        logIntegrationError({error, integration: integrationName})
      }
    }
    console.log(this.integrations);
    return this.integrations
  }
  
}