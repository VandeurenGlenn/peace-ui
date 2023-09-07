import { LitElement, PropertyValueMap, ReactiveElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Dimmable } from '@easy-home/entities'
import '@vandeurenglenn/lit-elements/toggle-button.js'
import '@material/web/slider/slider.js'

class DimmableElement extends Dimmable(LitElement) {
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

  @property({ type: Number })
  brightness: number

  protected willUpdate(_changedProperties) {
    if (!this.hasUpdated) return
    
    if (_changedProperties.has('isOn') && _changedProperties.get('isOn') !== this.isOn) {
      globalThis.client.pubsub.publish('entity-state-action', this.toJson())
    }

    if (_changedProperties.has('brightness') && _changedProperties.get('brightness') !== this.brightness) {
      globalThis.client.pubsub.publish('entity-state-action', this.toJson())
    }
  }

  #oninput = (event) => {
    this.brightness = event.target.value
  }

  updateState(state: any): void {
    this.isOn = state.isOn
    this.brightness = state.brightness
    // super.updateState(state)
  }

  static styles = [
    css`
      :host {
        display: contents;
      }
      custom-toggle-button[value="1"] custom-icon {
        --custom-icon-color: yellow;
        color: yellow;
      }
      md-list-item {
        --md-list-item-container-shape: var(--md-sys-shape-corner-large);
      }
    `
  ]

  render() {
    return html`
      <md-list-item headline=${this.name}>
        <flex-row slot="start" data-variant="icon">
        ${this.id}
        </flex-row>
        
        <flex-row slot="end">
        <md-slider 
          labeled
          value=${this.brightness}
          @input=${this.#oninput}
          aria-label="${this.name} brightness, current  brightness ${this.brightness}"
        ></md-slider>
        <custom-toggle-button data-variant="button" @active=${({detail}) => this.isOn = detail === 1 ? true : false} .active=${this.isOn === true ? 1 : 0} togglers='["lightbulb", "filled_lightbulb"]'>
        </custom-toggle-button>
        </flex-row>
        
        
      </md-list-item>
    `;
  }
}
customElements.define('dimmable-element', DimmableElement)