import { Action, DisplayNumbers, Halt, ProcessNumber, ProcessTimerInterval, Quit, Resume } from "./Actions";

export function isProcessTimerInterval(x: Action): x is ProcessTimerInterval {
  return x.tag === "ProcessTimerInterval";
}
export function isProcessNumber(x: Action): x is ProcessNumber {
  return x.tag === "ProcessNumber";
}
export function isDisplayNumbers(x: Action): x is DisplayNumbers {
  return x.tag === "DisplayNumbers";
}
export function isHalt(x: Action): x is Halt {
  return x.tag === "Halt";
}
export function isResume(x: Action): x is Resume {
  return x.tag === "Resume";
}
export function isQuit(x: Action): x is Quit {
  return x.tag === "Quit";
}
