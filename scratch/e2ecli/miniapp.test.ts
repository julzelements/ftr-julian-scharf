import { Interface } from "readline";
import { EventEmitter } from "events";
import { app } from "./miniapp";

describe("app e2e test", () => {
  let readline: Interface & EventEmitter;
  let consoleLogSpy: jest.SpyInstance;
  let setPromptSpy: jest.SpyInstance;
  let promptSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log");
    readline = Object.assign(new EventEmitter(), {
      setPrompt: jest.fn(),
      prompt: jest.fn(),
    }) as any;
    setPromptSpy = readline.setPrompt as jest.Mock;
    promptSpy = readline.prompt as jest.Mock;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should handle console.log and readline prompts correctly", () => {
    app(readline);
    readline.emit("line", "log something");
    expect(consoleLogSpy).toHaveBeenCalledWith("console.log log something");

    readline.emit("line", "prompt something");
    expect(setPromptSpy).toHaveBeenNthCalledWith(1, "setPrompt: prompt something");
    expect(promptSpy).toHaveBeenCalled();

    readline.emit("line", "prompt something else");
    expect(setPromptSpy).toHaveBeenNthCalledWith(2, "setPrompt: prompt something else");
    expect(promptSpy).toHaveBeenCalled();
  });
});
