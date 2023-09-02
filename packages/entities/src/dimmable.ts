import Dummy from "./helpers/dummy.js";
import Light from "./light.js";

export default (base = Dummy) => {
  class Dimmable extends Light(base) {
    type = 'dimmable'

    brightness: number
    
    constructor(data) {
      super(data)
      this.brightness = data.brightness
    }

    updateState(state) {
      super.updateState(state)
      if (state.brightness) this.brightness = state.brightness
    }

    toJson() {
      return { ...super.toJson(), brightness: this.brightness }
    }
  }

  return Dimmable
}