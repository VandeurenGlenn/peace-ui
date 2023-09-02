import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js'
import { IntegrationSetup } from '@easy-home/types';

import '@vandeurenglenn/lit-elements/icon-button.js'
import '@vandeurenglenn/lit-elements/typography.js'

import '@material/web/dialog/dialog.js'
import '@material/web/button/outlined-button.js'
import '@material/web/textfield/filled-text-field.js'
import { map } from 'lit/directives/map.js';
import '@material/web/checkbox/checkbox.js'
import type { MdFilledTextField } from '@material/web/textfield/filled-text-field.js';
import '../../animations/busy.js';
import './../ux/till-done.js'

@customElement('setup-dialog')
export class SetupDialog extends LitElement {
  @state()
  config

  @property({ type: Boolean })
  open: boolean

  @query('custom-pages')
  pages

  @property({ type: Number })
  step: number

  @property({ type: String })
  integration: string

  _setup: IntegrationSetup

  @property({ type: Object })
  set setup(value: IntegrationSetup) {
    this._setup = value
    this.step = 0
    this.requestUpdate('setup')
  }
 
  get setup() {
    return this._setup
  }

  async next() {
    await globalThis.client.validateSetupStep()
  }

  start() {
    this.config = {}
    this.open = true
  }

  static styles = [
    css`
      :host {
        display: contents
      }

      section {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        flex: 1;
        align-items: center;
      }

      flex-column {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 0 24px;
      }

      md-filled-text-field {
        width: 100%;
      }

      custom-pages {
        height: 100%;
        display: contents;
        position: initial
      }

      form, section {
        min-height: 244px;
      }

      md-filled-text-field {
        margin: 16px 0;
      }

      till-done {
        margin: 6px;
      }
      
    `
  ];

  get hasNext() {
    return this.step < this._setup.entries.length - 1
  }

  #reset() {
    this.step = 0
    
