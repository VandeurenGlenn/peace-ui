import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js'
import '@material/web/elevation/elevation.js'

import '@vandeurenglenn/lit-elements/typography.js'

@customElement('integration-item')
export class IntegrationItem extends LitElement {
  @property({ type: String })
  img: string

  @property({ type: String })
  name: string

  @property({ type: String })
  href: string

  @state()
  formattedName: string

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('name')) {
      let name = this.name
      this.formattedName = name
        .replace(name.charAt(0), ($1) => $1.toUpperCase())
        .replace(/(?:\-)\w/g, ($1, $2) => $1.replace('-', ' ').toUpperCase())
    }
  }

  static styles = [
    css`
      :host {
        display: block;
        position: relative;
        height: 224px;
        width: 204px;
        border-radius: var(--md-sys-shape-corner-large);
        cursor: pointer;
        background: var(--md-sys-color-surface-variant);
        color: var(--md-sys-color-on-surface-variant);
      }

      md-elevation {
        --md-elevation-level: 1;
      }

      :host():not([no-elevation]) md-elevation {
        --md-elevation-level: 0;
      }

      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        text-decoration: none;
        color: inherit;
      }

      img {
        width: 160px;
        margin-bottom: 12px;
        border-radius: var(--md-sys-shape-corner-large);
      }
    `
  ];

  render() {
    return html`
      <md-elevation></md-elevation>
      <a href=${this.href}>
        <img src=${this.img} alt="./assets/default.png"/>
        <flex-it></flex-it>
        <custom-typography size="medium">
          <span>
          ${this.formattedName}
          </span>
        </custom-typography>
    </a>
    `;
  }
}
