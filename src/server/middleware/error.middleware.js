/* eslint-disable no-unused-vars */
import { StatusCodes } from "http-status-codes";

function errorMiddleware(err, req, res, next) {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";
  res.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
