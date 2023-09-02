import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import '../time/time-ago.js'

@customElement('integration-log')
export class IntegrationLog extends LitElement {
  @property({ type: Object })
  log
  type: 'error' | 'log' = 'log'
  event: 'add' | 'remove' | 'start' | 'stop' | 'restart' | 'log' = 'log'
  
  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    `
  ];

  #renderIcon() {
    return html`
    <custom-icon
      slot="start"
      data-variant="icon"
      title=${this.log.type}
      .icon=${this.log.type}>
    </custom-icon>
    `
  }

  render() {
    return html`
    <md-list-item headline=${this.log.integration}>
      ${this.#renderIcon()}
      
      <time-ago style="margin-right: 12px;" slot="end" .value="${this.log?.timestamp}"></time-ago>
        


      </md-list-item>
      
    `;
  }
}
