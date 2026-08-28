import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ResetPassword from "./ResetPassword";

const mockUseAuth = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

const showToastMock = vi.fn();
vi.mock("../hooks/useToast", () => ({
  default: () => ({ showToast: showToastMock }),
}));

const renderResetPassword = () =>
  render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>
  );

describe("ResetPassword page", () => {
  let resetPasswordMock;

  beforeEach(() => {
    showToastMock.mockReset();
    resetPasswordMock = vi.fn();
    mockUseAuth.mockReturnValue({ resetPassword: resetPasswordMock });
  });

  it("renders the email field with the submit button disabled initially", () => {
    renderResetPassword();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Email" })
    ).toBeDisabled();
  });

  it("keeps the submit button disabled for an invalid email", async () => {
    const user = userEvent.setup();
    renderResetPassword();

    await user.type(screen.getByLabelText("Email"), "not-an-email");

    expect(
      screen.getByRole("button", { name: "Send Reset Email" })
    ).toBeDisabled();
  });

  it("sends the reset email and shows the success screen", async () => {
    resetPasswordMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderResetPassword();

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: "Send Reset Email" }));

    expect(resetPasswordMock).toHaveBeenCalledWith("a@b.com");
    expect(showToastMock).toHaveBeenCalledWith(
      "Password reset email sent",
      "success"
    );
    expect(await screen.findByText(/Password reset link sent/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Login" })).toBeInTheDocument();
  });

  it("shows an error toast when sending the reset email fails", async () => {
    resetPasswordMock.mockRejectedValue({ code: "auth/user-not-found" });
    const user = userEvent.setup();
    renderResetPassword();

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: "Send Reset Email" }));

    expect(showToastMock).toHaveBeenCalledWith(
      "No account found with this email.",
      "error"
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
