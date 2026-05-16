import { prisma } from "../config/prisma.js";

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
  }
};
