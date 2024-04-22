import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    // errorStack : err.stack, // to get error in full details (never use err.stack in production mode its only for development mode)
    errorStack: config.env === "development" ? err.stack : "",
  });
};


export default globalErrorHandler;