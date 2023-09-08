import { Cover } from "@easy-home/entities";
import NikoHomeControl from "./../niko-home-control.js";

/**
 * Representation of a niko home control blind/cover etc
 * 
 * @param data {data from controller}
 * @param uid unique id of the entity if it was added before
 */
export default class NikoHomeControlCover extends Cover() {
  /**
   * list of supported actions
   */
  actions: [
    'open',
    'close',
    'stop'
  ]

  executeAction: NikoHomeControl['executeAction']

  constructor(executer, data, uid?) {
    super({
      ...data,
      position: Number(data.value1),
      uid
    })
    this.executeAction = executer
    
  }

  /**
   * open action
   * @returns value to pass to the controller
   */
  open() {
    this.executeAction(this.id, 255)
  }

  close() {
    this.executeAction(this.id, 254)
  }

  stop() {
    this.executeAction(this.id, 253)
  }

  /**
   * update state after the event comes in from the ui
   * @param state see niko-home-control
   */
  updateState(data: any): void {
    // super.updateState(data)
    if (data.isOpen) this.open()
    else this.close()
    if (data.position) this.position = data.value1
  }



    /**
     * tracks position change
     * should add moving/position behavior for cover entities that just support up/down (open/close)
     * @dev override if your integration has moving events integrated
     */
    // async trackPosition(position) {
    //   this.moving = true
    //   let trackTime = 5 * 60_000 // one minute


    //   const checkPosition = () => setTimeout(async () => {
    //     const actions = await easyHome.integrations['niko-home-control'].listActions()
    //     this.position = actions.data.filter(data => String(data.id) === String(this.id))[0]?.value1 || 0

    //     trackTime -= 1000
  
    //     if (trackTime === 0) return console.warning(`cover: ${this.uid} timedout`)
    //     if (position !== this.position) {
    //       return checkPosition()
    //     }
    //     this.moving = false
    //     this.position = position
    //     this.stop()
    //   }, 1000)

    //   this.open()
      
    //   return checkPosition()
    // }

  /**
   * update state after the event comes in from the controller
   */
  setState(data: any): void {
    super.setState(this.transform(data))
  }

  /**
   * transforms to easy-home readable properties
   * @param data {} integration specific data 
   * @returns 
   */
  transform(data: any): {position} {
    return {
      position: Number(data.value1)
    }
  }
}