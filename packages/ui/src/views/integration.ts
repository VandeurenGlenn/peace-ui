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
  `]
  
  render() {
    return html`
      <flex-container>
        <integration-item
          img="./assets/${this.integration.name}.png"
          name=${this.integration.name}
          no-elevation>
        </integration-item>
      </flex-container>
      `
  }
}