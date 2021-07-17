import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createMachine, state, transition, reduce, guard } from "robot3";
import { Manager } from "./index.js";

type Ctx = { count: number; };

@customElement("example-component")
class ExampleComponent extends LitElement {
  @property()
  max = 0

  @property()
  min = 0

  private manager = new Manager<Ctx>(this,createMachine({
    idle: state(
      transition("incr","idle",
        reduce((ctx: Ctx): Ctx => ({
          ...ctx,
          count: ctx.count + 1
        })),
        guard((ctx: Ctx): boolean => ctx.count < this.max)
      ),
      transition("decr","idle",
        reduce((ctx: Ctx): Ctx => ({
          ...ctx,
          count: ctx.count - 1
        })),
        guard((ctx: Ctx): boolean => ctx.count > this.min)
      )
    ),
    halt: state()
  }, () => ({ count: 0 })));

  render(): TemplateResult {
    return html`
      <h1>Counter</h1>
      <p><strong>${this.manager.context.count}</strong></p>
      <button type="button"
        @click=${() => this.manager.next("incr")}>
        Increment
      </button>
      <button type="button"
        @click=${() => this.manager.next("decr")}>
        Decrement
      </button>
      <p>
        <small>
          Maximum of <strong>${this.max}</strong>;
          minimum of <strong>${this.min}</strong>.
        </small>
      </p>
    `;
  }

  static styles = css`
  :host {
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center ;
  }


  input, button, select, textarea {
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
