export type GetGlobalProp = <T extends keyof State>(prop: T) => State[T];
export type Store = Map<number, number>;
export type FibonacciMap = Map<string, number>;

export type TaggedState<T extends string> = { tag: T };
export type Initial = TaggedState<"Initial"> & {
  store: Store;
  fibonacciMap: FibonacciMap;
  getGlobalProp: GetGlobalProp;
  prompt: string;
};
export type Running = TaggedState<"Running"> & {
  store: Store;
  fibonacciMap: FibonacciMap;
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

export const isInitial = (x: State): x is Initial => {
  return x.tag === "Initial";
};
export const isRunning = (x: State): x is Running => {
  return x.tag === "Running";
};
export const isPaused = (x: State): x is Paused => {
  return x.tag === "Paused";
};
export const isTerminated = (x: State): x is Terminated => {
  return x.tag === "Terminated";
};
