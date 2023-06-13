import { StatusCodes } from "http-status-codes";
import * as sentenceService from "../services/sentences.service.js";

const DEFAULT_PER_PAGE = 20;
const VALID_SORT_VALUES = ["asc", "desc"];

/**
 * Get a list of sentences
 *
 * @param {Request} req
 * @param {Response} res
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
