import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Login from "./Login";

const mockUseAuth = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

const showToastMock = vi.fn();
vi.mock("../hooks/useToast", () => ({
  default: () => ({ showToast: showToastMock }),
}));

vi.mock("../firebase", () => ({
  setGoogleUser: vi.fn().mockResolvedValue(undefined),
}));

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login page", () => {
  let loginMock;
  let logInWithGoogleMock;

  beforeEach(() => {
    showToastMock.mockReset();
    navigateMock.mockReset();
    loginMock = vi.fn();
    logInWithGoogleMock = vi.fn();
    mockUseAuth.mockReturnValue({
      login: loginMock,
      logInWithGoogle: logInWithGoogleMock,
      user: null,
    });
  });

  it("renders the login form with the submit button disabled initially", () => {
    renderLogin();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  it("enables the submit button once a valid email and password are entered", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password1");

    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

  it("keeps the submit button disabled when the password is too short", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "short");

    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  it("logs in, shows a welcome toast, and navigates on success", async () => {
    loginMock.mockResolvedValue({ user: { displayName: "Ada Lovelace" } });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(loginMock).toHaveBeenCalledWith("a@b.com", "password1");
    expect(showToastMock).toHaveBeenCalledWith("Welcome back Ada!", "success");
    expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("shows an error toast when login fails", async () => {
    loginMock.mockRejectedValue({ code: "auth/invalid-credential" });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(showToastMock).toHaveBeenCalledWith("Invalid email or password.", "error");
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard when a user is already logged in", () => {
    mockUseAuth.mockReturnValue({
      login: loginMock,
      logInWithGoogle: logInWithGoogleMock,
      user: { uid: "uid-1" },
    });

    renderLogin();

    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });
});
