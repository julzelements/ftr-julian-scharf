import { createInterface } from "readline";
import { getNewNumberMap } from "./helpers";

export type Store = Map<number, number>;

export type TaggedState<T extends string> = { tag: T };
export type Initial = TaggedState<"Initial"> & { store: Store; prompt: string };
export type Running = TaggedState<"Running"> & { store: Store; timeout?: NodeJS.Timeout };
// might not be using timeout for paused, might be storing the time left in that tick.
export type Paused = TaggedState<"Paused"> & { store: Store; timeout?: NodeJS.Timeout };
export type Terminated = TaggedState<"Terminated"> & { store: Store };
export type State = Initial | Running | Paused | Terminated;

function isInitial(x: State): x is Initial {
  return x.tag === "Initial";
}
function isRunning(x: State): x is Running {
  return x.tag === "Running";
}
function isPaused(x: State): x is Paused {
  return x.tag === "Paused";
}
function isTerminated(x: State): x is Terminated {
  return x.tag === "Terminated";
}

export type TaggedAction<T extends string> = { tag: T };
export type InputTimerInterval = TaggedAction<"InputTimerInterval"> & { input: string };
export type InputNumber = TaggedAction<"InputNumber"> & { input: string };
export type Halt = TaggedAction<"Halt">;
export type Resume = TaggedAction<"Resume">;
export type Quit = TaggedAction<"Quit">;
export type Action = InputTimerInterval | InputNumber | Halt | Resume | Quit;

function isInputTimerInterval(x: Action): x is InputTimerInterval {
  return x.tag === "InputTimerInterval";
}
function isInputNumber(x: Action): x is InputNumber {
  return x.tag === "InputNumber";
}
function isHalt(x: Action): x is Halt {
  return x.tag === "Halt";
}
function isResume(x: Action): x is Resume {
  return x.tag === "Resume";
}
function isQuit(x: Action): x is Quit {
  return x.tag === "Quit";
}

export type Reducer = (action: Action, state: State) => State;

// need a number between 1 and 10 inclusive
const isValidTimeInterval = (input: string): boolean => {
  const num = parseInt(input, 10);
  return num >= 1 && num <= 10;
};

const reduceInitial: Reducer = (action: Action, state: State): State => {
  if (isInputTimerInterval(action)) {
    if (isValidTimeInterval(action.input)) {
      return <Running>{
        ...state,
        tag: "Running",
        store: new Map(),
        timeout: setTimeout(() => {
          console.log(state.store.keys);
        }, parseInt(action.input, 10)),
      };
    }
    return <Initial>{ ...state, prompt: "Please enter a number between 1 and 10" };
  }
  return state;
};

const reduceRunning: Reducer = (action: Action, state: State): State => {
  if (isInputNumber(action)) {
    return <Running>{
      ...state,
      store: getNewNumberMap(state.store, parseInt(action.input, 10)),
    };
  }
  if (isHalt(action)) {
    return <Paused>{ ...state, tag: "Paused" };
  }
  if (isQuit(action)) {
    return <Terminated>{ ...state, tag: "Terminated" };
  }
  return state;
};

const reducePaused: Reducer = (action: Action, state: State): State => {
  if (isResume(action)) {
    // todo: resume timer
    return <Running>{ ...state, tag: "Running" };
  }
  return state;
};

const reduceTerminated: Reducer = (action: Action, state: State): State => {
  return state;
};

const reduce: Reducer = (action: Action, state: State): State => {
  if (isInitial(state)) {
    return reduceInitial(action, state);
  }
  if (isRunning(state)) {
    return reduceRunning(action, state);
  }
  if (isPaused(state)) {
    return reducePaused(action, state);
  }
  if (isTerminated(state)) {
    return reduceTerminated(action, state);
  }
  return state;
};

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let state: State = { tag: "Initial", store: new Map(), prompt: "Enter a number between 1 and 10" };

readline.setPrompt(state.prompt);
readline.prompt();
readline.on("line", (input: string) => {
  const parsedInput = parseInt(input, 10);

  // the simplest thing that could possibly work
  let action: Action;
  if (isInitial(state)) {
    action = { tag: "InputTimerInterval", input }; // should we pass in parsedInt here?
  } else if (isRunning(state) && !isNaN(parsedInput)) {
    action = { tag: "InputNumber", input };
  } else if (input === "halt") {
    action = { tag: "Halt" };
  } else if (input === "resume") {
    action = { tag: "Resume" };
  } else if (input === "quit") {
    action = { tag: "Quit" };
  } else {
    console.log("invalid input");
    readline.prompt();
    return;
  }

  state = reduce(action, state);

  // handle state change
  switch (state.tag) {
    case "Initial":
      readline.setPrompt(state.prompt); // TODO: fix mutation here
      break;
    case "Paused":
      console.log("timer halted");
      // TODO: pause timer
      break;
    case "Running":
      console.log("timer started");
      // TODO: start timer
      break;
    case "Terminated":
      // To implement this, I need to add a listener to keydown. Currently my whole app only listens to \n
      // TODO: stop timer
      console.log("Thanks for playing, press any key to exit.");
      readline.close();
      return;
  }

  readline.prompt();
});
