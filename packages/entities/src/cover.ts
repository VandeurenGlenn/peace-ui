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

    /**
     * tracks position change
     * @dev override if your integration has moving events integrated
     */
    trackPosition(position) {
      this.moving = true
      let trackTime = 5 * 60_000 // one minute

      const checkPosition = setTimeout(() => {
        trackTime -= 1000
  
        if (trackTime === 0) throw new Error(`cover: ${this.uid} timedout`)
        if (position !== this.position) {
          return checkPosition()
        }
        this.stop()
        this.moving = false
      }, 1000)

      this.open()
      checkPosition()
    }

    updateState(state) {
      super.updateState(state)
      if (state.position) {
        this.position = state.position
      }
    }

    toJson() {
      return { ...super.toJson(), position: this.position, moving: this.moving }
    }
  }

  return Cover
}