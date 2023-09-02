import { css } from "lit"

export default [css`
:host {
  overflow-y: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: system-ui, "Noto Sans", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: var(--main-color);
  background-color: var(--main-background-color);
}

custom-drawer-layout[drawer-open] custom-drawer-button {
  opacity: 0;
  pointer-events: auto;
}


h1 {
  margin: 0;
  font-size: 24px;
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

custom-pages {
  display: flex;
}

img {
  height: 40px;
  width: 40px;
}

md-dialog custom-drawer-item {
  border-radius: 12px;
}
`]