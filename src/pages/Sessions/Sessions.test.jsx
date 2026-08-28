import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Sessions from "./Sessions";

const mockUseAuth = vi.fn();
vi.mock("../../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("../../components/Layout", () => ({
  default: () => <div data-testid="layout" />,
}));

const getAllSessionsMock = vi.fn();
vi.mock("../../utils/sessionService", () => ({
  getAllSessions: (...args) => getAllSessionsMock(...args),
}));

const makeSession = (id, title, messageCount, updatedAt) => ({
  id,
  metadata: {
    title,
    messageCount,
    createdAt: { toDate: () => new Date(updatedAt) },
    updatedAt: { toDate: () => new Date(updatedAt) },
  },
});

const renderSessions = () =>
  render(
    <MemoryRouter>
      <Sessions />
    </MemoryRouter>
  );

describe("Sessions page", () => {
  beforeEach(() => {
    getAllSessionsMock.mockReset();
    mockUseAuth.mockReturnValue({ user: { uid: "uid-1", displayName: "Ada" } });
  });

  it("shows a skeleton while sessions are loading", () => {
    getAllSessionsMock.mockReturnValue(new Promise(() => {}));
    const { container } = renderSessions();

    expect(container.querySelector(".skeleton__list")).toBeInTheDocument();
  });

  it("renders the empty state when the user has no sessions", async () => {
    getAllSessionsMock.mockResolvedValue([]);
    renderSessions();

    expect(
      await screen.findByText("You don't have any sessions yet")
    ).toBeInTheDocument();
  });

  it("renders the fetched sessions sorted by most recently updated", async () => {
    getAllSessionsMock.mockResolvedValue([
      makeSession("s1", "Older Session", 3, "2024-01-01"),
      makeSession("s2", "Newer Session", 5, "2024-03-01"),
    ]);
    const { container } = renderSessions();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".skeleton__list")
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Newer Session");
    expect(items[1]).toHaveTextContent("Older Session");
  });

  it("renders an error state when fetching sessions fails", async () => {
    getAllSessionsMock.mockRejectedValue({ status: 429 });
    renderSessions();

    expect(
      await screen.findByText(
        "Rate limit exceeded. Slow down and try again later."
      )
    ).toBeInTheDocument();
  });

  it("does not attempt to fetch sessions when there is no user", () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderSessions();

    expect(getAllSessionsMock).not.toHaveBeenCalled();
  });

  it("fetches sessions using the current user's id", async () => {
    getAllSessionsMock.mockResolvedValue([]);
    renderSessions();

    await waitFor(() =>
      expect(getAllSessionsMock).toHaveBeenCalledWith("uid-1")
    );
  });
});
