/**
 * Example of how to structure a Manager state machine + related definitions.
 */
import {
  createMachine,
  state,
  transition,
  reduce,
  guard,
  immediate
} from "robot3";
import type { Machine } from "robot3";

/**
 * Parameters which inform application behavior which are not (directly)
 * mutable from within the machine.
 */
type Config = Readonly<{ max: number; min: number }>;

/**
 * Application state managed by the machine.
 */
type Context = { count: number; active: boolean };

/**
 * @param cfg - {@link Config | Configuration object}.
 * @returns - A robot finite state machine.
 */
function initializeMachine(cfg: Config): Machine {
  return createMachine(
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
}

/*
 ** Reducers are defined as separate named functions for two main reasons:
 ** 1. to aid unit testing; and
 ** 2. to improve the legibility of `initializeMachine`.
 */

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

function deactivateReducer(ctx: Context): Context {
  return {
    ...ctx,
    active: false
  };
}

function resetReducer(ctx: Context): Context {
  return {
    ...ctx,
    count: 0
  };
}

export {
  initializeMachine,
  activateReducer,
  incrementReducer,
  decrementReducer,
  resetReducer
};

export type { Context, Config };
