import { createInterface } from "readline";

type Store = {
  name?: string;
  interval?: number;
  timeout?: NodeJS.Timeout;
};
type State = "askForName" | "askForNumber" | "ready";

const store: Store = {};

function myTimer() {
  console.log(`${store.name}`);
  store.timeout = setTimeout(myTimer, store.interval);
}

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.setPrompt("Enter a number from 1000 to 5000");
readline.prompt();
readline.on("line", (input: string) => {
  if (input === "start") {
    myTimer();
  }
  if (input.includes("name")) {
    store.name = input;
  }
  if (!isNaN(parseInt(input, 10))) {
    store.interval = parseInt(input, 10);
  }
  if (input === "halt") {
    clearTimeout(store.timeout);
    console.log("timer stopped");
  }
});
