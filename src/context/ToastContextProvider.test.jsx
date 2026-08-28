import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToastContextProvider from "./ToastContextProvider";
import useToast from "../hooks/useToast";

const TestConsumer = () => {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast("Note saved", "success")}>
      Trigger
    </button>
  );
};

describe("ToastContextProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders no toast initially", () => {
    render(
      <ToastContextProvider>
        <TestConsumer />
      </ToastContextProvider>
    );

    expect(screen.queryByText("Note saved")).not.toBeInTheDocument();
  });

  it("shows a toast when showToast is called via the hook", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastContextProvider>
        <TestConsumer />
      </ToastContextProvider>
    );

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.getByText("Note saved")).toBeInTheDocument();
  });

  it("automatically hides the toast after its timeout elapses", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastContextProvider>
        <TestConsumer />
      </ToastContextProvider>
    );

    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByText("Note saved")).toBeInTheDocument();

    vi.advanceTimersByTime(3000);

    await waitFor(() =>
      expect(screen.queryByText("Note saved")).not.toBeInTheDocument()
    );
  });
});
