import { Interface } from "readline";
import { EventEmitter } from "events";
import { app } from "../app";
import * as timer from "../timer";

describe("app e2e test", () => {
  let readline: Interface & EventEmitter;
  let consoleLogSpy: jest.SpyInstance;
  let setPromptSpy: jest.SpyInstance;
  let promptSpy: jest.SpyInstance;
  let startTimerSpy: jest.SpyInstance;
  let stopTimerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    consoleLogSpy = jest.spyOn(console, "log");
    readline = Object.assign(new EventEmitter(), {
      setPrompt: jest.fn(),
      prompt: jest.fn(),
    }) as any;
    setPromptSpy = readline.setPrompt as jest.Mock;
    promptSpy = readline.prompt as jest.Mock;
    startTimerSpy = jest.spyOn(timer, "startTimer");
    stopTimerSpy = jest.spyOn(timer, "stopTimer");
  });

  afterEach(() => {
    jest.useRealTimers();
    consoleLogSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("should handle console.log and readline prompts correctly", async () => {
    app(readline);
    expect(setPromptSpy).toHaveBeenNthCalledWith(1, "Enter a number between 1 and 10");
    expect(promptSpy).toHaveBeenCalledTimes(1);

    readline.emit("line", "5"); // interval is 5 seconds
    expect(startTimerSpy).toHaveBeenCalledTimes(1);
    expect(setPromptSpy).toHaveBeenNthCalledWith(2, "Please enter the first number");

    readline.emit("line", "909");
    expect(setPromptSpy).toHaveBeenNthCalledWith(3, "Please enter the next number");
    jest.advanceTimersByTime(5000);
    expect(consoleLogSpy).toHaveBeenCalledWith("909:1");

    readline.emit("line", "808");
    expect(setPromptSpy).toHaveBeenNthCalledWith(4, "Please enter the next number");
    jest.advanceTimersByTime(5000);
    expect(consoleLogSpy).toHaveBeenCalledWith("909:1, 808:1");

    readline.emit("line", "909");
    expect(setPromptSpy).toHaveBeenNthCalledWith(5, "Please enter the next number");
    jest.advanceTimersByTime(5000);
    expect(consoleLogSpy).toHaveBeenCalledWith("909:2, 808:1");

    readline.emit("line", "banana");
    expect(consoleLogSpy).toHaveBeenCalledWith("invalid input: banana\n");
    expect(setPromptSpy).toHaveBeenNthCalledWith(6, "Please enter the next number");

    readline.emit("line", "halt");
    expect(stopTimerSpy).toHaveBeenCalledTimes(1);
    expect(setPromptSpy).toHaveBeenNthCalledWith(7, "Timer paused");

    readline.emit("line", "resume");
    expect(startTimerSpy).toHaveBeenCalledTimes(2);
    expect(setPromptSpy).toHaveBeenNthCalledWith(8, "Timer resumed");

    readline.emit("line", "quit");
    expect(setPromptSpy).toHaveBeenNthCalledWith(9, "Thanks for playing, press <RETURN> to exit.");

    expect(startTimerSpy).toHaveBeenCalledTimes(2);
    expect(stopTimerSpy).toHaveBeenCalledTimes(2);
  });
});
