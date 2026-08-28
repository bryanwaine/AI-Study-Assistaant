import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders a password field by default", () => {
    render(<PasswordInput value="" handleChange={() => {}} />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("toggles visibility when the show/hide control is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput value="secret" handleChange={() => {}} />);

    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "show password" });

    expect(input).toHaveAttribute("type", "password");

    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "hide password" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls handleChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PasswordInput value="" handleChange={handleChange} />);

    await user.type(screen.getByLabelText("Password"), "a");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders provided error content", () => {
    render(
      <PasswordInput
        value=""
        handleChange={() => {}}
        renderError={<span>Password too weak</span>}
      />
    );
    expect(screen.getByText("Password too weak")).toBeInTheDocument();
  });
});
