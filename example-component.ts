import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createMachine, state, transition, reduce, guard } from "robot3";
import { Manager } from "./index.js";

/**
 * The state data managed by the state machine.
 */
type Context = { count: number };

/**
 * Runtime values used, but not manipulated, by the machine.
 */
type Config = Readonly<{
  max: number;
  min: number;
}>;

/**
 * Application state machine layout.
 * @param cfg - Configuration values.
 * @returns - A robot {@link Machine | finite state machine}.
 */
const layout = (cfg: Config) =>
  createMachine(
    {
      idle: state(
        transition(
          "incr",
          "idle",
          reduce(
            (ctx: Context): Context => ({
              ...ctx,
              count: ctx.count + 1
            })
          ),
          guard((ctx: Context): boolean => ctx.count < cfg.max)
        ),
        transition(
          "decr",
          "idle",
          reduce(
            (ctx: Context): Context => ({
              ...ctx,
              count: ctx.count - 1
            })
          ),
          guard((ctx: Context): boolean => ctx.count > cfg.min)
        )
      ),
      halt: state()
    },
    (initialContext: Context) => ({ ...initialContext })
  );

@customElement("example-component")
class ExampleComponent extends LitElement {
  @property()
  max = 0;

  @property()
  min = 0;

  private manager = new Manager<Context>(
    this,
    layout(this.exposeProperties<Config>("max", "min")),
    {
      count: 0
    }
  );

  render(): TemplateResult {
    return html`
      <h1>Counter</h1>
      <p><strong>${this.manager.context.count}</strong></p>
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
    `;
  }

  /**
   * Expose specified component properties in a read-only object.
   * @param keys - The keys to expose. Must be key of both the desired config
   * object and the component itself out of simplicity and laziness.
   * @typeParam TConfig - The shape of the configuration object.
   * @returns - An object of read-only properties.
   */
  protected exposeProperties<TConfig>(
    ...keys: (keyof TConfig & keyof this)[]
  ): TConfig {
    const config: Partial<TConfig> = {};
    for (const key of keys) {
      Object.defineProperty(config, key, {
        get: () => this[key]
      });
    }
    return config as TConfig;
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
