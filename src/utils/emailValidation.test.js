import { describe, it, expect } from "vitest";
import emailValidation from "./emailValidation";

describe("emailValidation", () => {
  it("returns true for a valid email", () => {
    expect(emailValidation("test@example.com")).toBe(true);
  });

  it("returns true for a valid email with surrounding whitespace", () => {
    expect(emailValidation("  test@example.com  ")).toBe(true);
  });

  it("returns false when missing the @ symbol", () => {
    expect(emailValidation("testexample.com")).toBe(false);
  });

  it("returns false when missing a domain extension", () => {
    expect(emailValidation("test@example")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(emailValidation("")).toBe(false);
  });

  it("returns false for whitespace only", () => {
    expect(emailValidation("   ")).toBe(false);
  });
});
