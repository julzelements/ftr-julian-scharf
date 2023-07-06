import { createInterface } from "readline";

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
