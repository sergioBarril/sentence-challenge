import "dotenv/config.js";
import db from "../database/db.js";
import NotFoundError from "../errors/not-found.error.js";
import Sentence from "../models/sentence.model.js";
import HttpError from "../errors/http.error.js";
import { StatusCodes } from "http-status-codes";

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
    if (category === "none" || category === "null") category = null;
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

  const newSentence = {};
  if (text != null && text.length > 0) newSentence.text = text;
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

/**
 *
 * @param {string} text Text of the sentence that needs translation
 * @param {string} sourceLanguage Code of the language in which the sentence is written.
 * @param {string} targetLanguage Code of the language in which the sentence should be translated
 * @returns {Promise<string>} The translated sentence text
 */
export async function translateSentence(text, sourceLanguage = "DE", targetLanguage = "EN") {
  const deeplUrl = "https://api-free.deepl.com/v2/translate";

  const params = new URLSearchParams({
    text,
    source_lang: sourceLanguage,
    target_lang: targetLanguage,
  });

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey)
    throw new HttpError({ message: "DeepL API Key not found", status: StatusCodes.NOT_FOUND });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  };

  const response = await fetch(deeplUrl, requestOptions);
  const body = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.FORBIDDEN)
      throw new HttpError({ message: "DeepL API Key is invalid", status: StatusCodes.FORBIDDEN });
    else throw new HttpError({ message: body.message, status: response.status });
  }

  return body?.translations[0]?.text;
}
