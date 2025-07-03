import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

/**
 * Adds a user to the Firestore database.
 *
 * @param {{ userName: string, email: string }} data - The data to be added to the database.
 * @returns {Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>} - A promise that resolves to a DocumentReference
 *   of the newly created user document.
 */
const addUser = ({ userName, email }) => {
  return addDoc(collection(db, "users"), {
    userName,
    email,
  });
};

/**
 * Sets or updates a Google user in the Firestore database.
 *
 * @param {Object} param0 - An object containing the user details.
 * @param {string} param0.userId - The unique identifier of the user.
 * @param {string} param0.userName - The name of the user.
 * @param {string} param0.email - The email address of the user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user document
 *   has been successfully set or updated in the database.
 */
const setGoogleUser = ({ userId, userName, email }) => { 
  return setDoc(doc(db, "users", userId), {
    userName,
    email
  }, { merge: true });
}

export { auth, googleProvider, db, addUser, setGoogleUser };
