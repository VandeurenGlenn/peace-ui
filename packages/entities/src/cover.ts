import Entity from './entity.js'
import Dummy from './helpers/dummy.js'

export default (base = Dummy) => {
  class Cover extends Entity(base) {
    type = 'cover'

    moving: boolean = false
    position: number

    get isOpen() {
      return this.position > 0
    }

    constructor(data) {
      super(data)
      this.position = data.position
    }
    
    open() {
      console.warn('missing open implementation');
    }

    close() {
      console.warn('missing close implementation');
    }

    stop() {
      console.warn('missing stop implementation');
    }

    updateState(state) {
      super.updateState(state)
      if (state.isOpen !== this.isOpen && !this.moving) {
        if (!state.isOpen) this.close()
        else this.open()
      }
    }

    setState(state: any): void {
      super.setState(state)
      if (state.position) this.position = state.position
    }

    toJson() {
      return { ...super.toJson(), position: this.position, moving: this.moving, isOpen: this.isOpen }
    }
  }

  return Cover
}