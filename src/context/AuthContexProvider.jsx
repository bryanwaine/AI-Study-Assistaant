import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import AuthContext from "./AuthContext";

import { auth, googleProvider } from "../firebase";
import useToast from "../hooks/useToast";
import Loader from "../components/Loader/Loader";
import handleFirebaseError from "../utils/firebaseErrorhandler";

// provider
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        const {
          uid,
          email,
          displayName,
          photoURL,
          metadata: { creationTime },
        } = user.auth.currentUser;
        setUser({
          uid,
          email,
          displayName,
          photoURL,
          creationTime,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logInWithGoogle = async () => {
    const { signInWithPopup } = await import("firebase/auth");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error(error);
      showToast(handleFirebaseError(error).message, "error");
      throw error;
    }
  };
  const signup = async (email, password) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = async (displayName, photoURL = null) => {
    const { updateProfile } = await import("firebase/auth");
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  };

  const login = async (email, password) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    const { signOut } = await import("firebase/auth");
    return signOut(auth);
  };

  const resetPassword = async (email) => {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        updateUser,
        login,
        logout,
        resetPassword,
        logInWithGoogle,
      }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
