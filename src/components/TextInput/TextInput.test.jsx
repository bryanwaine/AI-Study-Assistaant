import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextInput from "./TextInput";

describe("TextInput", () => {
  it("renders the label and current value", () => {
    render(
      <TextInput
        label="Email"
        type="email"
        id="email"
        name="email"
        value="a@b.com"
        handleChange={() => {}}
      />
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByDisplayValue("a@b.com")).toBeInTheDocument();
  });

  it("calls handleChange when the user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <TextInput
        label="Name"
        type="text"
        id="name"
        name="name"
        value=""
        handleChange={handleChange}
      />
    );

    await user.type(screen.getByRole("textbox"), "hi");

    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("renders provided error content", () => {
    render(
      <TextInput
        label="Email"
        type="email"
        id="email"
        name="email"
        value=""
        handleChange={() => {}}
        renderError={<li>Email is required</li>}
      />
    );

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });
});
