import { LitElement, PropertyValueMap, html } from "lit";
import { property } from "lit/decorators.js";
import '@vandeurenglenn/lit-elements/toggle-button.js'
import '@vandeurenglenn/lit-elements/icon.js'

class Light extends LitElement {
  controller

  constructor(controller, state) {
    super()
    this.controller = controller
  }

  @property({ type: Boolean, reflect: true, attribute: 'is-on' })
  isOn: boolean

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.get('isOn')) {
      this.isOn ? this.controller.turnOn() : this.controller.turnOff()
    }
  }

  render() {
    return html`
      <custom-toggle-button>
        <custom-icon>lightbulb</custom-icon>
        <custom-icon>lightbulb</custom-icon>
      </custom-toggle-button>
    `;
  }
}

export { Light }