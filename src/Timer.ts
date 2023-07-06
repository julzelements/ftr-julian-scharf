import { EventEmitter } from "node:events";

export class Timer {
  emitter: EventEmitter;
  timerInterval: number;
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.timerInterval = 0;

    emitter.once("setTimerInterval", (seconds) => {
      this.timerInterval = seconds;
    });
  }
}
