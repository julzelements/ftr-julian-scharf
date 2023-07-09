const start = Date.now();

const myTimer = (interval: number) => {
  const elapsed = Date.now() - start;
  const goal = elapsed / interval;
  const drift = elapsed - goal * 1000;

  setTimeout(() => {
    const expectedNow = (goal + interval) * 1000;
    const actualNow = Date.now();
    console.log({ tick: goal, drift, expectedNow, actualNow });
    myTimer(interval);
  }, 1000 - drift);
};

myTimer(1);
