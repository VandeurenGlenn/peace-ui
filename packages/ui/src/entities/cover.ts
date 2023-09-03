import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import '@vandeurenglenn/lit-elements/toggle-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { Cover } from '@easy-home/entities'

@customElement('cover-element')
class CoverEl extends Cover(LitElement) {

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
  isOpen: boolean

  @property({ type: Number })
  position: number

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
      <md-slider labeled value=${this.brightness}
        aria-label="${this.name} brightness, current  brightness ${this.brightness}"
      ></md-slider>
      <custom-toggle-button data-variant="button" @active=${({detail}) => this.isOn = detail === 1 ? true : false} .active=${this.isOn === true ? 1 : 0} togglers='["roller_shades_closed", "roller_shades"]'>
      </custom-toggle-button>
      </flex-row>
      
      
    </md-list-item>
    `;
  }
}