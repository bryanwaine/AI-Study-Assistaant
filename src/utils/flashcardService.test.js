import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../firebase", () => ({ db: "mock-db" }));

const collectionMock = vi.fn((...args) => ({ type: "collection", args }));
const docMock = vi.fn((...args) => ({ type: "doc", args }));
const getDocsMock = vi.fn();
const getDocMock = vi.fn();
const setDocMock = vi.fn();
const serverTimestampMock = vi.fn(() => "mock-timestamp");

vi.mock("firebase/firestore", () => ({
  collection: (...args) => collectionMock(...args),
  doc: (...args) => docMock(...args),
  getDocs: (...args) => getDocsMock(...args),
  getDoc: (...args) => getDocMock(...args),
  setDoc: (...args) => setDocMock(...args),
  serverTimestamp: (...args) => serverTimestampMock(...args),
}));

vi.mock("uuid", () => ({ v4: () => "generated-deck-id" }));

const { saveDeck, getAllDecks, getDeck } = await import("./flashcardService");

describe("flashcardService", () => {
  beforeEach(() => {
    collectionMock.mockClear();
    docMock.mockClear();
    getDocsMock.mockReset();
    getDocMock.mockReset();
    setDocMock.mockReset();
    serverTimestampMock.mockClear();
  });

  describe("saveDeck", () => {
    it("writes the deck with metadata and returns the generated id", async () => {
      setDocMock.mockResolvedValue(undefined);

      const deck = [{ front: "Q1", back: "A1" }];
      const deckId = await saveDeck("user-1", deck, "My Deck", 1);

      expect(deckId).toBe("generated-deck-id");
      expect(docMock).toHaveBeenCalledWith(
        "mock-db",
        "users",
        "user-1",
        "flashcards",
        "generated-deck-id"
      );
      expect(setDocMock).toHaveBeenCalledWith(
        { type: "doc", args: ["mock-db", "users", "user-1", "flashcards", "generated-deck-id"] },
        {
          deck,
          metadata: { title: "My Deck", createdAt: "mock-timestamp", cardCount: 1 },
        }
      );
    });
  });

  describe("getAllDecks", () => {
    it("maps firestore documents into deck objects with their ids", async () => {
      getDocsMock.mockResolvedValue({
        docs: [
          { id: "deck-1", data: () => ({ deck: [], metadata: { title: "A" } }) },
          { id: "deck-2", data: () => ({ deck: [], metadata: { title: "B" } }) },
        ],
      });

      const decks = await getAllDecks("user-1");

      expect(collectionMock).toHaveBeenCalledWith("mock-db", "users", "user-1", "flashcards");
      expect(decks).toEqual([
        { id: "deck-1", deck: [], metadata: { title: "A" } },
        { id: "deck-2", deck: [], metadata: { title: "B" } },
      ]);
    });

    it("returns an empty array when the user has no decks", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });
      const decks = await getAllDecks("user-1");
      expect(decks).toEqual([]);
    });
  });

  describe("getDeck", () => {
    it("returns the deck data for the given deck id", async () => {
      const deckData = { deck: [{ front: "Q", back: "A" }], metadata: { title: "Deck" } };
      getDocMock.mockResolvedValue({ data: () => deckData });

      const result = await getDeck("user-1", "deck-1");

      expect(docMock).toHaveBeenCalledWith("mock-db", "users", "user-1", "flashcards", "deck-1");
      expect(result).toEqual(deckData);
    });
  });
});
