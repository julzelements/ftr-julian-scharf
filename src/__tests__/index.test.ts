import { add } from "../index";

describe("index", () => {
  it("should return 1", () => {
    expect(add(1, 1)).toBe(2);
  });
});
