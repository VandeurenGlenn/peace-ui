import Entity from './entity.js'
import Dummy from './helpers/dummy.js'

export default (base = Dummy) => {
  class Light extends Entity(base) {
    type = 'light'

    isOn: boolean
    color: string

    constructor(data) {
      super(data)
      this.isOn = data.isOn
    }

    updateState(state) {
      super.updateState(state)
      if (state.isOn) this.isOn = state.isOn !== 0
    }

    toJson() {
      return {...super.toJson(), isOn: this.isOn, color: this.color }
    }
  }

  return Light
}