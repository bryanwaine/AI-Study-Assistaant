import { describe, it, expect } from "vitest";
import { handleFirebaseError } from "./firebaseErrorhandler";

describe("handleFirebaseError", () => {
  it("returns a generic result when error is null", () => {
    expect(handleFirebaseError(null)).toEqual({
      code: null,
      message: "An unexpected error occurred. Please try again.",
      isFirebaseError: false,
    });
  });

  it("returns a generic result when error has no code", () => {
    expect(handleFirebaseError({ message: "oops" })).toEqual({
      code: null,
      message: "An unexpected error occurred. Please try again.",
      isFirebaseError: false,
    });
  });

  it("maps auth/invalid-credential to a friendly message", () => {
    const result = handleFirebaseError({ code: "auth/invalid-credential" });
    expect(result).toEqual({
      code: "auth/invalid-credential",
      message: "Invalid email or password.",
      isFirebaseError: true,
    });
  });

  it("maps auth/email-already-in-use to a friendly message", () => {
    const result = handleFirebaseError({ code: "auth/email-already-in-use" });
    expect(result.message).toBe("This email is already in use.");
  });

  it("maps Firestore permission-denied to a friendly message", () => {
    const result = handleFirebaseError({ code: "permission-denied" });
    expect(result.message).toBe(
      "You don’t have permission to perform this action."
    );
  });

  it("falls back to the raw error message for unknown codes", () => {
    const result = handleFirebaseError({
      code: "auth/some-unmapped-code",
      message: "custom message",
    });
    expect(result).toEqual({
      code: "auth/some-unmapped-code",
      message: "custom message",
      isFirebaseError: true,
    });
  });

  it("falls back to a generic message for unknown codes with no message", () => {
    const result = handleFirebaseError({ code: "auth/some-unmapped-code" });
    expect(result.message).toBe("An unknown Firebase error occurred.");
  });
});
