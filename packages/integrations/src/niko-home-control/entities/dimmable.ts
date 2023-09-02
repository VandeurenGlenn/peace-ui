import { Dimmable } from "@easy-home/entities";
import NikoHomeControl from "../niko-home-control.js";

/**
 * Representation of a niko home control light
 * 
 * @param data {data from controller}
 * @param uid unique id of the entity if it was added before
 */
export default class NikoHomeControlDimmable extends Dimmable() {
  /**
   * list of supported actions
   */
  actions: [
    'on',
    'off'
  ]

  executeAction: NikoHomeControl['executeAction']

  constructor(executer, data, uid?) {
    super({
      ...data,
      isOn: data.value1 > 0,
      brightness: data.value1,
      uid
    })
    this.executeAction = executer
  }

  /**
   * open action
   * @returns value to pass to the controller
   */
  on() {
    this.executeAction(this.id, 1)
  }

  off() {
    this.executeAction(this.id, 0)
  }

  /**
   * 
   * @param state see niko-home-control
   */
  updateState(data: any): void {
    super.updateState({
      brightness: data.value1,
      isOn: data.value1 > 0,
    })
  }
}