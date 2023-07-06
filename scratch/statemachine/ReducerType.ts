import { Action } from "./Actions";
import { State } from "./States";

export type Reducer = (action: Action, state: State) => State;
