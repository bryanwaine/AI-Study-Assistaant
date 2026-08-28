import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  it("renders the provided error message", () => {
    render(<ErrorState error="Failed to load notes" />);
    expect(screen.getByText("Failed to load notes")).toBeInTheDocument();
  });

  it("renders a default message when no error is provided", () => {
    render(<ErrorState />);
    expect(
      screen.getByText("Something went wrong. Please try again")
    ).toBeInTheDocument();
  });

  it("does not render a retry button when onResubmit is not provided", () => {
    render(<ErrorState error="Oops" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a retry button and calls onResubmit when clicked", async () => {
    const user = userEvent.setup();
    const onResubmit = vi.fn();
    render(<ErrorState error="Oops" onResubmit={onResubmit} />);

    const retryButton = screen.getByRole("button", { name: "Retry" });
    await user.click(retryButton);

    expect(onResubmit).toHaveBeenCalledTimes(1);
  });
});
