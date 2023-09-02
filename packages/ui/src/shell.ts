import {LitElement, html, css, PropertyValueMap, nothing} from 'lit'

import '@vandeurenglenn/lit-elements/drawer-layout.js'
import '@vandeurenglenn/lit-elements/drawer-item.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/pages.js'
import '@vandeurenglenn/lit-elements/theme.js'
import '@vandeurenglenn/lit-elements/icon.js'

import '@vandeurenglenn/lit-elements/top-app-bar.js'

import '@material/web/fab/branded-fab.js'
import '@material/web/list/list-item.js'
import { MdDialog } from '@material/web/dialog/dialog.js'
import styles from './shell.css.js'
import { property, query } from 'lit/decorators.js'
import type { CustomDrawerLayout } from '@vandeurenglenn/lit-elements/drawer-layout.js'
import type Client from './client.js'
import { ContextProvider } from '@lit-labs/context'
import { Panels, PanelsContext } from './context/panels.js'
import { IntegrationConfigEntries, IntegrationsContext } from './context/integrations.js'
import { SupportedIntegrationsContext, SupportedIntegrations } from './context/supported-integrations.js'
import { map } from 'lit/directives/map.js'


// Todo: be lazy
import './elements/dialogs/setup.js'
import Router from './router.js'
import { IntegrationConfigEntry, IntegrationContext } from './context/integration.js'
import { Logs, LogsContext } from './context/logs.js'
import { Entities, EntitiesContext } from './context/entities.js'

export default class AppShell extends LitElement {
  client: Client
  router: Router

  @property({ type: Boolean, reflect: true })
  narrow: boolean

  @property({ type: Boolean, reflect: true })
  loading: boolean
  
  drawerLayout: CustomDrawerLayout

  keepClosed: boolean

  mainDrawerId: string

  /**
   * context Providers
   */
  #integrationsContextProvider = new ContextProvider(this, {context: IntegrationsContext});
  #supportedIntegrationsContextProvider = new ContextProvider(this, {context: SupportedIntegrationsContext});
  #panelsContextProvider = new ContextProvider(this, {context: PanelsContext});
  #integrationContextProvider = new ContextProvider(this, {context: IntegrationContext});
  #logsContextProvider = new ContextProvider(this, {context: LogsContext, initialValue: [] });
  #entitiesContextProvider = new ContextProvider(this, { context: EntitiesContext})

  set supportedIntegrations(value: typeof SupportedIntegrations) {
    this.#supportedIntegrationsContextProvider.setValue(value)
    this.#supportedIntegrationsContextProvider.updateObservers()
  }

  get supportedIntegrations() {
    return this.#supportedIntegrationsContextProvider.value
  }

  set integrations(value: IntegrationConfigEntries) {
    this.#integrationsContextProvider.setValue(value)
    this.#integrationsContextProvider.updateObservers()
  }

  get integrations() {
    return this.#integrationsContextProvider.value
  }

  set integration(value: IntegrationConfigEntry) {
    this.#integrationContextProvider.setValue(value)
    this.#integrationContextProvider.updateObservers()
  }

  get integration() {
    return this.#integrationContextProvider.value
  }

  set panels(value: Panels) {
    this.#panelsContextProvider.setValue(value)
    this.#panelsContextProvider.updateObservers()
  }

  get panels() {
    return this.#panelsContextProvider.value
  }

  set logs(value: Logs) {
    this.#logsContextProvider.setValue(value)
    this.#logsContextProvider.updateObservers()
  }

  get logs() {
    return this.#logsContextProvider.value
  }

  set entities(value: Entities) {
    this.#entitiesContextProvider.setValue(value)
    this.#entitiesContextProvider.updateObservers()
  }

  get entities() {
    return this.#entitiesContextProvider.value
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.drawerLayout = this.shadowRoot.querySelector('custom-drawer-layout')
    this.keepClosed = this.drawerLayout.keepClosed
    this.mainDrawerId = this.drawerLayout.mainDrawerId
    globalThis.contextProvider = this
  }


  get pages() {
    return this.renderRoot.querySelector('custom-pages')
  }

  get selector() {
    return this.renderRoot.querySelector('custom-selector')
  }

  #onEntityEvent(event) {
    const logs = this.logs

