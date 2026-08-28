import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Notes from "./Notes";

const mockUseAuth = vi.fn();
vi.mock("../../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("../../components/Layout", () => ({
  default: () => <div data-testid="layout" />,
}));

const getAllNotesMock = vi.fn();
vi.mock("../../utils/noteService", () => ({
  getAllNotes: (...args) => getAllNotesMock(...args),
}));

const makeNote = (id, title, fileName, createdAt) => ({
  id,
  metadata: {
    title,
    fileName,
    createdAt: { toDate: () => new Date(createdAt) },
  },
});

const renderNotes = () =>
  render(
    <MemoryRouter>
      <Notes />
    </MemoryRouter>
  );

describe("Notes page", () => {
  beforeEach(() => {
    getAllNotesMock.mockReset();
    mockUseAuth.mockReturnValue({ user: { uid: "uid-1", displayName: "Ada" } });
  });

  it("shows a skeleton while notes are loading", () => {
    getAllNotesMock.mockReturnValue(new Promise(() => {}));
    const { container } = renderNotes();

    expect(container.querySelector(".skeleton__list")).toBeInTheDocument();
  });

  it("renders the empty state when the user has no notes", async () => {
    getAllNotesMock.mockResolvedValue([]);
    renderNotes();

    expect(
      await screen.findByText("You don't have any notes yet")
    ).toBeInTheDocument();
  });

  it("renders the fetched notes sorted by most recent", async () => {
    getAllNotesMock.mockResolvedValue([
      makeNote("n1", "Older Note", "old.pdf", "2024-01-01"),
      makeNote("n2", "Newer Note", "new.pdf", "2024-03-01"),
    ]);
    const { container } = renderNotes();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".skeleton__list")
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("NEWER NOTE");
    expect(items[1]).toHaveTextContent("OLDER NOTE");
  });

  it("renders an error state when fetching notes fails", async () => {
    getAllNotesMock.mockRejectedValue({ status: 500 });
    renderNotes();

    expect(
      await screen.findByText(
        "Server error from Anthropic. Please try again in a bit."
      )
    ).toBeInTheDocument();
  });

  it("fetches notes using the current user's id", async () => {
    getAllNotesMock.mockResolvedValue([]);
    renderNotes();

    await waitFor(() => expect(getAllNotesMock).toHaveBeenCalledWith("uid-1"));
  });
});
