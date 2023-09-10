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

  protected willUpdate(_changedProperties) {
    if (!this.hasUpdated) return

    if (_changedProperties.has('position') && _changedProperties.get('position') !== this.position) {
      globalThis.client.pubsub.publish('entity-state-action', this.toJson())
    }

    if (_changedProperties.has('isOpen') && _changedProperties.get('isOpen') !== this.isOpen) {
      globalThis.client.pubsub.publish('entity-state-action', this.toJson())
    }
  }

  updateState(state: any): void {
    super.updateState(state)
  }

  #oninput = (event) => {
    if (this.timeout) clearTimeout(this.timeout)

    this.timeout =
      setTimeout(() => {
        this.position = Number(this.shadowRoot.querySelector('md-slider').value)
      }, 500)
  }

  render() {
    return html`
    <md-list-item headline=${this.name}>
      <flex-row slot="start" data-variant="icon">
      ${this.id}
      </flex-row>
      
      <flex-row slot="end">
      <md-slider labeled value=${this.position}
        @input=${this.#oninput}
        aria-label="${this.name} position, current  position ${this.position}"
      ></md-slider>
      <custom-toggle-button data-variant="button" @active=${({detail}) => this.isOpen = detail === 1 ? true : false} .active=${this.isOpen === true ? 1 : 0} togglers='["roller_shades_closed", "roller_shades"]'>
      </custom-toggle-button>
      </flex-row>
      
      
    </md-list-item>
    `;
  }
}