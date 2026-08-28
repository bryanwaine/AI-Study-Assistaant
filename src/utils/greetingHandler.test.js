import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import handleGreeting from "./greetingHandler";

describe("handleGreeting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a morning greeting before noon", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 9, 0, 0));
    expect(handleGreeting("Ada")).toBe("Good Morning, Ada 🌤️");
  });

  it("returns an afternoon greeting before 6pm", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 14, 0, 0));
    expect(handleGreeting("Ada")).toBe("Good Afternoon, Ada 🌞");
  });

  it("returns an evening greeting at or after 6pm", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 20, 0, 0));
    expect(handleGreeting("Ada")).toBe("Good Evening, Ada 🌛");
  });

  it("returns a morning greeting right at the lower boundary", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 0, 0, 0));
    expect(handleGreeting("Ada")).toBe("Good Morning, Ada 🌤️");
  });

  it("returns an evening greeting right at the 18:00 boundary", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 18, 0, 0));
    expect(handleGreeting("Ada")).toBe("Good Evening, Ada 🌛");
  });
});
