import db from "../database/db.js";
import NotFoundError from "../errors/not-found.error.js";
import Sentence from "../models/sentence.model.js";

/**
 * Returns a list of sentences
 *
 * @param {number | null} page Page to return. If null, returns all sentences
 * @param {number} perPage Number of sentences to return per page
 * @param {string | null} category Category filter. If null, returns all categories
 * @param {string | null} sort "asc" or "desc"
 * @returns {Promise<Sentence[]>}
 */
export async function getSentenceList(page, perPage, category, sort) {
  let sentenceRef = db.collection("sentences");

  if (category) {
    sentenceRef = sentenceRef.where("category", "==", category);
  } else if (sort) {
    sentenceRef = sentenceRef.orderBy("category", sort);
  }

  if (page) {
    const offset = (page - 1) * perPage;
    sentenceRef = sentenceRef.limit(perPage).offset(offset);
  }

  const snapshot = await sentenceRef.get();

  const sentences = snapshot.docs.map((doc) => new Sentence(doc));
  return sentences;
}

/**
 * Returns the sentence with a given ID, and throws an error if it isn't found.
 *
 * @param {string} id Sentence ID
 * @returns {Promise<Sentence>}
 * @throws {NotFoundError} Http 404 error if the sentence doesn't exist
 */
export async function getSentence(id) {
  const sentenceRef = db.collection("sentences").doc(id);
  const sentence = await sentenceRef.get();
  if (!sentence.exists) throw new NotFoundError(id, "Sentence");

  return new Sentence(sentence);
}

/**
 * Creates a new sentence, and returns the newly created sentence ID
 *
 * @param {string} text Text of the new Sentence
 * @param {string | null} category Category of the new Sentence
 * @returns {Promise<string>} The new Sentence ID
 */
export async function createSentence(text, category) {
  const result = await db.collection("sentences").add({
    text,
    category,
  });

  return result.id;
}

/**
 * Edit an existing sentence
 *
 * @param {string} id ID of the sentence to edit
 * @param {string | undefined} text New text for the sentence. If undefined, it will keep the old one
 * @param {string | null | undefined} category New category for the sentence. If undefined, it will keep the old one
 */
export async function updateSentence(id, text, category) {
  const sentenceRef = db.collection("sentences").doc(id);

  // Check if it exists
  await getSentence(id);

  const newSentence = { newfield: true };
  if (text !== undefined) newSentence.text = text;
  if (category !== undefined) newSentence.category = category;

  await sentenceRef.update(newSentence);
  return;
}

/**
 * Delete an existing sentence
 * @param {string} id ID of the sentence to delete
 */
export async function deleteSentence(id) {
  const sentenceRef = db.collection("sentences").doc(id);

  // Check if it exists
  await getSentence(id);

  await sentenceRef.delete();
}
