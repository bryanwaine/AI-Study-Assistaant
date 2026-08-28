import { describe, it, expect } from "vitest";
import { handleAnthropicError } from "./anthropicErrorHandler";

describe("handleAnthropicError", () => {
  it("returns a friendly message for a 400 status", () => {
    const result = handleAnthropicError({ status: 400 });
    expect(result).toEqual({
      status: 400,
      message: "Invalid request. Please check your prompt or parameters.",
      isAnthropicError: true,
    });
  });

  it("returns a friendly message for a 401 status", () => {
    const result = handleAnthropicError({ status: 401 });
    expect(result.message).toBe(
      "Unauthorized. Check your API key or authentication headers."
    );
  });

  it("returns a friendly message for a 429 status", () => {
    const result = handleAnthropicError({ status: 429 });
    expect(result.message).toBe(
      "Rate limit exceeded. Slow down and try again later."
    );
  });

  it("reads the status from a nested response object", () => {
    const result = handleAnthropicError({ response: { status: 500 } });
    expect(result.status).toBe(500);
    expect(result.message).toBe(
      "Server error from Anthropic. Please try again in a bit."
    );
  });

  it("falls back to a nested API error message for unknown status codes", () => {
    const error = {
      status: 422,
      response: { data: { error: { message: "Unprocessable entity" } } },
    };
    const result = handleAnthropicError(error);
    expect(result.message).toBe("Unprocessable entity");
  });

  it("falls back to error.message when no nested API message exists", () => {
    const result = handleAnthropicError({ status: 999, message: "boom" });
    expect(result.message).toBe("boom");
  });

  it("returns a generic message when nothing informative is available", () => {
    const result = handleAnthropicError({});
    expect(result).toEqual({
      status: null,
      message: "An unexpected error occurred.",
      isAnthropicError: true,
    });
  });
});
