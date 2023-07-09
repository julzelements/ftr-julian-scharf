export const startTimer = (interval: number, startTime: number, callback: () => void): NodeJS.Timeout => {
  let expected = startTime + interval * 1000;

  const tick = () => {
    callback();

    const now = Date.now();
    const drift = now - expected;
    expected += interval * 1000; // next expected time
    // the next expected time will actually occur sooner than the interval by a few milliseconds

    setTimeout(tick, Math.max(0, interval * 1000 - drift)); // max is to prevent negative timeout
  };

  const timerId = setTimeout(tick, interval * 1000); // set the next timer

  return timerId;
};

export const stopTimer = (timerId: NodeJS.Timeout): void => {
  clearTimeout(timerId);
};
