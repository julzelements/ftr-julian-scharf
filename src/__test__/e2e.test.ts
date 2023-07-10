import { Interface } from "readline";
import { EventEmitter } from "events";
import { app } from "../app/app";
import * as timer from "../helpers/timer";

describe("app e2e test", () => {
  let readline: Interface & EventEmitter;
  let consoleLogSpy: jest.SpyInstance;
  let setPromptSpy: jest.SpyInstance;
  let promptSpy: jest.SpyInstance;
  let startTimerSpy: jest.SpyInstance;
  let stopTimerSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    readline = Object.assign(new EventEmitter(), {
      setPrompt: jest.fn(),
      prompt: jest.fn(),
    }) as any;
    setPromptSpy = readline.setPrompt as jest.Mock;
    promptSpy = readline.prompt as jest.Mock;
    startTimerSpy = jest.spyOn(timer, "startTimer");
    stopTimerSpy = jest.spyOn(timer, "stopTimer");
    exitSpy = jest.spyOn(process, "exit").mockImplementation((code?: number): never => {
      throw new Error(`process.exit(${code})`);
    });
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
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "909:1");

    readline.emit("line", "8");
    expect(setPromptSpy).toHaveBeenNthCalledWith(4, "Please enter the next number");
    jest.advanceTimersByTime(5000);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "FIB");
    expect(consoleLogSpy).toHaveBeenNthCalledWith(3, "909:1, 8:1");

    readline.emit("line", "909");
    expect(setPromptSpy).toHaveBeenNthCalledWith(5, "Please enter the next number");
    jest.advanceTimersByTime(5000);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(4, "909:2, 8:1");

    readline.emit(
      "line",
      "43466557686937456435688527675040625802564660517371780402481729089536555417949051890403879840079255169295922593080322634775209689623239873322471161642996440906533187938298969649928516003704476137795166849228875"
    );
    expect(setPromptSpy).toHaveBeenNthCalledWith(5, "Please enter the next number");
    jest.advanceTimersByTime(5000);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(5, "FIB");
    expect(setPromptSpy).toHaveBeenNthCalledWith(6, "Please enter the next number");

    readline.emit("line", "banana");
    expect(consoleLogSpy).toHaveBeenCalledWith("invalid input: banana\n");
    expect(setPromptSpy).toHaveBeenNthCalledWith(7, "Please enter the next number");

    readline.emit("line", "halt");
    expect(stopTimerSpy).toHaveBeenCalledTimes(1);
    expect(setPromptSpy).toHaveBeenNthCalledWith(8, "Timer paused");

    readline.emit("line", "resume");
    expect(startTimerSpy).toHaveBeenCalledTimes(2);
    expect(setPromptSpy).toHaveBeenNthCalledWith(9, "Timer resumed");

    readline.emit("line", "quit");
    expect(setPromptSpy).toHaveBeenNthCalledWith(10, "Thanks for playing, press <RETURN> to exit.");

    try {
      readline.emit("line", "");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty("message", "process.exit(0)");
    }

    expect(startTimerSpy).toHaveBeenCalledTimes(2);
    expect(stopTimerSpy).toHaveBeenCalledTimes(2);
  });
});
