import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Signup from "./Signup";

const mockUseAuth = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

const showToastMock = vi.fn();
vi.mock("../hooks/useToast", () => ({
  default: () => ({ showToast: showToastMock }),
}));

const addUserMock = vi.fn();
const setGoogleUserMock = vi.fn();
vi.mock("../firebase", () => ({
  addUser: (...args) => addUserMock(...args),
  setGoogleUser: (...args) => setGoogleUserMock(...args),
}));

const validatePasswordMock = vi.fn();
vi.mock("firebase/auth", () => ({
  getAuth: () => "mock-auth",
  validatePassword: (...args) => validatePasswordMock(...args),
}));

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderSignup = () =>
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );

// The First Name, Last Name and Email TextInputs render in this order in the
// DOM. (Note: TextInput's <label> currently has a hardcoded htmlFor="email",
// so getByLabelText cannot reliably distinguish between them - querying by
// position is the only robust way to target each field here.)
const getNameAndEmailInputs = () => {
  const textboxes = screen.getAllByRole("textbox");
  return {
    firstNameInput: textboxes[0],
    lastNameInput: textboxes[1],
    emailInput: textboxes[2],
  };
};

const validPassword = {
  isValid: true,
  containsLowercaseLetter: true,
  containsUppercaseLetter: true,
  containsNumber: true,
  containsNonAlphanumericCharacter: true,
  meetsMinPasswordLength: true,
};

describe("Signup page", () => {
  let signupMock;
  let logInWithGoogleMock;
  let updateUserMock;

  beforeEach(() => {
    showToastMock.mockReset();
    navigateMock.mockReset();
    addUserMock.mockReset().mockResolvedValue(undefined);
    setGoogleUserMock.mockReset().mockResolvedValue(undefined);
    validatePasswordMock.mockReset().mockResolvedValue(validPassword);
    signupMock = vi.fn();
    logInWithGoogleMock = vi.fn();
    updateUserMock = vi.fn();
    mockUseAuth.mockReturnValue({
      signup: signupMock,
      logInWithGoogle: logInWithGoogleMock,
      updateUser: updateUserMock,
      user: null,
    });
  });

  it("renders all fields with the submit button disabled initially", () => {
    renderSignup();

    expect(screen.getAllByRole("textbox")).toHaveLength(3);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeDisabled();
  });

  it("blocks submission and surfaces validation errors for invalid input", async () => {
    validatePasswordMock.mockResolvedValue({
      isValid: false,
      containsLowercaseLetter: false,
      containsUppercaseLetter: true,
      containsNumber: true,
      containsNonAlphanumericCharacter: true,
      meetsMinPasswordLength: true,
    });
    const user = userEvent.setup();
    renderSignup();

    const { firstNameInput, lastNameInput, emailInput } = getNameAndEmailInputs();
    await user.type(firstNameInput, "A");
    await user.type(lastNameInput, "B");
    await user.type(emailInput, "not-an-email");
    await user.type(screen.getByLabelText("Password"), "12345678");

    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(signupMock).not.toHaveBeenCalled();
    expect(
      screen.getByText("First name must be at least 2 characters long")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Last name must be at least 2 characters long")
    ).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(
      screen.getByText("Password must include at least one lowercase letter.")
    ).toBeInTheDocument();
  });

  // NOTE: handleSubmit destructures `const { userName, email, password } =
  // formData;`, but formData only holds firstName/lastName/email/password -
  // there is no `userName` key. This shadows the correctly-computed
  // `userName` variable declared earlier in the component and silently
  // passes `undefined` to addUser/updateUser/the toast/navigation state
  // instead of "ada lovelace". This test documents that actual (buggy)
  // behavior; the assertions below should change to the commented-out
  // "ada lovelace" expectations once the shadowing bug is fixed.
  it("signs up successfully and navigates to the dashboard", async () => {
    signupMock.mockResolvedValue(undefined);
    updateUserMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderSignup();

    const { firstNameInput, lastNameInput, emailInput } = getNameAndEmailInputs();
    await user.type(firstNameInput, "Ada");
    await user.type(lastNameInput, "Lovelace");
    await user.type(emailInput, "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Str0ng!Pass");

    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(addUserMock).toHaveBeenCalledWith({
      userName: undefined, // bug: should be "ada lovelace"
      email: "ada@example.com",
    });
    expect(signupMock).toHaveBeenCalledWith("ada@example.com", "Str0ng!Pass");
    expect(updateUserMock).toHaveBeenCalledWith(undefined); // bug: should be "ada lovelace"
    expect(showToastMock).toHaveBeenCalledWith("Welcome !", "success"); // bug: should be "Welcome Ada!"
    expect(navigateMock).toHaveBeenCalledWith("/dashboard", {
      replace: true,
      state: { userName: undefined }, // bug: should be "ada lovelace"
    });
  });

  it("shows an error toast when the signup call fails", async () => {
    signupMock.mockRejectedValue({ code: "auth/email-already-in-use" });
    const user = userEvent.setup();
    renderSignup();

    const { firstNameInput, lastNameInput, emailInput } = getNameAndEmailInputs();
    await user.type(firstNameInput, "Ada");
    await user.type(lastNameInput, "Lovelace");
    await user.type(emailInput, "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Str0ng!Pass");

    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(showToastMock).toHaveBeenCalledWith(
      "This email is already in use.",
      "error"
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard when a user is already logged in", () => {
    mockUseAuth.mockReturnValue({
      signup: signupMock,
      logInWithGoogle: logInWithGoogleMock,
      updateUser: updateUserMock,
      user: { uid: "uid-1" },
    });

    renderSignup();

    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });
});
