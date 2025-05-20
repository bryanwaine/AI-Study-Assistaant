
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
  const messageTitle =
    messages[1]?.content.length > 100
      ? messages[1]?.content.slice(0, 100) + "..."
      : messages[1]?.content;
  const metadata = {
    title: messageTitle || "Chat Session",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    messageCount: messages.length,
  };
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  await setDoc(sessionRef, {
    messages,
    metadata,
  });

  return sessionId;
};

const updateSession = async (userId, sessionId, messages) => {
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  await updateDoc(sessionRef, {
    messages,
    "metadata.updatedAt": serverTimestamp(),
    "metadata.messageCount": messages.length,
  });
};

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
