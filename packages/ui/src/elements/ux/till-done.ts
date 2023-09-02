import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js'

@customElement('till-done')
export class TillDone extends LitElement {

  @property({ type: String, attribute: 'before-action' })
  beforeAction: string

  @property({ type: String, attribute: 'while-action' })
  whileAction: string

  @property({ type: String, attribute: 'after-action' })
  afterAction: string

  static styles = [
    css`
      :host {
        display: flex;
        position: relative;
        height: 100%;
      }

      busy-animation {
        padding-left: 12px;
      }

      custom-pages {
        height: 100%;
        width: 200px;
      }
    `
  ];

  get pages() {
    return this.shadowRoot.querySelector('custom-pages')
  }

  async done() {
    this.pages.select('after')
  }

  async busy() {
    this.pages.select('while')
  }

  render() {
    return html`
    <custom-pages attr-for-selected="route">
      ${this.beforeAction ? 
      html`
      <div route="before">
        <flex-row center>
          <custom-typography size="medium" type="body">
          <span>${this.beforeAction}</span>
          </custom-typography>
          <busy-animation></busy-animation>
        </flex-row>
      </div>` : nothing
      }
      
      <div route="while">
        <flex-row center>
          <custom-typography size="medium" type="body">
            <span>${this.whileAction}</span>
          </custom-typography>
          <busy-animation></busy-animation>
        </flex-row>
      </div>

      <flex-row center route="after">
        <custom-typography size="medium" type="body">
          <span>${this.afterAction}</span>
        </custom-typography>
        <custom-icon>done</custom-icon>
      </flex-row>
    </custom-pages>
    `;
  }
}
