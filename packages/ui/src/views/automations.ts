import {LitElement, html, css, PropertyValueMap, nothing} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../elements/dashboard/panel.js'
import { consume } from '@lit-labs/context'
import { map } from 'lit/directives/map.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/dialog/dialog.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import { Automations, AutomationsContext } from '../context/automations.js'
import '../elements/items/integration.js'
import '../elements/dialogs/integration.js'
import '../elements/dialogs/setup.js'
import { MdDialog } from '@material/web/dialog/dialog.js'


declare global {
  interface HTMLElementTagNameMap {
    'automations-view': AutomationsView
  }
}

@customElement('automations-view')
export default class AutomationsView extends LitElement {
  @property({type: Object})
  @consume({ context: AutomationsContext, subscribe: true })
  automations: Automations
  
  
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

  #renderAutomations() {
    return html`
    ${map(Object.entries(this.integrations), ([key, integration]) => html`
      <automation-item img="./assets/${key}.png" name=${key} href="#!/automations/automation?selected=${key}"></automation-item>
    `)}
    `
  }
 
  get #dialog(): MdDialog {
    return document.querySelector('app-shell').shadowRoot.querySelector('automation-setup-dialog')
  }

  render() {
    return html`

    <flex-container>
      <custom-pages attr-for-selected="route">
        <flex-wrap-center route="integrations">
          ${this.automations ? this.#renderAutomations() : html`<busy-animation></busy-animation>`}

        </flex-wrap-center>

        <automation-view route="automation"></automation-view>
      </custom-pages>
    </flex-container>

    <md-branded-fab variant="primary" label="Add Automation" @click=${() => this.#dialog.show()}>
      <custom-icon slot="icon">add</custom-icon>
    </md-branded-fab>
    `
  }
}