    logs.push(event)
    this.logs = logs
  }

  #onIntegrationEvent(event) {
    const logs = this.logs

    logs.push(event)
    this.logs = logs
  }

  #onEntityStateEvent = (event) => {
    console.log(event);
    const logs = this.logs

    logs.push(event)
    this.logs = logs
    
  }

  constructor() {
    super()
    // globalThis.onhashchange = this.#hashchange.bind(this)

    document.addEventListener('custom-theme-narrow', async ({detail}: CustomEvent) => {
      !this.hasUpdated && await this.updateComplete
      this.narrow = detail
      this.requestUpdate('narrow')
    })

    this.loading = true
  }

  #initClient = async () => {
    await this.client.init()
    this.client.pubsub.subscribe('integration-event', this.#onIntegrationEvent)
    this.client.pubsub.subscribe('entity-event', this.#onEntityEvent)
    this.client.pubsub.subscribe('entity-state-event', this.#onEntityStateEvent)
  }

  async connectedCallback() {
    super.connectedCallback();

    const Client = (await import('./client.js')).default
    this.client = new Client()
    globalThis.client = this.client
    await this.#initClient()
    pubsub.subscribe('reconnect-client', this.#initClient)

    this.router = new Router(this)
    this.loading = false
    if (!location.hash) location.hash = '#!/dashboard';

    const started = await this.client.started()
    console.log({started});
    
    if (!started) {
      this.client.pubsub.subscribe('easy-home-server-ready', async () => {

        this.entities = await this.client.entities()
        console.log({entities: this.entities});
      })
    } else {

      this.entities = await this.client.entities()
      console.log({entities: this.entities});
    };

    (async () => {
      const logs = await this.client.logs()
      
      this.logs = logs || []
    })();
  }

  async addIntegration({detail}) {
    console.log(detail);
    const setupDialog = this.shadowRoot.querySelector('setup-dialog')
    this.shadowRoot.querySelector('md-dialog.add-integration').open = false
    const setup = await this.client.getSetup(detail)
    console.log(setup);
    setupDialog.integration = detail
    setupDialog.setup = JSON.parse(setup)

    setupDialog.start()
    
  }

  static styles = styles

  render() {
    return html`
    <custom-icon-set>
      <template>
        <span name="browse_activity">@symbol-browse_activity</span>
        <span name="add">@symbol-add</span>
        <span name="error">@symbol-error</span>
        <span name="list">@symbol-list</span>
        <span name="start">@symbol-play_arrow</span>
        <span name="stop">@symbol-stop</span>
        <span name="change">@symbol-vital_signs</span>
        <span name="load">@symbol-sync_saved_locally</span>
        <span name="restart">@symbol-restart_alt</span>
        <span name="devices_other">@symbol-devices_other</span>
        <span name="home">@symbol-home</span>
        <span name="menu">@symbol-menu</span>
        <span name="info">@symbol-info</span>
        <span name="check_box">@symbol-check_box</span>
        <span name="menu_open">@symbol-menu_open</span>
        <span name="more_vert">@symbol-more_vert</span>
        <span name="close">@symbol-close</span>
        <span name="check_box_outline_blank">@symbol-check_box_outline_blank</span> 
        <span name="lightbulb">@symbol-lightbulb</span>
        <span name="settings">@symbol-settings</span>
        <span name="dashboard">@symbol-dashboard</span>
        <span name="info">@symbol-info</span>
        <span name="done">@symbol-done</span>
        <span name="model_training">@symbol-model_training</span>
        <span name="cloud_upload">@symbol-cloud_upload</span>
        <span name="cloud_sync">@symbol-cloud_sync</span>
        <span name="autoplay">@symbol-autoplay</span>
        <span name="roller_shades">@symbol-roller_shades</span>
        <span name="roller_shades_closed">@symbol-roller_shades_closed</span>
        <span name="filled_lightbulb">@filledsymbol-lightbulb</span>
      </template>
    </custom-icon-set>
    
    <custom-drawer-layout>

      <custom-top-app-bar type="small" slot="top-app-bar">
        <flex-row slot="start">
          <custom-drawer-button  .mobile=${this.narrow} .id=${this.mainDrawerId}>
            menu
          </custom-drawer-button>
        </flex-row>
          
      </custom-top-app-bar>

      <custom-selector
        attr-for-selected="name"
        slot="drawer-content"
        @selected=${({detail}) => location.hash = `#!/${detail}`}
      >
        <custom-drawer-item name="dashboard">
          <custom-icon slot="icon">dashboard</custom-icon>
          dashboard
        </custom-drawer-item>

        <custom-drawer-item name="integrations">
          <custom-icon slot="icon">devices_other</custom-icon>
          integrations
        </custom-drawer-item>
        

        <flex-it></flex-it>
        <custom-drawer-item name="logs">
          <custom-icon slot="icon">browse_activity</custom-icon>
          logs
        </custom-drawer-item>
        <custom-drawer-item name="settings">
          <custom-icon slot="icon">settings</custom-icon>
          settings
        </custom-drawer-item>
      </custom-selector>

        <custom-pages attr-for-selected="route">
          <dashboard-view route="dashboard"></dashboard-view>
          <integrations-view route="integrations"></integrations-view>
          <logs-view route="logs"></logs-view>
          <settings-view route="settings"></settings-view>
        </custom-pages>
    </custom-drawer-layout>

    <integration-dialog></integration-dialog>

    <setup-dialog></setup-dialog>

    <error-dialog></error-dialog>
    `
    // <img src="./assets/banner.jpg">
  }
}
customElements.define('app-shell', AppShell)