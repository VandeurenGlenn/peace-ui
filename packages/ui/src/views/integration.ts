import {LitElement, html, css, PropertyValueMap, nothing} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../elements/dashboard/panel.js'
import { consume } from '@lit-labs/context'
import { map } from 'lit/directives/map.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/dialog/dialog.js'
import '@vandeurenglenn/flex-elements/container.js'
import { IntegrationConfigEntry, IntegrationContext } from '../context/integration.js'


declare global {
  interface HTMLElementTagNameMap {
    'integration-view': IntegrationView
  }
}

@customElement('integration-view')
export default class IntegrationView extends LitElement {
  @property({ type: Object })
  @consume({ context: IntegrationContext, subscribe: true })
  integration: IntegrationConfigEntry

  static styles = [css`
    :host {
      overflow-y: auto;
      height: 100%;
      width: 100%;
      display: flex;
      padding: 24px;
      padding-top: 48px;
      box-sizing: border-box;
    }

    .actions-container {
      padding-left: 24px;
    }
  `]
  
  render() {
    return html`
      <flex-container>
        <flex-row>
            <integration-item
              img="./assets/${this.integration?.name}.png"
              name=${this.integration?.name}
              no-elevation>
            </integration-item>
          <flex-column>

            ${this.integration?.deviceInfo ? map(Object.entries(this.integration.deviceInfo), ([prop, value]) => html`
              <flex-row>
                <custom-typography>prop</custom-typography>
                <flex-it></flex-it>
                <custom-typography>value</custom-typography>
              </flex-row>
            `) : ''}
          </flex-column>
        </flex-row>
        
        <flex-row class="actions-container">
        <md-outlined-button @click=${() => globalThis.client.restartIntegration(this.integration.name)}>
          <custom-icon slot="icon" icon="autoplay"></custom-icon>
          restart
        </md-outlined-button>

        <md-outlined-button @click=${() => globalThis.client.stopIntegration(this.integration.name)}>
          <custom-icon slot="icon" icon="stop"></custom-icon>
          stop
        </md-outlined-button>

        <md-outlined-button @click=${() => globalThis.client.startIntegration(this.integration.name)}>
          <custom-icon slot="icon" icon="start"></custom-icon>
          start
        </md-outlined-button>

        <flex-it></flex-it>

        <md-outlined-button @click=${() => globalThis.client.removeIntegration(this.integration.name)}>
          <custom-icon slot="icon" icon="delete"></custom-icon>
          remove
        </md-outlined-button>
      </flex-row>

      </flex-container>
      `
  }
}