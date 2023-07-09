import { Interface } from "readline";
import { EventEmitter } from "events";
import { app } from "../app";

describe("app e2e test", () => {
  let readline: Interface & EventEmitter;
  let consoleLogSpy: jest.SpyInstance;
  let setPromptSpy: jest.SpyInstance;
  let promptSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers(); // Add this line to mock timers
    consoleLogSpy = jest.spyOn(console, "log");
    readline = Object.assign(new EventEmitter(), {
      setPrompt: jest.fn(),
      prompt: jest.fn(),
    }) as any;
    setPromptSpy = readline.setPrompt as jest.Mock;
    promptSpy = readline.prompt as jest.Mock;
  });

  afterEach(() => {
    jest.useRealTimers(); // Reset timers after each test
    consoleLogSpy.mockRestore();
  });

  it("should handle console.log and readline prompts correctly", async () => {
    app(readline);
    expect(setPromptSpy).toHaveBeenNthCalledWith(1, "Enter a number between 1 and 10");
    expect(promptSpy).toHaveBeenCalledTimes(1);

    readline.emit("line", "1");
    await new Promise((resolve) => setImmediate(resolve));
    expect(setPromptSpy).toHaveBeenNthCalledWith(2, "Please enter the first number");

    readline.emit("line", "10");
    await new Promise((resolve) => setImmediate(resolve));
    expect(setPromptSpy).toHaveBeenNthCalledWith(3, "Please enter the next number");

    readline.emit("line", "quit");
    expect(setPromptSpy).toHaveBeenNthCalledWith(4, "Thanks for playing, press any key to exit.");
    jest.clearAllTimers(); // Clear all timers
    await new Promise((resolve) => setImmediate(resolve));
  });
});
