import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import AuthContext from "./AuthContext";
import useToast from "../hooks/useToast";
import errorHandler from "../utils/errorHandler";
import Loader from "../components/Loader";

// provider
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        await user.reload();
        const { uid, email, displayName, photoURL, metadata: { creationTime } } = user.auth.currentUser;
        setUser({
          uid,
          email,
          displayName,
          photoURL,
          creationTime
        });
      } else {
        // User is signed out
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
      showToast(errorHandler(error), "error");
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
      value={{ user, signup, updateUser, login, logout, resetPassword, logInWithGoogle }}
    >
      {loading ? <Loader/> : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
