import {LitElement, html, css, PropertyValueMap, nothing} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../elements/dashboard/panel.js'
import { consume } from '@lit-labs/context'
import { map } from 'lit/directives/map.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/dialog/dialog.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import { IntegrationConfigEntries, IntegrationsContext } from '../context/integrations.js'
import { SupportedIntegrationsContext, SupportedIntegrations } from '../context/supported-integrations.js'
import './../elements/items/integration.js'
import './../elements/dialogs/integration.js'
import './../elements/dialogs/setup.js'
import { MdDialog } from '@material/web/dialog/dialog.js'


declare global {
  interface HTMLElementTagNameMap {
    'integrations-view': IntegrationsView
  }
}

@customElement('integrations-view')
export default class IntegrationsView extends LitElement {
  @property({type: Object})
  @consume({ context: IntegrationsContext, subscribe: true })
  integrations: IntegrationConfigEntries

  @property({type: Object})
  @consume({ context: SupportedIntegrationsContext, subscribe: true })
  supportedIntegrations: typeof SupportedIntegrations
  
  
  static styles = [css`
    :host {
      overflow-y: auto;
      height: 100%;
      width: 100%;
      display: flex;
      padding: 24px;
      padding-top: 48px;
      box-sizing: border-box;
      justify-content: center;
    }


    md-branded-fab {
      position: absolute;
      bottom: 24px;
      right: 24px;
    }
  `]

  select(route) {
    this.shadowRoot.querySelector('custom-pages').select(route)
  }

  #renderIntegrations() {
    return html`
    ${map(Object.entries(this.integrations), ([key, integration]) => html`
      <integration-item img="./assets/${key}.png" name=${key} href="#!/integrations/integration?selected=${key}"></integration-item>
    `)}
    `
  }
 
  get #dialog(): MdDialog {
    return document.querySelector('app-shell').shadowRoot.querySelector('integration-dialog')
  }

  render() {
    return html`

    <flex-container>
      <custom-pages attr-for-selected="route">
        <flex-wrap-center route="integrations">
          ${this.integrations && this.supportedIntegrations ? this.#renderIntegrations() : html`<busy-animation></busy-animation>`}

        </flex-wrap-center>

        <integration-view route="integration"></integration-view>
      </custom-pages>
    </flex-container>

    <md-branded-fab variant="primary" label="Add Integration" @click=${() => this.#dialog.open = true}>
      <custom-icon slot="icon">add</custom-icon>
    </md-branded-fab>
    `
  }
}