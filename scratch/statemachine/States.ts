type TaggedState<T extends string> = { tag: T };

export type NumberFrequencyMap = Record<number, number>;

export type Initial = TaggedState<"Initial">;

export type Running = TaggedState<"Running"> & {
  timerInterval: number;
  numbers: NumberFrequencyMap;
};

export type Paused = TaggedState<"Running"> & {
  timerInterval: number;
  numbers: NumberFrequencyMap;
};

export type Terminated = TaggedState<"Terminated"> & {
  numbers: NumberFrequencyMap;
};

export type State = Initial | Running | Paused | Terminated;
