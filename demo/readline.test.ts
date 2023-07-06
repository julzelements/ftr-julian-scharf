import * as mockStdin from "mock-stdin";
import { mockProcessStdout } from "jest-mock-process";
import { createInterface } from "readline";

function app() {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("What is your name?", (name: string) => {
    readline.question("What is your age?", (age: string) => {
      console.log(`Hello ${name}, you are ${age} years old.`);
      readline.close();
    });
  });
}

describe.skip("App", () => {
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
    it("It should ask for user details", () => {
      app();
      expect(stdout).toHaveBeenNthCalledWith(1, "What is your name?");
      stdin.send("Julian").end();
      expect(stdout).toHaveBeenNthCalledWith(2, "What is your age?");
      stdin.send("39").end();
      expect(stdout).toHaveBeenNthCalledWith(3, "Hello Julian, you are 39 years old.\n");
    });
  });
});
