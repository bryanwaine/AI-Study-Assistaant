import { useEffect, useState } from "react";

import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

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
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error(error);
      showToast(handleFirebaseError(error).message, "error");
      throw error;
    }
  };
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (displayName, photoURL = null) => {
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
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
