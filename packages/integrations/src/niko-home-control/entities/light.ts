import { Light } from "@easy-home/entities";
import NikoHomeControl from "./../niko-home-control.js";

/**
 * Representation of a niko home control light
 * 
 * @param data {data from controller}
 * @param uid unique id of the entity if it was added before
 */
export default class NikoHomeControlLight extends Light() {
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
      value: data.value1,
      isOn: data.value1 > 0,
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
    this.isOn = data.value1 > 0
  }
}