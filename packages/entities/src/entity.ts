import Dummy from "./helpers/dummy.js"
import { generateUid } from '@easy-home/utils'

export default (base = Dummy) => class Entity extends base {
  type: string
  id: string
  uid: string
  name: string
  online: boolean

  constructor(data) {
    super()
    this.id = data.id
    this.uid = data.uid || generateUid()
    this.name = data.name
    this.online = true
  }

  updateState(state) {
    if (state.online) this.online = state.online
  }

  setState(state) {
    if (state.online) this.online = state.online
  }

  toJson() {
    return {
      type: this.type,
      name: this.name,
      id: this.id,
      uid: this.uid,
      online: this.online
    }
  }
}