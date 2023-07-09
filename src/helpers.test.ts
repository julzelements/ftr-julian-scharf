import { displayNumbers, getNewNumberMap } from "./helpers";

describe("displayNumbers", () => {
  it("correctly displays numbers", () => {
    const numberMap = new Map();
    numberMap.set(1, 1);
    numberMap.set(2, 2);
    numberMap.set(3, 3);
    expect(displayNumbers(numberMap)).toBe("1:1, 2:2, 3:3");
  });
});

describe("getNewNumberMap", () => {
  it("gets a new numberMap with incremented number count", () => {
    const numberMap = new Map();
    numberMap.set(1, 1);
    numberMap.set(2, 2);
    numberMap.set(3, 3);
    expect(displayNumbers(getNewNumberMap(numberMap, 1))).toBe("1:2, 2:2, 3:3");
  });
});