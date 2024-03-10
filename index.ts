import {
  ReactiveController,
  ReactiveControllerHost
} from "@lit/reactive-element";
import { interpret } from "robot3";
import { Behavior } from "torc";
import type { Observer } from "torc";
import type { SendEvent, Service, Machine } from "robot3";

/**
 * Manages a LitElement component with a robot
 * @typeParam TContext - Type of the state object managed by the machine.
 */
class Manager<TContext> implements ReactiveController, Observer<SendEvent> {
  /**
   * A reactive, dynamically-updated reference to the executing robot state
   * machine service.
   */
  protected readonly service$: Behavior<Service<Machine>>;

  constructor(
    private host: ReactiveControllerHost,
    machine: Machine,
    initialContext?: TContext
  ) {
    this.host.addController(this);
    this.service$ = new Behavior(
      interpret(
        machine,
        (newService: Service<Machine>) => {
          this.service$.next(newService);
        },
        initialContext as Machine["context"]
      )
    );
  }

  /**
   * Read-only access to the underlying state machine context value.
   */
  get context(): TContext {
    return this.service$.value.context as TContext;
  }

  /**
   * The label of the current machine state.
   */
  get current(): string {
    return this.service$.value.machine.current as string;
  }

  /**
   * Initiate a state machine transition and any consequent side-effects.
   * @param event - A valid robot finite state machine event.
   */
  public next(event: SendEvent) {
    if (this.service$.done) {
      return;
    }
    // the documentation mentions this property; the Service type does not.
    if ("child" in this.service$.value) {
      (
        this.service$.value as {
          child: Service<Machine>;
        } & Service<Machine>
      ).child.send(event);
    } else {
      this.service$.value.send(event);
    }
  }

  public hostConnected() {
    if (!this.service$.done) {
      this.service$.subscribe(() => void this.host.requestUpdate());
    }
  }

  public hostDisconnected() {
    if (!this.service$.done) {
      this.service$.finish();
    }
  }

  public hostUpdate() {
    return;
  }

  public hostUpdated() {
    return;
  }
}

export { Manager };
