import {LitElement, html, css, PropertyValueMap} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './../elements/dashboard/panel.js'
import { consume } from '@lit-labs/context'
import { Panels, PanelsContext } from '../context/panels.js'
import { map } from 'lit/directives/map.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/dialog/dialog.js'
import '@vandeurenglenn/lit-elements/typography.js'

import './../entities/dimmable.js'
import './../entities/light.js'
import './../entities/cover.js'
import { MdDialog } from '@material/web/dialog/dialog.js'
declare global {
  interface HTMLElementTagNameMap {
    'dashboard-view': DashboardView
  }
}

@customElement('dashboard-view')
export default class DashboardView extends LitElement {
  @property({type: Array})
  // @consume({ context: PanelsContext, subscribe: true })
  panels = [{
    name: 'default',
    items: []
  }]
  
  static styles = [
    css`
    :host {
      overflow-y: auto;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      padding-top: 48px;
      box-sizing: border-box;
    }

    section {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    }


    md-branded-fab {
      position: absolute;
      bottom: 24px;
      right: 24px;
      z-index: 1001;
    }
  `]

  #renderPanels() {
    return html`
      ${map(this.panels, (panel, i) => html`
      <dashboard-panel .panel=${panel} name=${panel.name}></dashboard-panel>
      `)}
    `
  }

  get #dialog(): MdDialog {
    return document.querySelector('app-shell').shadowRoot.querySelector('md-dialog')
  }

  render() {
    return html`
      <custom-pages attr-for-selected="name">
      ${this.panels ? this.#renderPanels() : html`<busy-animation></busy-animation>`}
      </custom-pages>

      <md-branded-fab variant="primary" label="Add Panel">
        <custom-icon slot="icon">add</custom-icon>
      </md-branded-fab>
      `
  }
}