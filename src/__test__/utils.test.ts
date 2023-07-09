import { displayNumbers, getValidInteger, getNewNumberMap } from "../utils";

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

describe("getValidInteger", () => {
  it("returns false for invalid input", () => {
    expect(getValidInteger("a")).toBe(false);
    expect(getValidInteger("1.1")).toBe(false);
    expect(getValidInteger("")).toBe(false);
    expect(getValidInteger(" ")).toBe(false);
    expect(getValidInteger("0")).toBe(false);
  });

  it("returns the integer for valid input", () => {
    expect(getValidInteger("1")).toBe(1);
    expect(getValidInteger("10")).toBe(10);
    expect(getValidInteger("100")).toBe(100);
  });
});
