import { App } from "../App";
import * as mockStdin from "mock-stdin";

describe("App", () => {
  describe("startup flow", () => {
    it("should ask the user for the refresh interval and store it in the clock", () => {
      const stdin = mockStdin.stdin();
      const app = new App();
      app.start();
      stdin.send("12");
      stdin.end();
      expect(app.clock.refreshInterval).toBe(12);
    });
  });
});
