import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import '../time/time-ago.js'

@customElement('entity-log')
export class EntityLog extends LitElement {
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
    <md-list-item headline=${this.log.integration ? `${this.log.integration}.${this.log.entity.type}.${this.log.entity.name}` : this.log.entity}>
      ${this.#renderIcon()}
    
    
        <time-ago slot="end" style="margin-right: 12px;" .value="${this.log?.timestamp}"></time-ago>
      
      
      <flex-row>
        <custom-typography>
          <flex-row>
            <span class="property">id: </span>
            ${this.log.entity.id}
          </flex-row>
        </custom-typography>
        
      </flex-row>
      </md-list-item>
    `;
  }
}
