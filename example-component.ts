import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { initializeMachine } from "./example.machine.js";
import type { Context } from "./example.machine";
import { Manager } from "./index.js";

@customElement("example-component")
class ExampleComponent extends LitElement {
  @property()
  max = 0;

  @property()
  min = 0;

  private manager = new Manager<Context>(this, initializeMachine(this), {
    count: 0,
    active: false
  });

  render(): TemplateResult {
    const { active, count } = this.manager.context;
    if (active) {
      return html`
        <h1>Counter</h1>
        <p><strong>${count}</strong></p>
        <button type="button" @click=${() => this.manager.next("incr")}>
          Increment
        </button>
        <button type="button" @click=${() => this.manager.next("decr")}>
          Decrement
        </button>
        <p>
          <small>
            Maximum of <strong>${this.max}</strong>; minimum of
            <strong>${this.min}</strong>.
          </small>
        </p>
        <button type="button" @click=${() => this.manager.next("stop")}>
          De-activate
        </button>
      `;
    }
    else {
      return html`
        <button type="button" @click=${() => this.manager.next("activate")}>
          Press to activate
        </button>
      `;
    }
  }

  static styles = css`
    :host {
      height: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    input,
    button,
    select,
    textarea {
      line-height: 2rem;
      focus: none;
      font-family: inherit;
      font-size: inherit;
      -webkit-padding: 0.4em 0;
      padding: 0;
      box-sizing: border-box;
      border: 1px solid #b9b9b9;
      border-radius: 4px;
      width: 100%;
      height: 100%;
    }
  `;
}

export { ExampleComponent };
