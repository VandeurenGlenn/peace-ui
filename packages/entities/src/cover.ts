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
     * should add moving/position behavior for cover entities that just support up/down (open/close)
     * @dev override if your integration has moving events integrated
     */
    async trackPosition(position, getter?) {
      this.moving = true
      let trackTime = 5 * 60_000 // one minute

      const checkPosition = () => setTimeout(async () => {
        if (getter) {
          await getter()
        }
        trackTime -= 1000
  
        if (trackTime === 0) throw new Error(`cover: ${this.uid} timedout`)
        if (position !== this.position) {
          return checkPosition()
        }
        this.moving = false
        this.position = position
        this.stop()
      }, 1000)

      this.open()
      
      return checkPosition()
    }

    updateState(state) {
      super.updateState(state)
      const position = state.position
      // don't overspam only track when position really changed and don't track when already tracking, just update the position
      if (position !== this.position && this.position !== undefined && !this.moving) {
        return this.trackPosition(position)
      } else {
        this.position = position
      }
      if (!position) {
        if (state.isOpen !== this.isOpen) {
          if (!state.isOpen) this.close()
          else this.open()
        } 
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