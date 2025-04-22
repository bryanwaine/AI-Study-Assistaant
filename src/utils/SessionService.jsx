// utils/SessionService.js
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const saveSession = async (userId, messages) => {
  const sessionId = uuidv4();
  const metadata = {
    title: messages[0]?.content.slice(0, 30) || "Chat Session",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    messageCount: messages.length,
  };
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  await setDoc(sessionRef, {
    messages,
    metadata,
  });

  //   const sessionKey = `sessionId_${userId}`;
  //   sessionStorage.setItem(sessionKey, sessionId);

  return sessionId;
};

const updateSession = async (userId, sessionId, messages) => {
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  await updateDoc(sessionRef, {
    messages,
    "metadata.updatedAt": serverTimestamp(),
  });
};

// const createSession = async (userId, firstMessage) => {
//   console.log("Creating session for user:", userId);
//   const sessionId = uuidv4();
//   const sessionRef = doc(db, "users", userId, "sessions", sessionId);
//   await setDoc(sessionRef, {
//     title: firstMessage.content.slice(0, 30) || "New Chat",
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//     messageCount: 1,
//     messages: {
//       [firstMessage.id]: firstMessage,
//     },
//   });
//   return sessionId;
// };

// const updateSession = async (userId, message) => {
//     const sessionId = uuidv4();

//   const sessionRef = doc(db, "users", userId, "sessions", sessionId);
//   await updateDoc(sessionRef, {
//     [`messages.${message.id}`]: message,
//     updatedAt: serverTimestamp(),
//     messageCount: increment(1),
//   });

//   return sessionId;
// };

const getAllSessions = async (userId) => {
  const sessionsRef = collection(db, "users", userId, "sessions");
  const snapshot = await getDocs(sessionsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getSession = async (userId, sessionId) => {
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  const snapshot = await getDoc(sessionRef);
  return snapshot.data();
};

export { saveSession, updateSession, getAllSessions, getSession };
