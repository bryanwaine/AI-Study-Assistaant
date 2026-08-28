import { describe, it, expect, vi, beforeEach } from "vitest";

const validatePasswordMock = vi.fn();
const getAuthMock = vi.fn(() => "mock-auth-instance");

vi.mock("firebase/auth", () => ({
  getAuth: (...args) => getAuthMock(...args),
  validatePassword: (...args) => validatePasswordMock(...args),
}));

const { default: passwordValidation } = await import("./passwordValidation");

describe("passwordValidation", () => {
  beforeEach(() => {
    validatePasswordMock.mockReset();
    getAuthMock.mockClear();
  });

  it("returns isPasswordValid true and no errors for a valid password", async () => {
    validatePasswordMock.mockResolvedValue({
      isValid: true,
      containsLowercaseLetter: true,
      containsUppercaseLetter: true,
      containsNumber: true,
      containsNonAlphanumericCharacter: true,
      meetsMinPasswordLength: true,
    });

    const result = await passwordValidation("Str0ng!Pass");

    expect(result).toEqual({ isPasswordValid: true, errors: [] });
  });

  it("collects an error for each unmet criterion", async () => {
    validatePasswordMock.mockResolvedValue({
      isValid: false,
      containsLowercaseLetter: false,
      containsUppercaseLetter: false,
      containsNumber: false,
      containsNonAlphanumericCharacter: false,
      meetsMinPasswordLength: false,
    });

    const result = await passwordValidation("bad");

    expect(result.isPasswordValid).toBe(false);
    expect(result.errors).toEqual([
      "Password must include at least one lowercase letter.",
      "Password must include at least one uppercase letter.",
      "Password must include at least one number.",
      "Password must include at least one special character.",
      "Password must be at least 8 characters long.",
    ]);
  });

  it("reports only the specific missing criteria", async () => {
    validatePasswordMock.mockResolvedValue({
      isValid: false,
      containsLowercaseLetter: true,
      containsUppercaseLetter: true,
      containsNumber: false,
      containsNonAlphanumericCharacter: true,
      meetsMinPasswordLength: true,
    });

    const result = await passwordValidation("NoNumbers!");

    expect(result.isPasswordValid).toBe(false);
    expect(result.errors).toEqual([
      "Password must include at least one number.",
    ]);
  });
});
