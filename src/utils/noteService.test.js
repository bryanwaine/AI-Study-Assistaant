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

vi.mock("uuid", () => ({ v4: () => "generated-note-id" }));

const { saveNote, updateNote, getAllNotes, getNote } = await import("./noteService");

describe("noteService", () => {
  beforeEach(() => {
    collectionMock.mockClear();
    docMock.mockClear();
    getDocsMock.mockReset();
    getDocMock.mockReset();
    setDocMock.mockReset();
    updateDocMock.mockReset();
    serverTimestampMock.mockClear();
  });

  describe("saveNote", () => {
    it("writes the note with metadata and returns the generated id", async () => {
      setDocMock.mockResolvedValue(undefined);

      const summary = [{ heading: "Intro", content: "..." }];
      const noteId = await saveNote("user-1", summary, "My Note", "notes.pdf");

      expect(noteId).toBe("generated-note-id");
      expect(setDocMock).toHaveBeenCalledWith(
        { type: "doc", args: ["mock-db", "users", "user-1", "notes", "generated-note-id"] },
        {
          summary,
          metadata: {
            title: "My Note",
            fileName: "notes.pdf",
            createdAt: "mock-timestamp",
            updatedAt: "mock-timestamp",
          },
        }
      );
    });
  });

  describe("updateNote", () => {
    it("updates the note's summary and updatedAt timestamp", async () => {
      updateDocMock.mockResolvedValue(undefined);
      const summary = [{ heading: "Updated", content: "..." }];

      await updateNote("user-1", "note-1", summary);

      expect(docMock).toHaveBeenCalledWith("mock-db", "users", "user-1", "notes", "note-1");
      expect(updateDocMock).toHaveBeenCalledWith(
        { type: "doc", args: ["mock-db", "users", "user-1", "notes", "note-1"] },
        { summary, "metadata.updatedAt": "mock-timestamp" }
      );
    });
  });

  describe("getAllNotes", () => {
    it("maps firestore documents into note objects with their ids", async () => {
      getDocsMock.mockResolvedValue({
        docs: [{ id: "note-1", data: () => ({ summary: [], metadata: { title: "A" } }) }],
      });

      const notes = await getAllNotes("user-1");

      expect(collectionMock).toHaveBeenCalledWith("mock-db", "users", "user-1", "notes");
      expect(notes).toEqual([{ id: "note-1", summary: [], metadata: { title: "A" } }]);
    });
  });

  describe("getNote", () => {
    it("returns the note data for the given note id", async () => {
      const noteData = { summary: [], metadata: { title: "Note" } };
      getDocMock.mockResolvedValue({ data: () => noteData });

      const result = await getNote("user-1", "note-1");

      expect(result).toEqual(noteData);
    });
  });
});
