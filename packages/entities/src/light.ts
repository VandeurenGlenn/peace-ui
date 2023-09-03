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

    on() {
      console.warn(`missing on implementation ${this}`);
    }

    off() {
      console.warn(`missing off implementation ${this}`);
    }

    updateState(state) {
      super.updateState(state)
      const isOn = state.isOn
      if (isOn !== this.isOn) {
        this.isOn = state.isOn
        if (state.isOn) this.on()
        else this.off()
      }
    }

    setState(state: any): void {
      super.setState(state)
      if (state.isOn) this.isOn = state.isOn
    }

    toJson() {
      return {...super.toJson(), isOn: this.isOn, color: this.color }
    }
  }

  return Light
}