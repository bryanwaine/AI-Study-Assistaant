import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";

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

const updateNote = async (userId, noteId, summary) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, {
    summary,
    "metadata.updatedAt": serverTimestamp(),
  });
};

const getAllNotes = async (userId) => {
  const notesRef = collection(db, "users", userId, "notes");
  const snapshot = await getDocs(notesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getNote = async (userId, noteId) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  const snapshot = await getDoc(noteRef);
  return snapshot.data();
};

export { saveNote, updateNote, getAllNotes, getNote };
