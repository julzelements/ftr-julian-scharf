import { app } from "../app";
import readline from "readline";

jest.mock("readline");

describe("CLI Application E2E Test", () => {
  it("should work as expected", async () => {
    // Run the application
    app();

    // Check if createInterface has been called
    expect(readline.createInterface).toHaveBeenCalled();

    // Get the 'line' event callback
    const onLineCallback = (readline as any).createInterface().on.mock.calls[0][1];

    onLineCallback("some user input");

    console.log(app);

    // Assert that the application behaves as expected...
  });
});
