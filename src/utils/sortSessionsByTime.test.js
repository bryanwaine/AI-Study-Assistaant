import { describe, it, expect } from "vitest";
import sortSessionsByTime from "./sortSessionsByTime";

const makeSession = (id, date) => ({
  id,
  metadata: { updatedAt: { toDate: () => new Date(date) } },
});

describe("sortSessionsByTime", () => {
  it("sorts sessions by most recently updated first", () => {
    const sessions = [
      makeSession("older", "2024-01-01"),
      makeSession("newest", "2024-03-01"),
      makeSession("middle", "2024-02-01"),
    ];

    const sorted = sortSessionsByTime(sessions);

    expect(sorted.map((s) => s.id)).toEqual(["newest", "middle", "older"]);
  });

  it("returns an empty array unchanged", () => {
    expect(sortSessionsByTime([])).toEqual([]);
  });

  it("leaves a single-item array unchanged", () => {
    const sessions = [makeSession("only", "2024-01-01")];
    expect(sortSessionsByTime(sessions)).toEqual(sessions);
  });
});
