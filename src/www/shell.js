import {LitElement, html, css} from 'lit'
import 'custom-svg-iconset'
import 'custom-svg-icon'
import 'custom-pages'
import './elements/darkmode/element.js'

import '@material/web/fab/fab.js'


import '@material/web/fab/fab-extended.js'
import Client from './client.js'

export default customElements.define('app-shell', class AppShell extends LitElement {
  static get properties() {
    return {
      menuShown: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super()

    globalThis.onhashchange = this.#hashchange.bind(this)
  }

  async connectedCallback() {
    super.connectedCallback();
    this.client = await new Client()
    globalThis.client = this.client
    document.addEventListener('menu-click', () => (this.menuShown = !this.menuShown));
    if (!location.hash) location.hash = '#!/home'
    this.#hashchange()
  }



  get #pages() {
    return this.renderRoot.querySelector('custom-pages')
  }

  async #hashchange() {
    if (this.menuShown) this.menuShown = false
    const parts = location.hash.split('#!/')
    console.log(parts);
    this.#select(parts[1])
  }

  async #select(selected) {
    requestAnimationFrame(async () => {
      !customElements.get(`${selected}-view`) && await import(`./${selected}.js`)
      this.#pages.select(selected)
    })
    
  }

  async select(selected) {
    location.hash = `#!/${selected}`
  }

  static styles = css`
    :host {
      overflow-y: auto;
      position: relative;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: row;
      font-family: system-ui, "Noto Sans", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      color: var(--main-color);
      background-color: var(--main-background-color);
    }
    
    main {
      overflow-y: auto;
      position: absolute;
      display: flex;
      flex-direction: column;
      width: 100%;
      // align-items: center;
      height: 100%;
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }

    aside {
      display: flex;
      flex-direction: column;
      z-index: 10001;
      box-sizing: border-box;
      padding: 12px 24px;
      border-radius: 12px;
      background: var(--main-background-color);
      color: var(--main-color);
      --svg-icon-color: var(--main-color);
      position: absolute;
      opacity: 0;
      top: 12px;
      
      bottom: 12px;
      right: 12px;
      width: 256px;
      pointer-events: none;
    }

    md-elevation, md-ripple {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      --md-elevation-level: 4;
    }
    a {
      text-decoration: none;
      user-select: none;
      outline: none;
    }

    aside a {
      height: 44px;
      box-sizing: border-box;
      font-weight: 500;

      color: var(--main-color);
      padding: 6px 12px;
    }

    :host([menuShown]) aside {
      opacity: 1;
      pointer-events: auto;
    }

    :host([menuShown]) md-fab {
      opacity: 0;
    }
    button {
      border: none;
      z-index: 10001;
      position: absolute;
      right: 24px;
      bottom: 24px;
      padding: 12px 24px;
      border-radius: 12px;
      background: #364857;
      color: #eee;
      --md-elevation-level: 2;
    }
    
    flex-container {
      padding-top: 24px;
      min-width: auto;
    }

    aside flex-container {
      align-items: flex-end;
    }
  `

  render() {
    return html`

    
    <aside>
      <md-elevation shadow>
      </md-elevation>
      <flex-row>
        <flex-one></flex-one>
        <custom-svg-icon icon="close" @click="${() => (this.menuShown = !this.menuShown)}"></custom-svg-icon>
      </flex-row>
      
      <flex-container>
        <a href="#!/services">services</a>
        <a href="#!/team">team</a>
        <a href="#!/home">home</a>
      </flex-container>
      <flex-one></flex-one>
      <flex-row style="padding-bottom: 64px;">
        <darkmode-element></darkmode-element>
      </flex-row>
    </aside>
    <button extended label="add">

    <md-elevation shadow>
    </md-elevation>
      <span>add</span>
    </button>
    <main>
      <custom-pages attr-for-selected="data-route">
        <home-view data-route="home"></home-view>
      </custom-pages>
    </main>
    `
    // <img src="./assets/banner.jpg">
  }
})