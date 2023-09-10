
import socketRequestServer from 'socket-request-server'
import integrationsManifest from '@easy-home/integrations/manifest.js'
import { SOCKET_API_PORT, SOCKET_API_PROTOCOL } from '@easy-home/constants'
import { IntegrationConfigEntry, IntegrationsConfig, IntegrationSetup } from '@easy-home/types'
import LittlePubSub from '@vandeurenglenn/little-pubsub'
import IntegrationsController from './controllers/integrations.js'
import { logs } from '@easy-home/logging'
// import { getAndroidToolPath } from "android-tools-bin";
// import './builtin/mdns.js'
// const adbCommand = getAndroidToolPath("adb");
// console.log(adbCommand);

declare global {
  var pubsub: LittlePubSub;
}
globalThis.easyHome = globalThis.easyHome ||
{
  logs: []
}
globalThis.pubsub = globalThis.pubsub || new LittlePubSub()

declare type Response = {
  send: (data: any, status?: number) => void
  error: (msg: string) => void
}

class ApiServer {
  requestServer: {
    connections: any[],
    close: () => any
  }
  starting: boolean = true
  integrationsController: IntegrationsController
  
  constructor() {
    this.integrationsController = new IntegrationsController()
    this.init()
  }

  get integrations() {
    return this.integrationsController.integrations
  }

  async init() {
    await this.integrationsController.init()

    this.requestServer = await socketRequestServer({
      protocol: SOCKET_API_PROTOCOL, port: SOCKET_API_PORT
    }, {
      logs: async ({send}) => {
        send(logs.slice(-100))
      }
        ,
      // Todo: what should be in config?
      // config: async ({send}) =>
      //   send((await configStore.get())),
      integrations: async ({send}: Response) => 
        send(this.integrationsController.integrationsConfig),
      panels: async ({send}: Response) => 
        send(this.integrationsController.panelsConfig),
      supportedIntegrations: async ({send}: Response) => 
        send(integrationsManifest),
      getSetup: async (params, {send, error}: Response) => {
        if (!integrationsManifest[params.integration].hasSetup) {
          console.error('dev error: tried to load setup manual')
          return send('integration undefined')
        }
        const importee = await import(integrationsManifest[params.integration].import)
        const setup = importee.setup.default
        send(JSON.stringify(setup))
      },
      validateSetupStep: async (params, {send}) => {
        try {
         await this.integrationsController.validateIntegrationConfig(params)
         send('ok')
        } catch (error) {
          send({error: error.errors ? error.errors.map(error => error.message) : error})
        }
      },
      stopIntegration: async (params, {send}) => {
        try {
          await this.integrationsController.unloadIntegration(params.integration)
          send('ok')
        } catch (error) {
          send({error: error.message})
        }
      },
      addIntegration: async (params, {send}) => {
        try {
          // check if the intergation is valid before adding it
          await this.integrationsController.validateIntegrationConfig(params)
          await this.integrationsController.addIntegration(params.integration, params.config)
          send('ok')
        } catch (error) {
          send({error: error.message})
        }
      },
      loadIntegration: async (params, {send}) => {
        try {
          await this.integrationsController.loadIntegration(params.integration)
          send('ok')
        } catch (error) {
          send({error: error.message})
        }
      },
      startIntegration: async (params, {send}) => {
        try {
          await this.integrationsController.startIntegration(params.integration)
          // const integrationsConfig = this.integrationsConfig[params.integration]
          // for (const entity in integrationsConfig.entities) {
          //   integration.entities[entity]
          //   integrationsConfig.entities[entity]
          // }
          send('ok')
        } catch (error) {
          send({error: error.message})
        }
      },
      restartIntegration: async (params, {send}) => {
        try {
          await this.integrationsController.restartIntegration(params.integration)
          send('ok')
        } catch (error) {
          send({error})
        }
      },
      changeIntegration: async (params, {send}) => {
        try {
          await this.integrationsController.changeIntegration(params)
          send('ok')
        } catch (error) {
          send({error})
        }
      },
      removeIntegration: async (params, {send}) => {
        try {
          await this.integrationsController.removeIntegration(params.integration)
          send('ok')
        } catch (error) {
          send({error: error.message})
        }
      },
      integrationRunning: async (params, {send}) => {
        send(await this.integrationsController.integrationRunning(params.integration))
      },
      entities: async ({send}) => {
        try {
          let entities = {}
          for (const key of Object.keys(this.integrations)) {
            entities[key] = Object.values(this.integrations[key].entities)
          }
          send(entities)
        } catch (error) {
          send({error})
        }
      },
      started: ({send}) => {
        send(this.starting === false)
      },

      starting: ({send}) => {
        send(this.starting)
      }

    })

    await this.integrationsController.startIntegrations()
    pubsub.publish('easy-home-server-ready', true)
    this.starting = false
    pubsub.subscribe('entity-state-action', state => {
      const entityInfo = this.integrationsController.entityController.getEntity(state.uid)
      if (entityInfo.integration && entityInfo.entityId) {
        const entity = this.integrations[entityInfo.integration].entities[entityInfo.entityId]
        try {
          entity.updateState(state)
        } catch (error) {
          pubsub.publish('entity-error', error)
        }
      }
    })
  }
}
export default ApiServer