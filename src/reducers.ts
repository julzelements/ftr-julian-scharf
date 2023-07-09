import { Action, isHalt, isInputNumber, isInputTimerInterval, isInvalidInput, isQuit, isResume } from "./actions";
import { displayNumbers, getNewNumberMap } from "./utils";
import { Initial, Paused, Running, State, Terminated, isInitial, isPaused, isRunning, isTerminated } from "./states";
import { startTimer, stopTimer } from "./timer";

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
    return <Terminated>{ ...state, tag: "Terminated", prompt: "Thanks for playing, press <RETURN> to exit." };
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

const reduceTerminated = (state: Terminated): State => {
  stopTimer(state.timerId);
  process.exit();
};

export const reduce: Reducer = (action: Action, state: State): State => {
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
    return reduceTerminated(state);
  }
  return state;
};
