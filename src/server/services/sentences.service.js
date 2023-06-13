import db from "../database/db.js";

/**
 * Returns a list of all sentences
 * @returns {Promise<FirebaseFirestore.DocumentData[]>}
 */
export async function getSentenceList() {
  const sentenceCollection = db.collection("sentences");
  const snapshot = await sentenceCollection.get();

  const sentences = snapshot.docs.map((doc) => doc.data());
  return sentences;
}
