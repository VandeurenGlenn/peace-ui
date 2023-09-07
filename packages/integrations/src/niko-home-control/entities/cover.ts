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
      position: data.value1,
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
   * update state after the event comes in from the controller
   * @param state see niko-home-control
   */
  updateState(data: any): void {
    super.updateState({
      position: data.value1
    })
  }
}