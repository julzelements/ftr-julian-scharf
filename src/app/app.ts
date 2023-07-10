import { Interface } from "readline";
import { Action } from "./actions";
import { reduce } from "./reducers";
import { State, isInitial, isRunning, isPaused, Initial } from "./states";
import { getFibonacciMap, getValidInteger } from "../helpers/utils";

const handleCommand = (input: string): Action => {
  if (input === "halt") {
    return { tag: "Halt" };
  } else if (input === "resume") {
    return { tag: "Resume" };
  } else if (input === "quit") {
    return { tag: "Quit" };
  } else {
    return { tag: "InvalidInput", input };
  }
};

const handleIO = (state: State, input: string): Action => {
  const integer = getValidInteger(input);
  if (isInitial(state)) {
    // TODO: make sensible user validation for inital time interval
    return integer ? { tag: "InputTimerInterval", integer } : { tag: "InvalidInput", input };
  } else if (isRunning(state)) {
    if (state.fibonacciMap.has(input)) {
      console.log("FIB");
    }
    return integer ? { tag: "InputNumber", integer } : handleCommand(input);
  } else if (isPaused(state)) {
    return handleCommand(input);
  } else {
    return { tag: "NoOp" };
  }
};

export const app = (readline: Interface) => {
  const fibonacciMap = getFibonacciMap(1000);
  let state: State = <Initial>{
    tag: "Initial",
    store: new Map(),
    prompt: "Enter a number between 1 and 10",
    fibonacciMap,
  };
  state.getGlobalProp = (prop) => state[prop];
  readline.setPrompt(state.prompt);
  readline.prompt();

  readline.on("line", (input) => {
    const action = handleIO(state, input);
    state = reduce(action, state);
    readline.setPrompt(state.prompt);
    readline.prompt();
  });
};
