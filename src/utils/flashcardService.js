
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

/**
 * Saves a deck of flashcards for a user to the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {Array} deck - An array of flashcards in the deck.
 * @param {string} title - The title of the deck.
 * @param {number} cardCount - The number of flashcards in the deck.
 *
 * @returns {Promise<string>} - A promise that resolves to the unique identifier
 *   of the deck.
 */
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

/**
 * Fetches all the decks for a user from the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of decks. Each deck is an object with the following properties:
 *   id: The unique identifier of the deck.
 *   deck: An array of flashcards in the deck.
 *   metadata: An object containing metadata about the deck.
 */
const getAllDecks = async (userId) => {
  const deckRef = collection(db, "users", userId, "flashcards");
  const snapshot = await getDocs(deckRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches a deck of flashcards for a user from the Firestore database.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} deckId - The unique identifier of the deck.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the deck's data. The object has the following properties:
 *   deck: An array of flashcards in the deck.
 *   metadata: An object containing metadata about the deck.
 */
const getDeck = async (userId, deckId) => {
  const deckRef = doc(db, "users", userId, "flashcards", deckId);   
  const snapshot = await getDoc(deckRef);
  return snapshot.data();
};

export { saveDeck, getAllDecks, getDeck };
