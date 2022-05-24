import {
  createMachine,
  state,
  transition,
  reduce,
  guard,
  immediate
} from "robot3";
import type { Machine } from "robot3";

// Configurable run-time values.
type Config = Readonly<{ max: number; min: number }>;

// The state managed by the machine.
type Context = { count: number; active: boolean };

// Reducers: the functions which modify the machine state.
// This approach allows the machine operations to be unit tested individually
// while simplifying the machine definition (below).
function activateReducer(ctx: Context): Context {
  return {
    ...ctx,
    active: true
  };
}

function incrementReducer(ctx: Context): Context {
  return {
    ...ctx,
    count: ctx.count + 1
  };
}

function decrementReducer(ctx: Context): Context {
  return {
    ...ctx,
    count: ctx.count - 1
  };
}

function deactivateReducer(ctx: Context) {
  return {
    ...ctx,
    active: false
  };
}

function resetReducer(ctx: Context) {
  return {
    ...ctx,
    count: 0
  };
}

// Constructs application state machine given configuration object. //
const initializeMachine = (cfg: Config): Machine =>
  createMachine(
    {
      init: state(
        transition(
          "activate",
          "loop",
          guard((ctx: Context): boolean => !ctx.active),
          reduce(activateReducer)
        )
      ),
      loop: state(
        transition(
          "incr",
          "loop",
          guard((ctx: Context): boolean => ctx.count < cfg.max),
          reduce(incrementReducer)
        ),
        transition(
          "decr",
          "loop",
          guard((ctx: Context): boolean => ctx.count > cfg.min),
          reduce(decrementReducer)
        ),
        transition(
          "stop",
          "halt",
          guard((ctx: Context): boolean => ctx.active),
          reduce(deactivateReducer)
        )
      ),
      halt: state(immediate("init", reduce(resetReducer)))
    },
    (initialContext: Context) => ({ ...initialContext })
  );

export { initializeMachine };
export type { Context, Config };
