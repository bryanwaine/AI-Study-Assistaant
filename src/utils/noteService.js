import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";

/**
 * Saves a note for a user to the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {Array} summary - An array of objects representing the note's summary
 *   with the following format:
 *  
 *  */ 
const saveNote = async (userId, summary, title, fileName) => {
  const noteId = uuidv4();
  const metadata = {
    title,
    fileName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await setDoc(noteRef, {
    summary,
    metadata,
  });

  return noteId;
};

/**
 * Updates an existing note for a user in the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} noteId - The unique identifier of the note to be updated.
 * @param {Array} summary - An array of objects representing the updated summary of the note.
 *
 * @returns {Promise<void>} - A promise that resolves when the note has been successfully updated.
 */
const updateNote = async (userId, noteId, summary) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, {
    summary,
    "metadata.updatedAt": serverTimestamp(),
  });
};

/**
 * Fetches all the notes for a user from the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of notes. Each note is an object with properties:
 *   id: The unique identifier of the note.
 *   summary: An array of objects representing the note's summary.
 *   metadata: An object containing metadata about the note.
 */
const getAllNotes = async (userId) => {
  const notesRef = collection(db, "users", userId, "notes");
  const snapshot = await getDocs(notesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches a note for a user from the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} noteId - The unique identifier of the note to be fetched.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the note's data. The object has the following properties:
 *   summary: An array of objects representing the note's summary.
 *   metadata: An object containing metadata about the note.
 */
const getNote = async (userId, noteId) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  const snapshot = await getDoc(noteRef);
  return snapshot.data();
};

export { saveNote, updateNote, getAllNotes, getNote };
