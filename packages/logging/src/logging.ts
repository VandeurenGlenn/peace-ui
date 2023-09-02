import LittlePubSub from '@vandeurenglenn/little-pubsub'

declare global {
  var pubsub: LittlePubSub;
  var easyHome
}

globalThis.pubsub = globalThis.pubsub || new LittlePubSub(true)
globalThis.easyHome = globalThis.easyHome ||
{
  logs: []
}
export const logs = globalThis.easyHome.logs


export const logEntityState = error => {
  logs.push(error)
}

export const logIntegrationLoaded =
  integration => logIntegrationEvent(integration, 'load')

export const logIntegrationStarted =
  integration => logIntegrationEvent(integration, 'start')

export const logIntegrationStopped =
  integration => logIntegrationEvent(integration, 'stop')

export const logIntegrationRestart = 
  integration => logIntegrationEvent(integration, 'restart')

export const logIntegrationError =
  log => logIntegrationEvent(log.integration, 'error', {...log.error})

export const logIntegrationEvent = (integration, type, error?) => {
  const timestamp = new Date().getTime()
  const event = {timestamp, integration, type, error}
  pubsub.publish('integration-event', event)
  logs.push(event)
}

export const logEntityLoaded =
  entity => logEntityEvent(entity, 'load')

  export const logEntityAdded =
  entity => logEntityEvent(entity, 'add')

export const logEntityStarted =
  entity => logEntityEvent(entity, 'start')

export const logEntityStopped =
  entity => logEntityEvent(entity, 'stop')

export const logEntityRestart = 
  entity => logEntityEvent(entity, 'restart')

export const logEntityError =
  log => logEntityEvent(log.integration, 'error', {...log.error})


export const logEntityEvent = (entity, type, error?) => {
  const timestamp = new Date().getTime()
  const event = {timestamp, entity, type, error}
  pubsub.publish('entity-event', event)
  logs.push(event)
}

export const logEntityStateEvent = (message: {integration:string, entity: {}}, type, error?) => {
  const timestamp = new Date().getTime()
  const event = {timestamp, ...message, type, error} 
  pubsub.publish('entity-state-event', event)
  logs.push(event)
}