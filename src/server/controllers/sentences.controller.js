import { StatusCodes } from "http-status-codes";
import * as sentenceService from "../services/sentences.service.js";
import HttpError from "../errors/http.error.js";

const DEFAULT_PER_PAGE = 20;
const VALID_SORT_VALUES = ["asc", "desc"];

/**
 * Get a list of sentences
 */
export async function getSentenceList(req, res) {
  let page = parseInt(req.query.page);
  if (req.query.page === undefined) {
    page = null;
  } else if (isNaN(page) || page < 1) page = 1;

  let perPage = parseInt(req.query.per_page);
  if (isNaN(perPage) || perPage < 0) perPage = DEFAULT_PER_PAGE;

  let category = req.query.category;
  if (category) category = category.trim().toLowerCase();

  let sort = req.query.sort;
  if (sort) sort = VALID_SORT_VALUES.find((criteria) => criteria === sort.toLowerCase());
  if (!sort) sort = "asc";

  const sentences = await sentenceService.getSentenceList(page, perPage, category, sort);
  return res.status(StatusCodes.OK).json(sentences);
}

/**
 * Get a sentence by id
 */
export async function getSentence(req, res) {
  const sentence = await sentenceService.getSentence(req.params.id);
  res.status(StatusCodes.OK).json(sentence);
}

/**
 * Create a new sentence
 */
export async function createSentence(req, res) {
  let text = req.body.text;
  if (!text || text.trim() === "") {
    throw new HttpError({
      status: StatusCodes.BAD_REQUEST,
      message: "The field 'text' is required and must not be empty.",
    });
  }

  let category = req.body.category?.trim();
  const categoryNullValues = ["", "none", "null"];
  if (!category || categoryNullValues.includes(category)) category = null;

  const newSentenceId = await sentenceService.createSentence(text, category);
  const newSentence = await sentenceService.getSentence(newSentenceId);

  res.status(StatusCodes.CREATED).json(newSentence);
}

/**
 * Update an existing sentence
 */
export async function updateSentence(req, res) {
  const id = req.params.id;

  let newText = req.body.text?.trim();
  const newCategory = req.body.category;

  await sentenceService.updateSentence(id, newText, newCategory);

  const newSentence = await sentenceService.getSentence(id);
  res.status(StatusCodes.OK).json(newSentence);
}

/**
 * Delete an existing sentence
 */
export async function deleteSentence(req, res) {
  const id = req.params.id;

  await sentenceService.deleteSentence(id);

  res.status(StatusCodes.NO_CONTENT).end();
}

/**
 * Translate an existing sentence
 */
export async function translateSentence(req, res) {
  const id = req.params.id;
  const sentence = await sentenceService.getSentence(id);

  const translatedText = await sentenceService.translateSentence(sentence.text, "DE", "EN");
  res.status(StatusCodes.OK).json({ text: translatedText });
}
