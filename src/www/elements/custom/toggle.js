import {html, css, LitElement} from 'lit'
export default customElements.define('custom-toggle', class CustomToggle extends LitElement {
  static properties = {
    enabled: {
      type: Boolean,
      reflect: true
    }
  }

  constructor() {
    super()
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  toggle() {
    console.log('click');
    this.enabled = !this.enabled
  }

  static styles = css`
    :host {
      display: inline-flex;
      width: 38px;
      align-items: center;
    }
    button {
      position: absolute;
      height: 18px;
      width: 18px;
      border: none;
      border-radius: 50%;
      box-sizing: border-box;
      padding: 6px;
      transition: transform 60ms ease-out;
      // transform: scale(0.50);
    }

    .ride {
      height: 3px;
      width: 100%;
      background-color: var(--main-color);
    }

    :host([enabled]) button {
      background-color: var(--accent-color);
      transform: translateX(115%);
      transition: transform 60ms ease-in;
      // transform: scale(1);
    }
  `

  render(){
    return html`
    <button>
    </button>
    <span class="ride"></span>
    `
  }
});