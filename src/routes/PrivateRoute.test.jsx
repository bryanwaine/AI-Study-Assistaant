import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import PrivateRoute from "./PrivateRoute";

const mockUseAuth = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

const renderWithRoutes = (initialEntry = "/dashboard") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("PrivateRoute", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("renders the protected route when a user is logged in", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "uid-1" } });

    renderWithRoutes();

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("redirects to /login when no user is logged in", () => {
    mockUseAuth.mockReturnValue({ user: null });

    renderWithRoutes();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Page")).not.toBeInTheDocument();
  });
});
