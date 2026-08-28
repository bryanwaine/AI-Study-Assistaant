import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it.each([
    ["notes", "You don't have any notes yet"],
    ["flashcards", "You don't have any flashcards yet"],
    ["sessions", "You don't have any sessions yet"],
    ["quizzes", "You don't have any quizzes yet"],
  ])("renders the correct message for the %s page", (page, expectedText) => {
    render(<EmptyState page={page} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(
      screen.getByText("When you do, they will show up here.")
    ).toBeInTheDocument();
  });

  it("renders no icon for an unrecognized page", () => {
    const { container } = render(<EmptyState page="unknown" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
