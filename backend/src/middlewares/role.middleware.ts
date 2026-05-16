import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    next();
  };

export const requireProjectMember = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication required"));
  }

  const projectId = (req.params.projectId ?? req.body.projectId) as string | undefined;
  if (!projectId) {
    return next(new ApiError(400, "Project id is required"));
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: req.user.id,
        projectId
      }
    }
  });

  if (!membership && req.user.role !== "ADMIN") {
    return next(new ApiError(403, "You are not a member of this project"));
  }

  next();
};
