import { EventEmitter } from "node:events";
import { Timer } from "./Timer";
import { UserInput } from "./UserInput";

export enum State {
  Prelaunch = "Prelaunch",
  Running = "Running",
  Paused = "Paused",
  Terminated = "Terminated",
}

const transitions = {
  [State.Prelaunch]: {
    [State.Running]: {
      feedback: "App has started",
    },
  },
};

export class App {
  emitter: EventEmitter;
  user: UserInput;
  timer: Timer;
  currentState: State = State.Prelaunch;

  start(): void {
    this.emitter.emit("stateChange", State.Prelaunch);
  }

  constructor() {
    this.emitter = new EventEmitter();
    this.user = new UserInput(this.emitter);
    this.timer = new Timer(this.emitter);
  }
}
