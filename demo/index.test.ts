import { Initial, ProcessInitialInput, Running, reduceInitial } from ".";

describe("Initial state", () => {
  it("should not transition to Running state when user enters start if name is undefined", () => {
    const action: ProcessInitialInput = { tag: "ProcessInitialInput", input: "start" };
    const state: Initial = { tag: "Initial" };
    const expected: Initial = { tag: "Initial" };
    expect(reduceInitial(action, state)).toEqual(expected);
  });
  it("should transition to Initial state when user enters their name", () => {
    const action: ProcessInitialInput = { tag: "ProcessInitialInput", input: "Bob" };
    const state: Initial = { tag: "Initial" };
    const expected: Initial = { tag: "Initial", name: "Bob" };
    expect(reduceInitial(action, state)).toEqual(expected);
  });
});
