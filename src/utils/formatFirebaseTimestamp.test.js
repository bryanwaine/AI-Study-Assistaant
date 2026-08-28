import { describe, it, expect, vi } from "vitest";
import formatFirebaseTimestamp from "./formatFirebaseTimestamp";

describe("formatFirebaseTimestamp", () => {
  it("formats a valid Firebase timestamp-like object", () => {
    const timestamp = { toDate: () => new Date(2024, 4, 3, 14, 30) };
    expect(formatFirebaseTimestamp(timestamp)).toBe("03 May 2024, 02:30 PM");
  });

  it("returns 'Invalid date' when the timestamp is null", () => {
    expect(formatFirebaseTimestamp(null)).toBe("Invalid date");
  });

  it("returns 'Invalid date' when the timestamp is undefined", () => {
    expect(formatFirebaseTimestamp(undefined)).toBe("Invalid date");
  });

  it("returns 'Invalid date' when toDate is not a function", () => {
    expect(formatFirebaseTimestamp({ toDate: "not-a-function" })).toBe(
      "Invalid date"
    );
  });

  it("returns 'Error formatting date' and logs when toDate throws", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const timestamp = {
      toDate: () => {
        throw new Error("boom");
      },
    };
    expect(formatFirebaseTimestamp(timestamp)).toBe("Error formatting date");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
