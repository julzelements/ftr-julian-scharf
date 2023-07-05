import { createInterface } from "readline";
let feelings = "";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readLineAsync = (msg: string) => {
  return new Promise((resolve) => {
    readline.question(msg, (userRes) => {
      resolve(userRes);
    });
  });
};

const startApp = async () => {
  const userRes = await readLineAsync("How are you? ");
  feelings = userRes as unknown as string;
  readline.close();
  console.log("Your response was: " + userRes + " — Thanks!");
};

let i = 0;
const start = Date.now();

const myTimer = () => {
  const goal = i * 1000 + start;
  const drift = Date.now() - goal;
  i++;
  setTimeout(() => {
    console.log({ tick: i, drift, feelings });
    myTimer();
  }, 1000 - drift);
};

myTimer();
startApp();

export {};
