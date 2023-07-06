import { createInterface } from "readline";

type TaggedState<T extends string> = { tag: T };
type Initial = TaggedState<"Initial"> & { name?: string; interval?: number };
type Running = TaggedState<"Running"> & { name?: string; timeout?: NodeJS.Timeout };
type Terminated = TaggedState<"Terminated"> & { name?: string };
type State = Initial | Running | Terminated;

type TaggedAction<T extends string> = { tag: T };
type ProcessInitialInput = TaggedAction<"ProcessInitialInput"> & { input: string };
type ProcessRunningInput = TaggedAction<"ProcessRunningInput"> & { input: string };

type Store = {
  name?: string;
  interval?: number;
  timeout?: NodeJS.Timeout;
};

const store: Store = {};

function myTimer() {
  console.log(`${store.name}`);
  store.timeout = setTimeout(myTimer, store.interval);
}

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let state = "Initial";

readline.setPrompt("Enter a number from 1000 to 5000");
readline.prompt();
readline.on("line", (input: string) => {
  if (input === "start") {
    myTimer();
    state = "Running";
  }
  if (!isNaN(parseInt(input, 10))) {
    store.interval = parseInt(input, 10);
    state = "waitingForName";
  }
  if (input === "halt") {
    clearTimeout(store.timeout);
    console.log("timer stopped");
    state = "Stopped";
  }
  if ((state = "waitingForName")) {
    store.name = input;
  }
});
