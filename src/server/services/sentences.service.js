import db from "../database/db.js";

/**
 * Returns a list of sentences
 *
 * @param {number | null} page Page to return. If null, returns all sentences
 * @param {number} perPage Number of sentences to return per page
 * @param {string | null} category Category filter. If null, returns all categories
 * @param {string | null} sort "asc" or "desc"
 * @returns {Promise<FirebaseFirestore.DocumentData[]>}
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

  const sentences = snapshot.docs.map((doc) => doc.data());
  return sentences;
}
