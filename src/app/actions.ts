export type TaggedAction<T extends string> = { tag: T };
export type InputTimerInterval = TaggedAction<"InputTimerInterval"> & { integer: number };
export type InputNumber = TaggedAction<"InputNumber"> & { integer: number };
export type Halt = TaggedAction<"Halt">;
export type Resume = TaggedAction<"Resume">;
export type Quit = TaggedAction<"Quit">;
export type NoOp = TaggedAction<"NoOp">;
export type InvalidInput = TaggedAction<"InvalidInput"> & { input: string };
export type Action = InputTimerInterval | InputNumber | Halt | Resume | Quit | InvalidInput | NoOp;

export const isInputTimerInterval = (x: Action): x is InputTimerInterval => {
  return x.tag === "InputTimerInterval";
};
export const isInputNumber = (x: Action): x is InputNumber => {
  return x.tag === "InputNumber";
};
export const isHalt = (x: Action): x is Halt => {
  return x.tag === "Halt";
};
export const isResume = (x: Action): x is Resume => {
  return x.tag === "Resume";
};
export const isQuit = (x: Action): x is Quit => {
  return x.tag === "Quit";
};
export const isInvalidInput = (x: Action): x is InvalidInput => {
  return x.tag === "InvalidInput";
};
