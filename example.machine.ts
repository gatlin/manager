import {
  createMachine,
  state,
  transition,
  reduce,
  guard,
  immediate
} from "robot3";
import type { Machine } from "robot3";

type Config = Readonly<{ max: number; min: number }>;
type Context = { count: number; active: boolean };

// Constructs application state machine given configuration object.
const initializeMachine = (cfg: Config): Machine =>
  createMachine(
    {
      init: state(
        transition(
          "activate",
          "loop",
          guard((ctx: Context): boolean => !ctx.active),
          reduce(
            (ctx: Context): Context => ({
              ...ctx,
              active: true
            })
          )
        )
      ),
      loop: state(
        transition(
          "incr",
          "loop",
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
          "loop",
          reduce(
            (ctx: Context): Context => ({
              ...ctx,
              count: ctx.count - 1
            })
          ),
          guard((ctx: Context): boolean => ctx.count > cfg.min)
        ),
        transition(
          "stop",
          "halt",
          reduce((ctx: Context) => ({
            ...ctx,
            active: false
          })),
          guard((ctx: Context): boolean => ctx.active)
        )
      ),
      halt: state(
        immediate(
          "init",
          reduce(
            (ctx: Context): Context => ({
              ...ctx,
              count: 0
            })
          )
        )
      )
    },
    (initialContext: Context) => ({ ...initialContext })
  );
  
  export { initializeMachine };
  export type { Context, Config };