import { createInterface } from "readline";

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
      return <Running>{ ...state, tag: "Running", store: new Map() };
    }
    return <Initial>{ ...state, prompt: "Please enter a number between 1 and 10" };
  }
  return state;
};

const reduceRunning: Reducer = (action: Action, state: State): State => {
  if (isInputNumber(action)) {
    // i need to keep track of the number of times the user has entered a number
    // I don't know if this works yet
    return <Running>{
      ...state,
      store: state.store.set(parseInt(action.input, 10), (state.store.get(parseInt(action.input, 10)) || 0) + 1),
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

// where do I put the logic that checks whether a user has entered 'start' or thier name?

readline.setPrompt(state.prompt);
readline.prompt();
readline.on("line", (input: string) => {
  reduce({ tag: "InputTimerInterval", input }, state);
  readline.setPrompt(state.prompt);
  readline.prompt();
});

// we need a recursive algo
// sets the prompt according to state
// readline.setPrompt(state.prompt);
// readline.prompt();
// readline.on("line", (input: string) => {
// how do we know what action it is?
//   reduce({ tag: "InputTimerInterval", input }, state);

// readline.setPrompt("Enter a number from 1000 to 5000");
// readline.prompt();
// readline.on("line", (input: string) => {
//   if (input === "start") {
//     myTimer();
//     state = "Running";
//     readline.setPrompt("App is running");
//     readline.prompt();
//     return;
//   }
//   if (!isNaN(parseInt(input, 10))) {
//     store.interval = parseInt(input, 10);
//     state = "waitingForName";
//     readline.setPrompt("Whats your name");
//     readline.prompt();
//   }
//   if (input === "halt") {
//     clearTimeout(store.timeout);
//     console.log("timer stopped");
//     state = "Stopped";
//   }
//   if (state === "waitingForName" || state === "Running") {
//     store.name = input;
//     state = "Running";
//   }
// });
