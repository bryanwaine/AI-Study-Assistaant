import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Layout from "./Layout";

const mockUseAuth = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

const showToastMock = vi.fn();
vi.mock("../hooks/useToast", () => ({
  default: () => ({ showToast: showToastMock }),
}));

const getAllSessionsMock = vi.fn();
vi.mock("../utils/sessionService", () => ({
  getAllSessions: (...args) => getAllSessionsMock(...args),
}));

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderLayout = (props = {}) =>
  render(
    <MemoryRouter>
      <Layout userName="Ada" {...props} />
    </MemoryRouter>
  );

describe("Layout", () => {
  let logoutMock;

  beforeEach(() => {
    showToastMock.mockReset();
    navigateMock.mockReset();
    getAllSessionsMock.mockReset();
    logoutMock = vi.fn();
    mockUseAuth.mockReturnValue({
      user: {
        uid: "uid-1",
        displayName: "Ada Lovelace",
        email: "ada@example.com",
        photoURL: null,
      },
      logout: logoutMock,
    });
  });

  it("fetches the user's sessions on mount", async () => {
    getAllSessionsMock.mockResolvedValue([]);
    renderLayout();

    await waitFor(() =>
      expect(getAllSessionsMock).toHaveBeenCalledWith("uid-1")
    );
  });

  it("renders the header, menu, and sidebar shell", () => {
    getAllSessionsMock.mockResolvedValue([]);
    const { container } = renderLayout();

    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector(".menu")).toBeInTheDocument();
    expect(container.querySelector(".sidebar")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("logs out, shows a goodbye toast, and navigates to /login", async () => {
    getAllSessionsMock.mockResolvedValue([]);
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByText("Logout"));

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(showToastMock).toHaveBeenCalledWith("Goodbye Ada!", "success");
    expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true });
  });
});
