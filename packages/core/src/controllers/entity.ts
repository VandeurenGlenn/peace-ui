export default class EntityController {
  entities: Map<string, {integration: string, entityId: string}> = new Map()

  getEntity(uid) {
    return this.entities.get(uid)
  }

  addEntity({uid, integration, id}) {
    return this.entities.set(uid, {integration, entityId: id})
  }

  removeEntity(uid) {
    return this.entities.delete(uid)
  }
}