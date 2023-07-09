import { displayNumbers, getValidInteger, getNewNumberMap, fibonacciMap } from "../utils";

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

describe("fibonacciMap", () => {
  it("returns the fibonacci sequence up to n", () => {
    const fibMap = fibonacciMap(10);
    console.log(fibMap);
    // technically i should remove this 0 => 0 but it's an invalid input anyway
    // strictly speaking the sequence starts with 1
    expect(fibMap.get("0")).toEqual("0");
    // 1 is the first and second fib number.
    // But they way we use this map,
    // we only care about 1 having an entry, so it's ok to have 1 => 2
    expect(fibMap.get("1")).toEqual("2");
    expect(fibMap.get("2")).toEqual("3");
    expect(fibMap.get("3")).toEqual("4");
    expect(fibMap.get("5")).toEqual("5");
    expect(fibMap.get("8")).toEqual("6");
    expect(fibMap.get("13")).toEqual("7");
    expect(fibMap.get("21")).toEqual("8");
    expect(fibMap.get("34")).toEqual("9");
    expect(fibMap.get("55")).toEqual("10");
  });
  it("correctly calculated the 1000th fibonacci number", () => {
    // check out http://www.fullbooks.com/The-first-1001-Fibonacci-Numbers.html
    // here: http://homepage.cs.uiowa.edu/~sriram/21/fall07/code/FastFibonacci.out#:~:text=The%201000th%20Fibonacci%20number%20is,4%20milliseconds%20to%20compute%20it.
    const fibMap = fibonacciMap(1000);
    expect(
      fibMap.get(
        "43466557686937456435688527675040625802564660517371780402481729089536555417949051890403879840079255169295922593080322634775209689623239873322471161642996440906533187938298969649928516003704476137795166849228875"
      )
    ).toEqual("1000");
  });
});
