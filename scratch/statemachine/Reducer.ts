import { Action, ProcessTimerInterval } from "./Actions";
import { Initial } from "./States";
import * as Actions from "./TypeGuards";

const reduceInitial = (action: Action, state: Initial) => {
  if (Actions.isProcessTimerInterval(action)) {
    return <ProcessTimerInterval>{
      tag: "ProcessTimerInterval",
      timerInterval: action.timerInterval,
    };
  }
  return state;
};

const reducer: Reducer = (action, state) => {
    if(States)
}