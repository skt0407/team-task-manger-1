import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const token = req.cookies?.accessToken ?? bearerToken;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return next(new ApiError(401, "Invalid authentication token"));
    }

    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired authentication token"));
  }
};
