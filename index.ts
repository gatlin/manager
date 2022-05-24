import {
  ReactiveController,
  ReactiveControllerHost
} from "@lit/reactive-element";
import { interpret } from "robot3";
import { Signal } from "torc";
import type { Continuation } from "torc";
import type { SendEvent, Service, Machine } from "robot3";

class Manager<T> implements ReactiveController, Continuation<SendEvent> {
  protected service: Signal<Service<Machine>>;

  constructor(
    private host: ReactiveControllerHost,
    machine: Machine,
    initialContext?: T
  ) {
    this.host.addController(this);
    this.service = new Signal(
      interpret(
        machine as Machine,
        (newService: Service<Machine>) => {
          this.service.next(newService);
        },
        initialContext
      )
    );
  }

  get context(): T {
    return this.service.value.context as T;
  }

  get current(): string {
    return this.service.value.machine.current as string;
  }

  public next(event: SendEvent) {
    if (this.service.done) {
      return;
    }
    // the documentation mentions this property; the Service type does not.
    if ("child" in this.service.value) {
      (this.service.value as {
        child: Service<Machine>;
      } & Service<Machine>).child.send(event);
    }
    else {
      this.service.value.send(event);
    }
  }

  public hostConnected() {
    if (!this.service.done) {
      this.service.subscribe(() => void this.host.requestUpdate());
    }
  }

  public hostDisconnected() {
    if (!this.service.done) {
      this.service.finish();
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
