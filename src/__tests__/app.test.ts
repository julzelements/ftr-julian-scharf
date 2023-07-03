import { App } from "../index";

describe("app", () => {
  it("should say hello", () => {
    const consoleLog = jest.spyOn(console, "log");
    const app = new App();
    expect(consoleLog).toHaveBeenCalledWith("Hello world!");
  });
});
