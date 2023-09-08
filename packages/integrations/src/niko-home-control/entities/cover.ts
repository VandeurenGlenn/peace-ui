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
    super.updateState(data)
  }

  // temp override 
  trackPosition(position: any) {
    const getter = async () => {
      const actions = await easyHome.integrations['niko-home-control'].listActions()
      this.position = actions.data.filter(data => String(data.id) === this.id)[0]?.value1 || 0
    }
    super.trackPosition(position, getter)
    
  }

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