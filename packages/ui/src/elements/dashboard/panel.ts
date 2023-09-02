import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js';
import { EntitiesContext } from '../../context/entities.js';
import { consume } from '@lit-labs/context';
import type { Cover, Entities, Light } from '@easy-home/types';
import './panel-card.js';
import '@vandeurenglenn/flex-elements/wrap-center.js'

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-panel': DashboardPanel
  }
}

@customElement('dashboard-panel')
export class DashboardPanel extends LitElement {
  @consume({context: EntitiesContext, subscribe: true})
  set entities(value: Entities) {
    console.log(value);
    
    const lights = []
    const covers = []
    if (value) {
      for (const [integration, entities] of Object.entries(value)) {
        
        console.log(entities);
        
        // @ts-ignore
        for (const entity of entities) {
          if (entity.type === 'light' || entity.type === 'dimmable') lights.push(entity)
          if (entity.type === 'cover') covers.push(entity)
        }
      }
    }

    this.lights = lights
    this.covers = covers
    
  }

  @property({ type: Array})
  lights: Light[] = []

  @property({ type: Array})
  covers: Cover[] = []

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

    `
  ];

  #renderLights() {
    return this.lights?.length > 0 ? html`
      <dashboard-panel-card headline="lights">
        ${map(this.lights, item => html`
          ${item.type === 'dimmable' ? html`
            <dimmable-element
              .id=${item.id}
              .uid=${item.uid}
              .isOn=${item.isOn}
              .name=${item.name}
              .device-info=${item.deviceInfo}
              .brightness=${item.brightness}
              >
            </dimmable-element>
          ` : html`
            <light-element
              .id=${item.id}
              .uid=${item.uid}
              .name=${item.name}
              .device-info=${item.deviceInfo}
              .isOn=${item.isOn}>
            </light-element>
          `}
      `)}
      </dashboard-panel-card>
    ` : nothing
  }

  #renderCovers() {
    return this.covers?.length > 0 ? html`
      <dashboard-panel-card headline="covers">
        ${map(this.covers, item => html`
          <cover-element
          .id=${item.id}
          .uid=${item.uid}
          .isOpen=${item.isOpen}
          .name=${item.name}
          .device-info=${item.deviceInfo}
          .brightness=${item.position}>
        </cover-element>
      `)}
      </dashboard-panel-card>
    ` : nothing
  }

  render() {
    return html`
    <flex-wrap-center>
      ${this.#renderLights()}
      ${this.#renderCovers()}
    </flex-wrap-center>
    `;
  }
}
