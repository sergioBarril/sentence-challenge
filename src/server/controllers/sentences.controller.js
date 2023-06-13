import { StatusCodes } from "http-status-codes";
import * as sentenceService from "../services/sentences.service";

/**
 * Get a list of sentences
 *
 * @param {Request} req
 * @param {Response} res
 */
export function getSentenceList(req, res) {
  const sentences = sentenceService.getSentenceList();
  res.status(StatusCodes.OK).json(sentences);
}
