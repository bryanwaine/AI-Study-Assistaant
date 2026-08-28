import { describe, it, expect } from "vitest";
import sortFlashcardsByTime from "./sortFlashcardsByTime";

const makeCard = (id, date) => ({
  id,
  metadata: { createdAt: { toDate: () => new Date(date) } },
});

describe("sortFlashcardsByTime", () => {
  it("sorts decks newest first", () => {
    const decks = [
      makeCard("older", "2024-01-01"),
      makeCard("newest", "2024-03-01"),
      makeCard("middle", "2024-02-01"),
    ];

    const sorted = sortFlashcardsByTime(decks);

    expect(sorted.map((d) => d.id)).toEqual(["newest", "middle", "older"]);
  });

  it("returns an empty array unchanged", () => {
    expect(sortFlashcardsByTime([])).toEqual([]);
  });

  it("leaves a single-item array unchanged", () => {
    const decks = [makeCard("only", "2024-01-01")];
    expect(sortFlashcardsByTime(decks)).toEqual(decks);
  });
});
