import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'

import '@vandeurenglenn/lit-elements/icon.js'
import '@material/web/dialog/dialog.js'
import '@material/web/button/filled-tonal-button.js'

@customElement('error-dialog')
export class ErrorDialog extends LitElement {

  static styles = [
    css`
      :host {
        display: contents
      }

      form {
        display: flex;
        flex-direction: column;
      }

      .timestamp {
        margin-bottom: 12px;
      }
    `
  ];

  @property({ type: Boolean })
  open: boolean = false

  @property({ type: String })
  name: string

  @property({ type: String })
  message: string

  @property({ type: String })
  timestamp: string

  render() {
    return html`
    <md-dialog .open=${this.open}>
        <flex-row slot="headline">
          ${this.name}
          <flex-it></flex-it>
          <custom-icon icon="error"></custom-icon>
        </flex-row>
        <form slot="content">
          <span class="timestamp">
            ${new Date(this.timestamp).toLocaleString()}
          </span>
          ${this.message}
        </form>
          

        <flex-row slot="actions">
          <md-filled-tonal-button @click=${() => this.open = false}>
            ok
          </md-filled-tonal-button>
        </flex-row>
      
    </md-dialog>
    `;
  }
}
