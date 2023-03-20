export default class NikoHomeControlLight {
  #executer;
  #on: boolean
  /**
   * min 0
   * max 255
   */
  #brightness: number;
  #id: string;
  
  constructor(executer, {id, data}) {
    this.#executer = executer
    this.#id = id
    this.#on = data > 0
    this.#brightness = data === 0 || data === 1 ? undefined : data
  }

  get state() {
    return this.#on ? 1 : 0
  }

  get id() { return this.#id }

  #execute() {
    this.#executer(this.id, this.#brightness || this.state)
  }

  on(brightness) {
    this.#on = true
    if (brightness !== undefined) this.#brightness = brightness
    this.#execute()
  }

  off() {
    this.#on = false
    this.#execute()
  }

  toggle() {
    this.#on = !this.#on
    this.#execute()
  }

  sync({id, data}) {
    const on = this.#on
    const brightness = this.#brightness

    this.#on = data > 0
    this.#brightness = data === 0 || data === 1 ? undefined : data

    if (on !== this.#on || brightness !== this.#brightness) this.#publishStateEvent()
  }

  #publishStateEvent() {
    globalThis.pubsub.publish('state-change', {
      id: this.id,
      state: this.state,
      brightness: this.#brightness
    })
  }
}