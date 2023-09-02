import { css, html, LitElement } from "lit";

export default customElements.define('busy-animation', class BusyAnimation extends LitElement {
  static styles = css`
  :host {
    display: block;
  }
  .animation {
    display: block;
    width: 24px;
    height: 24px;
    margin: 0 auto;
    background-color: #eee;
    border-radius: 100%;
    -webkit-animation: scale 1.0s infinite ease-in-out;
    animation: scale 1.0s infinite ease-in-out;
  }
  @-webkit-keyframes scale {
    0% { -webkit-transform: scale(0) }
    100% {
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }
  @keyframes scale {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    } 100% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
      opacity: 0;
    }
  }
  
  
  `

  render() {
    return html`
    <span class="animation"></span>
    `
  }
})