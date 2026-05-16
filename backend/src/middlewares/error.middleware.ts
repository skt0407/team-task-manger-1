import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
    ...(env.NODE_ENV !== "production" ? { details: error.message } : {})
  });
};
