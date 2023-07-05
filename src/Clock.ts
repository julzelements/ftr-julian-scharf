import { EventEmitter } from "node:events";

export class Clock {
  emitter: EventEmitter;
  refreshInterval: number;
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.refreshInterval = 0;

    emitter.once("setRefreshInterval", (seconds) => {
      this.refreshInterval = seconds;
    });
  }
}
