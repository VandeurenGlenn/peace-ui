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
import '../ux/till-done.js'
import 'web-time-picker/dist/time-picker.js'

@customElement('automation-setup-dialog')
export class AutomationSetupDialog extends LitElement {
  @state()
  config

  @property({ type: Boolean })
  open: boolean

  @query('custom-pages')
  pages

  @property({ type: Number })
  step: number

  @property({ type: Array })
  entities: []

  async show() {
    this.shadowRoot.querySelector('md-dialog').show()
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

      md-list-item {
        width: 100%;
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

      time-picker.picker-opened {
        position: fixed;
      }
      
    `
  ];

  next() {
    if (this.pages.selected === 'entities' || this.pages.selected === 0) {
      if (this.selected === 'lights' || this.selected === 'covers' || this.selected === undefined) {
        this.title = 'select entities'
        const entities = document.querySelector('app-shell').entities
        this.entities = []
        const target = this.selected === 'covers' ? 'cover' : 'light'

        for (const items of Object.values(entities)) {

          this.entities = [...this.entities, ...items.filter(item => {
            if (target === 'light' && item.type === 'dimmable') {
              return true
            }
            return item.type===target
          })]
        }

        this.requestUpdate('entities')
      } else if (this.pages.selected === 'actions') {

      }

      console.log(this.entities);
      this.pages.select('entity')  
    }

    
    
  }

  #selectAll(event) {
    console.log(this.pages.selected);
      const items = Array.from(this.pages.querySelector(`[name=${this.pages.selected}]`).querySelectorAll('md-checkbox'))
console.log(items);

      for (const item of items) {
        item.checked = event.target.checked
      }
  }

  #onSelect = ({detail}) => {
    this.selected = detail
  } 
  render() {
    return html`
    <md-dialog .open=${this.open}>
      ${this.pages?.selected === 'entity' ? html`
      <flex-row slot="headline" style="padding-bottom: 12px">
        <custom-typography>
          <span>select all</span>
        </custom-typography>
        
        <flex-it></flex-it>
        <md-checkbox @change=${this.#selectAll}></md-checkbox>
      </flex-row>
      ` : nothing}
      
      <md-list-item headline="">
        <md-checkbox slot="end"></md-checkbox>
      </md-list-item>
      
      <form slot="content">
          <custom-pages style="height: 100%;" attr-for-selected="name">
            <custom-selector name="entities" @selected=${this.#onSelect}>
              <custom-drawer-item name="lights">
                <custom-icon slot="icon">lightbulb</custom-icon>
                lights
              </custom-drawer-item>

              <custom-drawer-item name="covers">
                <custom-icon slot="icon">roller_shades</custom-icon>
                covers
              </custom-drawer-item>
            </custom-selector>

            <section name="entity">

              
              
              ${map(this.entities, entity => html`
                <md-list-item headline=${entity.name}>
                  <md-checkbox slot="end" data-variant="button"></md-checkbox>
                </md-list-item>
              `)}
            </section>

            <section name="actions">
              
            </section>

            <section name="action">
            
              <time-picker></time-picker>
              <h1>t</h1>
            </section>
          </custom-pages>
        </form>
          

        <flex-row slot="actions">
          <md-filled-tonal-button @click=${this.next}>next</md-filled-tonal-button>
          
        </flex-row>
      }
      
    </md-dialog>
    `;
  }
}
