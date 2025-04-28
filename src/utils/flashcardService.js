
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const saveDeck = async (userId, deck, title, cardCount) => {
  const deckId = uuidv4();
  const metadata = {
    title,
    createdAt: serverTimestamp(),
    cardCount
  };
  const deckRef = doc(db, "users", userId, "flashcards", deckId);
  await setDoc(deckRef, {
    deck,
    metadata,
  });

  return deckId;
};

const getAllDecks = async (userId) => {
  const deckRef = collection(db, "users", userId, "flashcards");
  const snapshot = await getDocs(deckRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getDeck = async (userId, deckId) => {
  const deckRef = doc(db, "users", userId, "flashcards", deckId);   
  const snapshot = await getDoc(deckRef);
  return snapshot.data();
};

export { saveDeck, getAllDecks, getDeck };
