import { NumberFrequencyMap } from "./States";

type TaggedAction<T extends string> = { tag: T };

export type ProcessTimerInterval = TaggedAction<"ProcessTimerInterval"> & { timerInterval: number };
export type ProcessNumber = TaggedAction<"ProcessNumber"> & { newNumber: number };
export type DisplayNumbers = TaggedAction<"DisplayNumbers"> & { numbers: NumberFrequencyMap };
export type Halt = TaggedAction<"Halt">;
export type Resume = TaggedAction<"Resume">;
export type Quit = TaggedAction<"Quit">;

export type Action = ProcessTimerInterval | ProcessNumber | DisplayNumbers | Halt | Resume | Quit;
