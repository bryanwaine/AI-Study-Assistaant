import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the message with the correct type class", () => {
    render(<Toast message="Saved!" type="success" onClose={() => {}} />);
    const toast = screen.getByText("Saved!");
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass("toast", "toast-success");
  });

  it("calls onClose automatically after 3 seconds", () => {
    const onClose = vi.fn();
    render(<Toast message="Saved!" type="success" onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears the timer on unmount without calling onClose again", () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Toast message="Saved!" type="success" onClose={onClose} />
    );

    unmount();
    vi.advanceTimersByTime(3000);

    expect(onClose).not.toHaveBeenCalled();
  });
});
