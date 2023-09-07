import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import '@vandeurenglenn/lit-elements/toggle-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { Light } from '@easy-home/entities'

@customElement('light-element')
class LightEl extends Light(LitElement) {
  controller

  constructor(state = {}) {
    super(state)
  }
  @property({ type: String, reflect: true })
  uid

  @property({ type: Object})
  state

  @property({ type: String})
  name

  @property({ type: Boolean })
  isOn: boolean

  protected willUpdate(_changedProperties) {
    if (_changedProperties.has('isOn') && _changedProperties.get('isOn') !== this.isOn && this.hasUpdated) {
      globalThis.client.pubsub.publish('entity-state-action', this.toJson())
    }
  }

  updateState(state: any): void {
    super.updateState(state)
  }

  render() {
    return html`
    <md-list-item headline=${this.name}>
      <flex-row slot="start" data-variant="icon">
      ${this.id}
      </flex-row>
      
      <flex-row slot="end">
      <custom-toggle-button data-variant="button" @active=${({detail}) => this.isOn = detail === 1 ? true : false} .active=${this.isOn === true ? 1 : 0} togglers='["lightbulb", "filled_lightbulb"]'>
      </custom-toggle-button>
      </flex-row>
      
      
    </md-list-item>
    `;
  }
}

export { LightEl }