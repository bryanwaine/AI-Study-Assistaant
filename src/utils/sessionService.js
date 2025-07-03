
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

/**
 * Saves a session of messages for a user to the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {Array} messages - An array of objects representing the messages in the session.
 *   Each object should contain a "role" property with the value "user" or "AI" and
 *   a "content" property with the message content.
 *
 * @returns {Promise<string>} - A promise that resolves to the unique identifier of the
 *   session.
 */
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

/**
 * Updates an existing session of messages for a user in the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} sessionId - The unique identifier of the session to be updated.
 * @param {Array} messages - An array of objects representing the messages in the session.
 *   Each object should contain a "role" property with the value "user" or "AI" and
 *   a "content" property with the message content.
 *
 * @returns {Promise<void>} - A promise that resolves when the session has been successfully updated.
 */
const updateSession = async (userId, sessionId, messages) => {
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  await updateDoc(sessionRef, {
    messages,
    "metadata.updatedAt": serverTimestamp(),
    "metadata.messageCount": messages.length,
  });
};

/**
 * Fetches all the sessions for a user from the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of sessions. Each session is an object with the following properties:
 *   id: The unique identifier of the session.
 *   messages: An array of objects representing the messages in the session.
 *   metadata: An object containing metadata about the session.
 */
const getAllSessions = async (userId) => {
  const sessionsRef = collection(db, "users", userId, "sessions");
  const snapshot = await getDocs(sessionsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches a session of messages for a user from the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} sessionId - The unique identifier of the session to be fetched.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the session's data. The object has the following properties:
 *   messages: An array of objects representing the messages in the session.
 *   metadata: An object containing metadata about the session.
 */
const getSession = async (userId, sessionId) => {
  const sessionRef = doc(db, "users", userId, "sessions", sessionId);
  const snapshot = await getDoc(sessionRef);
  return snapshot.data();
};

export { saveSession, updateSession, getAllSessions, getSession };
