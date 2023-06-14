import { StatusCodes } from "http-status-codes";
import * as sentenceService from "../services/sentences.service.js";

const DEFAULT_PER_PAGE = 20;
const VALID_SORT_VALUES = ["asc", "desc"];

/**
 * Get a list of sentences
 */
export async function getSentenceList(req, res) {
  let page = parseInt(req.query.page);
  if (isNaN(page) || page < 1) return res.status(StatusCodes.BAD_REQUEST).end();

  let perPage = parseInt(req.query.per_page);
  if (isNaN(perPage) || perPage < 0) perPage = DEFAULT_PER_PAGE;

  let category = req.query.category;
  if (category) category = category.toLowerCase();

  let sort = req.query.sort;
  if (sort) sort = VALID_SORT_VALUES.find((criteria) => criteria === sort.toLowerCase());

  const sentences = await sentenceService.getSentenceList(page, perPage, category, sort);
  return res.status(StatusCodes.OK).json(sentences);
}

/**
 * Get a sentence by id
 */
export async function getSentence(req, res) {
  const sentence = await sentenceService.getSentence(req.params.id);

  if (sentence) {
    res.status(StatusCodes.OK).json(sentence);
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
}

/**
 * Create a new sentence
 */
export async function createSentence(req, res) {
  const text = req.body.text;
  const category = req.body.category || null;

  const newSentenceId = await sentenceService.createSentence(text, category);
  const newSentence = await sentenceService.getSentence(newSentenceId);

  res.status(StatusCodes.CREATED).json(newSentence);
}

/**
 * Update an existing sentence
 */
export async function updateSentence(req, res) {
  const id = req.params.id;

  const newText = req.body.text;
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

  const isDeleted = await sentenceService.deleteSentence(id);
  if (!isDeleted) res.status(StatusCodes.NOT_FOUND).end();

  res.status(StatusCodes.NO_CONTENT).end();
}
