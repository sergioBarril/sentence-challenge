import { StatusCodes } from "http-status-codes";
import HttpError from "./http.error.js";

/**
 * Error representing an HTTP 404
 */
export default class NotFoundError extends HttpError {
  /**
   * Constructor for NotFoundError
   *
   * @param {string} id ID that hasn't been found
   * @param {string} entity Type of entity that hasn't been found
   */
  constructor(id, entity) {
    super({
      status: StatusCodes.NOT_FOUND,
      message: `${entity} not found with id ${id}`,
      name: `${entity}NotFoundError`,
    });
  }
}
