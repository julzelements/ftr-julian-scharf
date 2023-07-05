import { createInterface, Interface } from "readline";
import { EventEmitter } from "node:events";

export class UserInput {
  emitter: EventEmitter;
  readline: Interface;
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  askForRefreshInterval(): void {
    this.readline.setPrompt("How frequently (in seconds) do you want the program to update and display");
    this.readline.on("line", (number: string) => {
      const refreshInterval = parseInt(number, 10);
      if (isNaN(refreshInterval)) {
        console.log("please supply a valid integer");
        this.readline.prompt();
      } else {
        this.emitter.emit("setRefreshInterval", refreshInterval);
      }
    });
    this.readline.prompt();
  }
}
