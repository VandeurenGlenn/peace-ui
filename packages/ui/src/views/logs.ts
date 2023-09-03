import {LitElement, html, css, PropertyValueMap, nothing} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../elements/dashboard/panel.js'
import { consume } from '@lit-labs/context'
import { map } from 'lit/directives/map.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/list/list-item.js'
import '@material/web/divider/divider.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/wrap-center.js'
import { Logs, LogsContext } from '../context/logs.js'
import '../elements/log/entity-log.js'
import '../elements/log/integration-log.js'
import type { ErrorDialog } from './../elements/dialogs/error.js'
import './../elements/dialogs/error.js'


declare global {
  interface HTMLElementTagNameMap {
    'logs-view': LogsView
  }
}

@customElement('logs-view')
export default class LogsView extends LitElement {
  @property({type: Array})
  @consume({ context: LogsContext, subscribe: true })
  logs: Logs
  
  
  static styles = [css`
    :host {
      overflow-y: auto;
      height: 100%;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      justify-content: center;
    }

    flex-container {
      width: 100%;
    }
    header {
      width: 100%;
      border-radius: var(--md-sys-shape-corner-extra-large);
      padding: 56px;
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      margin-bottom: 56px;
      box-sizing: border-box;

      --custom-icon-size: 100px;
    }

    md-divider {
      min-height: 1px;
    }
    
  `]

  get #errorDialog() {
    return document.querySelector('app-shell').shadowRoot.querySelector('error-dialog') as ErrorDialog
  }

  #click(event) {
    const target = event.composedPath()
      .filter(target => target.localName === 'integration-log' || target.localName === 'entity-log')[0]
    
    console.log(target);
    if (target.localName === 'integration-log') {
      if (target.log.type === 'error') {
        let message = target.log.message

        if (!message && target.log.error.syscall) {
          message = `${target.log.error.syscall}: ${target.log.error.code} ${target.log.error.address}:${target.log.error.port}`
        } else {
          message = target.log.error.code
        }
        this.#errorDialog.name = target.log.integration
        this.#errorDialog.timestamp = target.log.timestamp
        this.#errorDialog.message = message
        this.#errorDialog.open = true
      }
      
    }
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.#click)
  }

  #renderLog(log) {
    if (log.entity) {
      return html`<entity-log .log=${log} title="entity event"></entity-log>`
    } else if (log.integration) {
      return html`<integration-log .log=${log} title="integration event"></integration-log>`
    }
    return JSON.stringify(log)
    
    
  }
  render() {
    return html`
      <flex-container>

      <custom-typography type="display">
        <header>
          <flex-row center>
            <custom-icon>list</custom-icon>
            Logs
          </flex-row>
        </header>
      </custom-typography>
        ${map(this.logs, (log) => html`
          ${this.#renderLog(log)}
          <md-divider></md-divider>
        `)}
      </flex-container>
    
      `
  }
}