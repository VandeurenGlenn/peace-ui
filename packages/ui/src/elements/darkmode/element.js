import {html, css, LitElement} from 'lit'
import '../custom/toggle.js'
export default customElements.define('darkmode-element', class DarkmodeElement extends LitElement {
  static properties = {
  
  }

  constructor() {
    super()

    this.addEventListener('click', this.#click.bind(this))
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    this.enabled = localStorage.getItem('selected-theme') === 'dark' ? true : false
    this.enabled ? this.renderRoot.querySelector('custom-toggle').enable() : this.renderRoot.querySelector('custom-toggle').disable()
  }

  get #toggleElement() {
    return this.renderRoot.querySelector('custom-toggle')
  }
 
  #click() {
    this.#toggleElement.toggle()
    globalThis.setTheme(this.#toggleElement.enabled ? 'dark' : 'light')
  }

  static styles = css`
    :host {
      display: inline-flex;
      width: 100%;
    }
  `

  render(){
    return html`
    <span>darkmode</span>
    <flex-one></flex-one>
    <custom-toggle></custom-toggle>
    `
  }
});