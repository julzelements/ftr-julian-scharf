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
