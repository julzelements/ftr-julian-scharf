import { Interface } from "readline";

export const app = (readline: Interface) => {
  readline.on("line", (input) => {
    if (input === "log something") {
      console.log(`console.log ${input}`);
    } else {
      readline.setPrompt(`setPrompt: ${input}`);
      readline.prompt();
    }
  });
};
