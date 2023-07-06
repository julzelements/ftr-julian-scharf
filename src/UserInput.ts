import { createInterface, Interface } from "readline";
import { EventEmitter } from "node:events";
import { State } from "./App";

// TODO: solve the annoying newline problem

enum Commands {
  halt = "halt",
  resume = "resume",
  quit = "quit",
}

enum Prompts {
  halt = "timer halted",
  resume = "timer resumed",
  quit = "Thanks for playing, press any key to exit.",
  anotherNumber = "Please enter another number",
  firstNumber = "Please enter the first number",
}

export class UserInput {
  emitter: EventEmitter;
  readline: Interface;
  firstNumberSupplied: boolean = false;
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.emitter.on("stateChange", (newState: State) => {
      console.log(newState, "🔥");
      if (newState === State.Prelaunch) {
        this.askForTimerInterval();
        return;
      }
      if (newState === State.Running) {
        this.askForInput();
        return;
      }
      if (newState === State.Paused) {
        this.askForInput();
        return;
      }
      if (newState === State.Terminated) {
        process.exit();
      }
    });
    this.readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  askForTimerInterval() {
    this.readline.setPrompt("Please input the amount of time in seconds between emitting numbers and their frequency");
    this.readline.prompt();
    this.readline.on("line", (number: string) => {
      const timerInterval = parseInt(number, 10);
      this.emitter.emit("timerInterval", timerInterval);
      this.emitter.emit("stateChange", State.Running);
    });
  }
  askForInput() {
    this.readline.setPrompt(this.firstNumberSupplied ? Prompts.anotherNumber : Prompts.firstNumber);
    this.readline.prompt();
    this.readline.on("line", (input: string) => {
      this.handleInput(input);
    });
  }

  private parsedNumber(input: string) {
    const parsed = parseInt(input, 10);
    return isNaN(parsed) ? null : parsed;
  }

  private handleInput(input: string) {
    console.log(input, "🥦");
    const number = this.parsedNumber(input);
    if (number) {
      this.firstNumberSupplied = true;
      this.emitter.emit("newNumber", number);
    } else if (input === Commands.halt) {
      this.emitter.emit("stateChange", State.Paused);
    } else if (input === Commands.resume) {
      this.emitter.emit("stateChange", State.Running);
    } else if (input === Commands.quit) {
      this.emitter.emit("stateChange", State.Terminated);
    } else {
      console.log(input, "🚀");
      this.readline.setPrompt(`Suplied value: ${input} is invalid`);
      this.readline.prompt();
    }
  }
}
