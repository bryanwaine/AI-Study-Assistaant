import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../firebase", () => ({ db: "mock-db" }));

const collectionMock = vi.fn((...args) => ({ type: "collection", args }));
const docMock = vi.fn((...args) => ({ type: "doc", args }));
const getDocsMock = vi.fn();
const getDocMock = vi.fn();
const setDocMock = vi.fn();
const updateDocMock = vi.fn();
const serverTimestampMock = vi.fn(() => "mock-timestamp");

vi.mock("firebase/firestore", () => ({
  collection: (...args) => collectionMock(...args),
  doc: (...args) => docMock(...args),
  getDocs: (...args) => getDocsMock(...args),
  getDoc: (...args) => getDocMock(...args),
  setDoc: (...args) => setDocMock(...args),
  updateDoc: (...args) => updateDocMock(...args),
  serverTimestamp: (...args) => serverTimestampMock(...args),
}));

vi.mock("uuid", () => ({ v4: () => "generated-session-id" }));

const { saveSession, updateSession, getAllSessions, getSession } = await import(
  "./sessionService"
);

describe("sessionService", () => {
  beforeEach(() => {
    collectionMock.mockClear();
    docMock.mockClear();
    getDocsMock.mockReset();
    getDocMock.mockReset();
    setDocMock.mockReset();
    updateDocMock.mockReset();
    serverTimestampMock.mockClear();
  });

  describe("saveSession", () => {
    it("uses the second message as the title when it is short", async () => {
      setDocMock.mockResolvedValue(undefined);
      const messages = [
        { role: "user", content: "Hi" },
        { role: "AI", content: "Hello, how can I help?" },
      ];

      const sessionId = await saveSession("user-1", messages);

      expect(sessionId).toBe("generated-session-id");
      expect(setDocMock).toHaveBeenCalledWith(
        { type: "doc", args: ["mock-db", "users", "user-1", "sessions", "generated-session-id"] },
        {
          messages,
          metadata: {
            title: "Hello, how can I help?",
            createdAt: "mock-timestamp",
            updatedAt: "mock-timestamp",
            messageCount: 2,
          },
        }
      );
    });

    it("truncates the title when the second message is longer than 100 characters", async () => {
      setDocMock.mockResolvedValue(undefined);
      const longContent = "x".repeat(150);
      const messages = [
        { role: "user", content: "Hi" },
        { role: "AI", content: longContent },
      ];

      await saveSession("user-1", messages);

      const [, payload] = setDocMock.mock.calls[0];
      expect(payload.metadata.title).toBe("x".repeat(100) + "...");
    });

    it("falls back to a default title when there is no second message", async () => {
      setDocMock.mockResolvedValue(undefined);
      const messages = [{ role: "user", content: "Hi" }];

      await saveSession("user-1", messages);

      const [, payload] = setDocMock.mock.calls[0];
      expect(payload.metadata.title).toBe("Chat Session");
    });
  });

  describe("updateSession", () => {
    it("updates messages and metadata fields", async () => {
      updateDocMock.mockResolvedValue(undefined);
      const messages = [{ role: "user", content: "a" }, { role: "AI", content: "b" }];

      await updateSession("user-1", "session-1", messages);

      expect(docMock).toHaveBeenCalledWith("mock-db", "users", "user-1", "sessions", "session-1");
      expect(updateDocMock).toHaveBeenCalledWith(
        { type: "doc", args: ["mock-db", "users", "user-1", "sessions", "session-1"] },
        {
          messages,
          "metadata.updatedAt": "mock-timestamp",
          "metadata.messageCount": 2,
        }
      );
    });
  });

  describe("getAllSessions", () => {
    it("maps firestore documents into session objects with their ids", async () => {
      getDocsMock.mockResolvedValue({
        docs: [{ id: "session-1", data: () => ({ messages: [], metadata: { title: "A" } }) }],
      });

      const sessions = await getAllSessions("user-1");

      expect(collectionMock).toHaveBeenCalledWith("mock-db", "users", "user-1", "sessions");
      expect(sessions).toEqual([{ id: "session-1", messages: [], metadata: { title: "A" } }]);
    });
  });

  describe("getSession", () => {
    it("returns the session data for the given session id", async () => {
      const sessionData = { messages: [], metadata: { title: "Session" } };
      getDocMock.mockResolvedValue({ data: () => sessionData });

      const result = await getSession("user-1", "session-1");

      expect(result).toEqual(sessionData);
    });
  });
});
