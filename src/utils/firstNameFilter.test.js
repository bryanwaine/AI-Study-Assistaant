import { describe, it, expect } from "vitest";
import firstNameFilter from "./firstNameFilter";

describe("firstNameFilter", () => {
  it("extracts and formats the first name from a full name", () => {
    expect(firstNameFilter("john doe")).toBe("John");
  });

  it("normalizes an all-uppercase first name", () => {
    expect(firstNameFilter("JANE SMITH")).toBe("Jane");
  });

  it("trims leading and trailing whitespace before extracting", () => {
    expect(firstNameFilter("  bob marley  ")).toBe("Bob");
  });

  it("handles a name with only a first name", () => {
    expect(firstNameFilter("cher")).toBe("Cher");
  });

  it("returns an empty string for an empty input", () => {
    expect(firstNameFilter("")).toBe("");
  });

  it("returns an empty string for undefined input", () => {
    expect(firstNameFilter(undefined)).toBe("");
  });

  it("returns an empty string for null input", () => {
    expect(firstNameFilter(null)).toBe("");
  });
});
