import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js';
import type { Panel } from '../../context/panels.js';
import '@vandeurenglenn/lit-elements/toggle-button.js'

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-panel-card': DashboardPanelCard
  }
}

@customElement('dashboard-panel-card')
export class DashboardPanelCard extends LitElement {

  @property({ type: Object})
  panel: Panel

  @property()
  headline: string

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
        min-width: 300px;
        height: 100%;
        max-height: 480px;
        padding: 12px;
        box-sizing: border-box;
        border: 1px solid var(--md-sys-color-outline-variant);
        margin: 12px;
        border-radius: var(--md-sys-shape-corner-extra-large);
      }

      @media(min-width: 1020px) {
        :host {
          max-width: calc(100% / 2 - 24px);
        }
      }

      .header {
        display: flex;
        border-radius: var(--md-sys-shape-corner-large);
        box-sizing: border-box;
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface-container-high);

        padding: 24px;
        margin-bottom: 24px;  
      }

      flex-container {
        overflow-y: auto;
      }
    `
  ];

  render() {
    return html`
    <flex-row class="header">
      <custom-typography>
        <span>${this.headline}</span>
      </custom-typography>
      <flex-it></flex-it>
        <custom-icon>lightbulb</custom-icon>
    </flex-row>
    <flex-container>
      <slot></slot>
    </flex-container>
    `;
  }
}
