import { Interface } from "readline";
import { displayNumbers, getNewNumberMap } from "./helpers";
import { startTimer, stopTimer } from "./timer";

export type Store = Map<number, number>;
export type GetGlobalProp = <T extends keyof State>(prop: T) => State[T];

export type TaggedState<T extends string> = { tag: T };
export type Initial = TaggedState<"Initial"> & {
  store: Store;
  getGlobalProp: GetGlobalProp;
  prompt: string;
};
export type Running = TaggedState<"Running"> & {
  store: Store;
  getGlobalProp: GetGlobalProp;
  timerId: NodeJS.Timeout;
  interval: number;
  prompt: string;
};
export type Paused = TaggedState<"Paused"> & {
  store: Store;
  getGlobalProp: GetGlobalProp;
  timerId: NodeJS.Timeout;
  interval: number;
  prompt: string;
};
export type Terminated = TaggedState<"Terminated"> & { store: Store; prompt: string };
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
export type InputTimerInterval = TaggedAction<"InputTimerInterval"> & { integer: number };
export type InputNumber = TaggedAction<"InputNumber"> & { integer: number };
export type Halt = TaggedAction<"Halt">;
export type Resume = TaggedAction<"Resume">;
export type Quit = TaggedAction<"Quit">;
export type NoOp = TaggedAction<"NoOp">;
export type InvalidInput = TaggedAction<"InvalidInput"> & { input: string };
export type Action = InputTimerInterval | InputNumber | Halt | Resume | Quit | InvalidInput | NoOp;

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
function isInvalidInput(x: Action): x is InvalidInput {
  return x.tag === "InvalidInput";
}

export type Reducer = (action: Action, state: State) => State;

const reduceInitial = (action: Action, state: Initial): State => {
  if (isInputTimerInterval(action)) {
    // TODO: get rid of all the console logs and only use readline
    const timerId = startTimer(action.integer, () => console.log(displayNumbers(state.getGlobalProp("store"))));
    return <Running>{
      ...state,
      interval: action.integer,
      tag: "Running",
      timerId,
      prompt: "Please enter the first number",
    };
  }
  return <Initial>{ ...state, prompt: "Please enter a number between 1 and 10" };
};

const reduceRunning = (action: Action, state: Running): State => {
  if (isInputNumber(action)) {
    return <Running>{
      ...state,
      store: getNewNumberMap(state.store, action.integer),
      prompt: "Please enter the next number",
    };
  }
  if (isHalt(action)) {
    stopTimer(state.timerId);
    return <Paused>{ ...state, tag: "Paused", prompt: "Timer paused" };
  }
  if (isQuit(action)) {
    stopTimer(state.timerId);
    return <Terminated>{ ...state, tag: "Terminated", prompt: "Thanks for playing, press any key to exit." };
  }
  if (isInvalidInput(action)) {
    console.log(`invalid input: ${action.input}\n`);
  }
  return state;
};

const reducePaused = (action: Action, state: Paused): State => {
  if (isResume(action)) {
    const timerId = startTimer(state.interval, () => console.log(displayNumbers(state.getGlobalProp("store"))));
    return <Running>{
      ...state,
      tag: "Running",
      timerId,
      prompt: "Timer resumed",
    };
  }
  return state;
};

const reduceTerminated = (): State => {
  process.exit();
};

const transition: Reducer = (action: Action, state: State): State => {
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
    return reduceTerminated();
  }
  return state;
};

const getInteger = (input: string): false | number => {
  const int = parseInt(input);
  return !isNaN(int) && int;
};

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
  const integer = getInteger(input);
  if (isInitial(state)) {
    // TODO: make sensible user validation for inital time interval
    return integer ? { tag: "InputTimerInterval", integer } : { tag: "InvalidInput", input };
  } else if (isRunning(state) || isPaused(state)) {
    return integer ? { tag: "InputNumber", integer } : handleCommand(input);
  } else {
    return { tag: "NoOp" };
  }
};

export const app = (readline: Interface) => {
  let state: State = <Initial>{ tag: "Initial", store: new Map(), prompt: "Enter a number between 1 and 10" };
  state.getGlobalProp = (prop) => state[prop];
  readline.setPrompt(state.prompt);
  readline.prompt();

  readline.on("line", (input) => {
    const action = handleIO(state, input);
    state = transition(action, state);
    readline.setPrompt(state.prompt);
    readline.prompt();
  });
};
