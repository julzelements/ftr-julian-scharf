export const startTimer = (interval: number, callback: () => void): NodeJS.Timeout => {
  return setInterval(callback, interval * 1000 || 3000);
};

export const stopTimer = (timerId: NodeJS.Timeout): void => {
  clearInterval(timerId);
};
