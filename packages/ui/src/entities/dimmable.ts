import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Dimmable } from '@easy-home/entities'

class DimmableElement extends Dimmable(LitElement) {
  constructor(state = {}) {
    super(state)
  }

  @property({ type: Object})
  state

  @property({ type: String})
  name

  @property({ type: Boolean })
  isOn: boolean

  @property({ type: Number })
  brightness: number

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.get('brightness')) {
      // this.isOn = this.brightness > 0
    }
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.get('isOn')) {
      // this.isOn ? this.controller.turnOn(this.brightness) : this.controller.turnOff()
    }
  }

  static styles = [
    css`
      :host {
        display: contents;
      }
      custom-icon[on] {
        --custom-icon-color: yellow;
      }
      md-list-item {
        --md-list-item-container-shape: var(--md-sys-shape-corner-large);
      }
    `
  ]

  render() {
    return html`
      <md-list-item headline=${this.name}>
        <span slot="start" data-variant="icon">${this.id}</span>
        <custom-icon @click=${() => this.isOn = !this.isOn} slot="end" data-variant="button" ?on=${this.isOn}>lightbulb</custom-icon>
      </md-list-item>
    `;
  }
}
customElements.define('dimmable-element', DimmableElement)