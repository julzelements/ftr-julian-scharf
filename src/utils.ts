export const displayNumbers = (numberMap: Map<number, number>) => {
  return Array.from(numberMap.entries())
    .map(([key, value]) => `${key}:${value}`)
    .join(", ");
};

export const getNewNumberMap = (numberMap: Map<number, number>, number: number) => {
  const curr = numberMap.get(number);
  return new Map([...numberMap, [number, (curr || 0) + 1]]);
};

export const getValidInteger = (input: string): false | number => {
  const num = parseFloat(input);
  return Number.isInteger(num) && num !== 0 ? num : false;
};

export const getFibonacciMap = (n: number): Map<string, number> => {
  let fibs = [BigInt(0), BigInt(1)];

  for (let i = 2; i <= n; i++) {
    fibs[i] = fibs[i - 1] + fibs[i - 2];
  }

  let fibsMap = new Map();
  for (let i = 0; i <= n; i++) {
    fibsMap.set(fibs[i].toString(), i.toString());
  }

  return fibsMap;
};
