import { describe, it, expect } from "vitest";
import capitalizeFirstLetter from "./capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter of a lowercase word", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("leaves an already capitalized word unchanged", () => {
    expect(capitalizeFirstLetter("World")).toBe("World");
  });

  it("does not alter the rest of the string", () => {
    expect(capitalizeFirstLetter("javaScript")).toBe("JavaScript");
  });

  it("handles a single character string", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });

  it("returns an empty string for an empty input", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });
});
