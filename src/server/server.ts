import LeofcoinStorage, { Store } from '@leofcoin/storage'
import socketRequestServer from 'socket-request-server'
import { objectToUint8Array, uint8ArrayToObject } from '../utils.js'
import integrationsManifest from './../integrations-manifest.js'
const configStore = new LeofcoinStorage('config', '.peace-ui')
await configStore.init()

if (!await configStore.has('integrations')) await configStore.put('integrations', objectToUint8Array([{ integration: 'niko-home-control'}]))

const integrations = {}

for (const item of uint8ArrayToObject(await configStore.get('integrations'))) {
  const importee = await import(integrationsManifest[item.integration])
  integrations[item.integration] = new importee.default(item.config)

  await integrations[item.integration].init()
}

const apiServer = await socketRequestServer({protocol: 'peace-api', port: 6006}, {
  config: async ({send}) =>
    send((await configStore.get())),
  integrations: async ({send}) => 
    send(uint8ArrayToObject(await configStore.get('integrations'))),
  supportedIntegrations: async ({send}) => 
    send(integrationsManifest),
  addIntegration: async (params, {send}) => {
    if (!params.integration) return send('invalid integration')
    
    const integrations = uint8ArrayToObject(await configStore.get('integrations'))
    integrations.push({integration: params.integration, config: params.config})
    await configStore.put('integrations', objectToUint8Array(integrations))
    send('ok')
  },
  changeIntegration: async (params, {send}) => {
    if (!params.integration) return send('invalid request')

    const integrations = uint8ArrayToObject(await configStore.get('integrations'))
    for (const integration of integrations) {
      if (integration.integration === params.integration) integration.config = params.config
    }

    await configStore.put('integrations', objectToUint8Array(integrations))
    send('ok')
  },
  removeIntegration: async (params, {send}) => {
    if (!params.integration) return send('invalid request')

    const integrations = uint8ArrayToObject(await configStore.get('integrations'))
    let index = 0;
    let toDelete
    for (const integration of integrations) {
      if (integration.integration === params.integration) toDelete = index
      index +=1
    }

    if (toDelete !== undefined) delete integrations[toDelete]

    await configStore.put('integrations', objectToUint8Array(integrations))
    send('ok')
  },
  interact: async (params, {send}) => {
    const integration = integrations[params.integration]
    integration.devices[params.id][params.action](params.value)
  },
  devices: async ({send}) => {
    try {
      let devices = []
      for (const key of Object.keys(integrations)) {
        devices = [...integrations[key].devices]
      }
      send(devices)
    } catch (error) {
      
    }
  }
})