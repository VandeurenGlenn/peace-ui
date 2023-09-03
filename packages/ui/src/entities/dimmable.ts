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
    console.log(_changedProperties.get('isOn') !== this.isOn);
    
    if (_changedProperties.has('isOn') && _changedProperties.get('isOn') !== this.isOn && this.hasUpdated) {
      globalThis.client.pubsub.publish('entity-state-action', this.toJson())
    }
  }

  action() {
    globalThis.client.pubsub.publish('entity-state-action', this.toJson())
  }
  // protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
  //   if (_changedProperties.get('isOn')) {
  //     await this.shadowRoot.querySelector('custom-toggle-button').updateComplete
  //     await this.shadowRoot.querySelector('custom-toggle-button').active = this.isOn ? 1 : 0
  //     // this.isOn ? this.controller.turnOn(this.brightness) : this.controller.turnOff()
  //   }
  // }

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
        <md-slider labeled value=${this.brightness}
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