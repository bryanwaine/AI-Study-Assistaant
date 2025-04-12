import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import AuthContext from "./AuthContext";

// provider
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        await user.reload();
        const { uid, email, displayName, photoURL } = user.auth.currentUser;
        setUser({
          uid,
          email,
          displayName,
          photoURL
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
      
    });
    
    return unsubscribe;
  }, []);
  
  user ? console.log( user) : console.log("null");
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (displayName, photoURL = null) => {
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL
    });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signup, updateUser, login, logout }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
