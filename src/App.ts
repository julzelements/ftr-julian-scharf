import { EventEmitter } from "node:events";
import { Clock } from "./Clock";
import { UserInput } from "./UserInput";

export class App {
  emitter: EventEmitter;
  user: UserInput;
  clock: Clock;

  start(): void {
    this.user.askForRefreshInterval();
  }

  constructor() {
    this.emitter = new EventEmitter();
    this.user = new UserInput(this.emitter);
    this.clock = new Clock(this.emitter);
  }
}
