import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'
import '@vandeurenglenn/lit-elements/icon-button.js'
import '@vandeurenglenn/lit-elements/typography.js'

import '@material/web/dialog/dialog.js'
import { map } from 'lit/directives/map.js';
import { SupportedIntegrationsContext, SupportedIntegrations } from '../../context/supported-integrations.js';

@customElement('integration-dialog')
export class IntegrationDialog extends LitElement {

  @property({ type: Boolean })
  open: boolean

  @consume({ context: SupportedIntegrationsContext, subscribe: true})
  supportedIntegrations: typeof SupportedIntegrations

  static styles = [
    css`
      :host {
        display: contents
      }
    `
  ];

  async #addIntegration({detail}) {
    this.open = false
    const setupDialog = document.querySelector('app-shell').shadowRoot.querySelector('setup-dialog')
    
    const setup = await globalThis.client.getSetup(detail)
    console.log(setup);
    setupDialog.integration = detail
    setupDialog.setup = JSON.parse(setup)

    setupDialog.start()
    
  }

  render() {
    return html`
    <md-dialog class="add-integration" .open=${this.open}>
      <span slot="headline">select integration</span>
      <form id="form2" slot="content" method="dialog">
        <custom-selector @selected=${this.#addIntegration} attr-for-selected="integration">
          ${this.supportedIntegrations ? map(Object.entries(this.supportedIntegrations), integration => html`
            <custom-drawer-item form="form2" value="add-integration" integration=${integration[0]}>
              <img src=${integration[1].hasIcon ? `./assets/${integration[0]}.png` : `./assets/default.png`} alt="404" slot="icon"></img>
              ${integration[0]}
            </custom-drawer-item>
          `) : nothing}
        </custom-selector>
      </form>
    
    </md-dialog>
    `
  }
}
