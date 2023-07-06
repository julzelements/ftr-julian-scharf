import * as cp from "child_process";
import * as path from "path";
import { once } from "events";

describe("CLI", () => {
  it("should ask for name and age", async () => {
    // Path to your script
    const cliPath = path.join(__dirname, "./main.ts");
    const prompts = ["John Doe", "25"];
    const expectedOutput = "Hello John Doe, you are 25 years old.";

    const proc = cp.spawn("ts-node", [cliPath]);

    // Function to handle responses
    const handleOutput = (data: Buffer): void => {
      const output = data.toString();
      if (output.includes("age") || output.includes("name")) {
        if (prompts.length > 0) {
          proc.stdin.write(prompts.shift() + "\n");
        }
      } else {
        expect(output).toContain(expectedOutput);
      }
    };

    proc.stdout.on("data", handleOutput);

    proc.stderr.on("data", (data: Buffer) => {
      throw new Error(`Received error: ${data}`);
    });

    // Start the conversation
    proc.stdin.write(prompts.shift() + "\n");
    proc.stdin.end();

    // Wait for the process to finish
    await once(proc, "exit");
  });
});
