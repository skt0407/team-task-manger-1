import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const userService = {
  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { name: "asc" }
    });
  },

  async updateRole(actorId: string, userId: string, role: "ADMIN" | "MEMBER") {
    if (actorId === userId) {
      throw new ApiError(400, "You cannot change your own role");
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      throw new ApiError(404, "User not found");
    }

    if (target.role === "ADMIN" && role === "MEMBER") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        throw new ApiError(400, "At least one admin is required");
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }
};
