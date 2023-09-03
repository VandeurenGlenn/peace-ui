import Dummy from "./helpers/dummy.js";
import Light from "./light.js";

export default (base = Dummy) => {
  class Dimmable extends Light(base) {
    type = 'dimmable'

    brightness: number
    
    constructor(data) {
      super(data)
      this.brightness = Number(data.brightness)
    }

    setBrightness() {
      console.warn(`missing setBrightness implementation ${this}`);
    }

    updateState(state) {
      const brightness = Number(state.brightness)
      super.updateState(state)
      // handle dim changes ignore ison state
      if (brightness && brightness !== this.brightness) {
        this.brightness = brightness
        this.setBrightness()
      }
    }

    setState(state: any): void {
      super.setState(state)
      if (state.brightness) this.brightness = state.brightness
    }

    toJson() {
      return { ...super.toJson(), brightness: this.brightness }
    }
  }

  return Dimmable
}