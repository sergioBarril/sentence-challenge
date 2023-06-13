import { StatusCodes } from "http-status-codes";
import * as sentenceService from "../services/sentences.service.js";

/**
 * Get a list of sentences
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function getSentenceList(req, res) {
  const sentences = await sentenceService.getSentenceList();
  res.status(StatusCodes.OK).json(sentences);
}