    this.pages.select('0')
    this.config = {}
  }

  #restart = async () => {
    try {
      this.#reset()
      await globalThis.client.removeIntegration(this.integration)
    } catch (error) {
      prompt(error)
    }
  }

  #done = async () => {
    this.#reset()
    this.open = false
  }

  #lastStep = async () => {
    await this.updateComplete
    let add = await globalThis.client.addIntegration(this.integration, this.config)
    // Todo: is this really needed? already validating the steps
    if (add.errors) {
      for (const error of add.errors) {
        prompt(error)
      }
      return
    }
    console.log(add);
    let el = this.renderRoot.querySelector('[while-action="Adding"]')
    el.done()

    el = this.renderRoot.querySelector('[while-action="Loading"]')
    el.busy()

    let load = await globalThis.client.loadIntegration(this.integration)
    // Todo: is this really needed? already validating the steps
    if (load.errors) {
      for (const error of add.errors) {
        prompt(error)
      }
      return
    }
    el.done()

    el = this.renderRoot.querySelector('[while-action="Starting"]')
    el.busy()

    let start = await globalThis.client.startIntegration(this.integration)
    // Todo: is this really needed? already validating the steps
    if (start.errors) {
      for (const error of add.errors) {
        prompt(error)
      }
      return
    }
    el.done()
  }

  #next = async () => {
    await this.updateComplete
    try {
      const selected = this.shadowRoot.querySelector('.custom-selected')
      for (const el of Array.from(selected.querySelectorAll('md-filled-text-field'))) {
        this.config[el.name] = el.value
      }

      for (const el of Array.from(selected.querySelectorAll('md-checkbox'))) {
        this.config[el.name] = el.checked
      }
      
      const result = await globalThis.client.validateSetupStep(this.integration, this.step, this.config)
      console.log(result);
      
      if (result.errors) {
        for (const error of result.errors) {
          const parts = error.split(':')
          const el = this.shadowRoot.querySelector(`[name=${parts[0]}]`) as MdFilledTextField
    
          el.error = true
          el.errorText = parts.length > 1 ? parts[1] : error
        }
        return
      }
      
      if (this.step < this._setup.entries.length - 2) {
        this.step += 1
        this.pages.next()
      } else {
        this.step += 1
        this.#lastStep()
        this.pages.next()
      }
    } catch (error) {
      if (error === `coudn't send request to undefined, no open connection found.`) return pubsub.publish('reconnect-client', true)

      if (Array.isArray(error)) {
        for (const message of error) {
          const parts = message.split(':')
          const el = this.shadowRoot.querySelector(`[name=${parts[0]}]`) as MdFilledTextField
    
          el.error = true
          el.errorText = parts.length > 1 ? parts[1] : error
        }
      }
      
    }
  }

  render() {
    return html`
    <md-dialog .open=${this.open}>
      ${this.setup ?
        html`
        <flex-row slot="headline">
          ${this.setup.name}
          ${this.setup.info ? html`<flex-it></flex-it><custom-icon-button href=${this.setup.info} icon="info"></custom-icon-button>` : nothing}
        </flex-row>
        <form slot="content">
          <custom-pages style="height: 100%;" attr-for-selected="step">
            ${this.setup ? 
              map(this.setup.entries, (entry, i) => html`
                  <section step=${i}>
                    <flex-column>
                    ${i === this.setup.entries.length - 1 ? html`

                      <custom-typography size="large" type="title">
                        <span>Almost done!</span>
                      </custom-typography>
                      <flex-it></flex-it>
                      
                      <flex-row center>
                        <custom-icon>cloud_upload</custom-icon>
                        <till-done while-action="Adding" after-action="Added"></till-done>
                      </flex-row>

                      <flex-row center>
                        <custom-icon>cloud_sync</custom-icon>
                        <till-done before-action="Waiting till added" while-action="Loading" after-action="Loaded"></till-done>
                      </flex-row>

                      <flex-row center>
                        <custom-icon>autoplay</custom-icon>
                        <till-done before-action="Waiting till loaded" while-action="Starting" after-action="Started"></till-done>
                      </flex-row>
                     
                      <flex-it></flex-it>

                      <custom-typography size="medium" type="title">
                        <span>Options</span>
                      </custom-typography>

                      ${entry.options ? map(entry.options, option => html`
                      
                      <label style="display: flex; align-items: center;justify-content: center;">
                        <md-checkbox touch-target="wrapper" name=${option.name} .checked=${option.enabled}></md-checkbox>
                        <custom-typography size="large" type="label"><span>${option.description}</span></custom-typography>
                      </label>
                    `): nothing}

                    ` : 
                    entry.options ? map(entry.options, option => html`
                  
                      <label style="display: flex; align-items: center;justify-content: center;">
                        <md-checkbox touch-target="wrapper" .checked=${option.enabled}></md-checkbox>
                        <custom-typography size="large" type="label"><span>${option.name}</span></custom-typography>
                      </label>
                    `): nothing}
                    ${entry.inputs ? map(entry.inputs, input =>html`
                    ${input.description ? html`
                      <custom-typography size="large" type="title">${input.description}</custom-typography>
                    ` : nothing}
                      <md-filled-text-field name=${input.name} placeholder=${input.name} value=${input.value}></md-filled-text-field>
                    `) : nothing}
                    </flex-column>
                  </section>
              `) :
              nothing
            }
          </custom-pages>
        </form>
          

        <flex-row slot="actions">
          ${!this.hasNext ? html`<md-outlined-button @click=${this.#restart}>restart</md-outlined-button>` : nothing}
          <md-filled-tonal-button @click=${this.hasNext ? this.#next : this.#done}>${this.hasNext ? 'next' : 'done'}</md-filled-tonal-button>
          
        </flex-row>
        ` : nothing
      }
      
    </md-dialog>
    `;
  }
}
