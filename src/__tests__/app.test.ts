import { App } from "../App";
import * as mockStdin from "mock-stdin";
import { mockProcessStdout } from "jest-mock-process";

describe("App", () => {
  describe("startup flow", () => {
    let stdin: mockStdin.MockSTDIN;
    let stdout: any;
    beforeEach(() => {
      stdin = mockStdin.stdin();
      stdout = mockProcessStdout();
    });
    afterEach(() => {
      stdout.mockRestore();
      stdin.restore();
    });
    it("should ask the user for the refresh interval and store it in the timer", () => {
      const app = new App();
      app.start();
      expect(stdout).toHaveBeenCalledWith(
        "Please input the amount of time in seconds between emitting numbers and their frequency\n"
      );
      stdin.send("12").end();
      expect(app.timer.timerInterval).toBe(12);
    });
    it("should provide feedback if the user supplies an invalid number", () => {
      const app = new App();
      app.start();
      stdin.send("twelve").end();
      expect(stdout).toHaveBeenNthCalledWith(
        2,
        `Input Error: \"twelve\" is not a valid, non-zero, positive integer\nPlease input the amount of time in seconds between emitting numbers and their frequency`
      );
    });
    it("should provide feedback if the user supplies an invalid number", () => {
      const app = new App();
      app.start();
      stdin.send("-2").end();
      expect(stdout).toHaveBeenNthCalledWith(2, "please supply a valid integer");
      expect(stdout).toHaveBeenNthCalledWith(
        3,
        "Please input the amount of time in seconds between emitting numbers and their frequency"
      );
    });
    it("should provide feedback if the user supplies an invalid number", () => {
      const app = new App();
      app.start();
      stdin.send("0").end();
      expect(stdout).toHaveBeenNthCalledWith(2, "please supply a valid integer");
      expect(stdout).toHaveBeenNthCalledWith(
        3,
        "Please input the amount of time in seconds between emitting numbers and their frequency"
      );
    });
  });
});
