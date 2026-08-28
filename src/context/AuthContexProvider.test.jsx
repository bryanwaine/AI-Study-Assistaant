import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../firebase", () => ({
  auth: "mock-auth",
  googleProvider: "mock-google-provider",
}));

const showToastMock = vi.fn();
vi.mock("../hooks/useToast", () => ({
  default: () => ({ showToast: showToastMock }),
}));

const onAuthStateChangedMock = vi.fn();
const signInWithPopupMock = vi.fn();
const createUserWithEmailAndPasswordMock = vi.fn();
const updateProfileMock = vi.fn();
const signInWithEmailAndPasswordMock = vi.fn();
const signOutMock = vi.fn();
const sendPasswordResetEmailMock = vi.fn();

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args) => onAuthStateChangedMock(...args),
  signInWithPopup: (...args) => signInWithPopupMock(...args),
  createUserWithEmailAndPassword: (...args) =>
    createUserWithEmailAndPasswordMock(...args),
  updateProfile: (...args) => updateProfileMock(...args),
  signInWithEmailAndPassword: (...args) => signInWithEmailAndPasswordMock(...args),
  signOut: (...args) => signOutMock(...args),
  sendPasswordResetEmail: (...args) => sendPasswordResetEmailMock(...args),
}));

const { default: AuthContextProvider } = await import("./AuthContexProvider");
const { default: useAuth } = await import("../hooks/useAuth");

const TestConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="user">{auth.user ? auth.user.email : "no-user"}</span>
      <button onClick={() => auth.login("a@b.com", "password")}>login</button>
      <button onClick={() => auth.logout()}>logout</button>
      <button onClick={() => auth.resetPassword("a@b.com")}>reset</button>
      <button onClick={() => auth.logInWithGoogle().catch(() => {})}>google</button>
    </div>
  );
};

describe("AuthContextProvider", () => {
  beforeEach(() => {
    showToastMock.mockReset();
    onAuthStateChangedMock.mockReset();
    signInWithPopupMock.mockReset();
    createUserWithEmailAndPasswordMock.mockReset();
    updateProfileMock.mockReset();
    signInWithEmailAndPasswordMock.mockReset();
    signOutMock.mockReset();
    sendPasswordResetEmailMock.mockReset();
  });

  it("shows a loader while the initial auth state is resolving", () => {
    onAuthStateChangedMock.mockImplementation(() => () => {});

    const { container } = render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    expect(container.querySelector(".spinner-overlay")).toBeInTheDocument();
    expect(screen.queryByTestId("user")).not.toBeInTheDocument();
  });

  it("renders children with no user once auth resolves to signed-out", async () => {
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("no-user")
    );
  });

  it("populates the user from the reloaded firebase user", async () => {
    const firebaseUser = {
      reload: vi.fn().mockResolvedValue(undefined),
      auth: {
        currentUser: {
          uid: "uid-1",
          email: "a@b.com",
          displayName: "Ada Lovelace",
          photoURL: null,
          metadata: { creationTime: "2024-01-01" },
        },
      },
    };
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(firebaseUser);
      return () => {};
    });

    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("a@b.com")
    );
    expect(firebaseUser.reload).toHaveBeenCalledTimes(1);
  });

  it("shows an error toast when resolving the auth user throws", async () => {
    const brokenUser = {
      reload: vi.fn().mockRejectedValue({ code: "auth/network-request-failed" }),
      auth: { currentUser: {} },
    };
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(brokenUser).catch(() => {});
      return () => {};
    });

    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() =>
      expect(showToastMock).toHaveBeenCalledWith(
        "Network error. Please check your connection.",
        "error"
      )
    );
  });

  it("delegates login to firebase's signInWithEmailAndPassword", async () => {
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });
    signInWithEmailAndPasswordMock.mockResolvedValue({ user: { uid: "uid-1" } });

    const testUser = userEvent.setup();
    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() => screen.getByText("login"));
    await testUser.click(screen.getByText("login"));

    expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(
      "mock-auth",
      "a@b.com",
      "password"
    );
  });

  it("delegates logout to firebase's signOut", async () => {
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });
    signOutMock.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() => screen.getByText("logout"));
    await user.click(screen.getByText("logout"));

    expect(signOutMock).toHaveBeenCalledWith("mock-auth");
  });

  it("delegates resetPassword to firebase's sendPasswordResetEmail", async () => {
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });
    sendPasswordResetEmailMock.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() => screen.getByText("reset"));
    await user.click(screen.getByText("reset"));

    expect(sendPasswordResetEmailMock).toHaveBeenCalledWith("mock-auth", "a@b.com");
  });

  it("surfaces a friendly error toast when Google sign-in fails", async () => {
    onAuthStateChangedMock.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });
    signInWithPopupMock.mockRejectedValue({ code: "auth/too-many-requests" });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(
      <AuthContextProvider>
        <TestConsumer />
      </AuthContextProvider>
    );

    await waitFor(() => screen.getByText("google"));
    await user.click(screen.getByText("google"));

    await waitFor(() =>
      expect(showToastMock).toHaveBeenCalledWith(
        "Too many attempts. Try again later.",
        "error"
      )
    );
    consoleSpy.mockRestore();
  });
});
