import { createInterface } from "readline";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const name = await question("What is your name? ");
  const age = await question("What is your age? ");
  console.log(`Hello ${name}, you are ${age} years old.`);
  readline.close();
}

main();
