import {LitElement, html, css} from 'lit'
import '@vandeurenglenn/flex-elements'


export default customElements.define('home-view', class HomeView extends LitElement {
  static get properties() {
    return {
      condensed: {
        type: Boolean,
        reflect: true
      },
    };
  }

  darkmode({detail}) {
    console.log(detail);
    // if (detail === 'dark') {
    //   this.renderRoot.querySelector(`img[alt="logo"]`).src = './assets/logo-dark.svg'
    //   this.renderRoot.querySelector(`img[alt="banner"]`).src = './assets/banner-dark.svg'
    // } else {
    //   this.renderRoot.querySelector(`img[alt="logo"]`).src = './assets/logo.svg'
    //   this.renderRoot.querySelector(`img[alt="banner"]`).src = './assets/banner.svg'
    // }
  }

  constructor() {
    super()

    this.onscroll = this.#onscroll.bind(this)
  }
  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    document.addEventListener('theme-change', this.darkmode.bind(this))
    this.darkmode({detail: localStorage.getItem('selected-theme') || 'light'})
  }

  #onscroll(event) {
    event.preventDefault()
    const {height} = this.renderRoot.querySelector('header.big').getBoundingClientRect()
    if (this.scrollTop > height - 54) this.condensed = true
    else this.condensed = false
  }

  static styles = css`
    :host {
      overflow-y: auto;
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `

  render() {
    return html`  
      
       
       
    `
  }
})