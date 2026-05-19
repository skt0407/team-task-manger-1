import { Role } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true
};

export const authService = {
  async signup(input: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ApiError(409, "Email is already registered");
    }

    const userCount = await prisma.user.count();
    const role: Role = userCount === 0 ? "ADMIN" : "MEMBER";

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: await hashPassword(input.password),
        role
      },
      select: publicUserSelect
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { user, token };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatches = await comparePassword(input.password, user.password);
    if (!passwordMatches) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const { password: _password, ...safeUser } = user;

    return { user: safeUser, token };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  async updateMe(
    userId: string,
    input: { name?: string; email?: string; currentPassword?: string; newPassword?: string }
  ) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    if (input.email && input.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: input.email } });
      if (emailTaken) {
        throw new ApiError(409, "Email is already registered");
      }
    }

    if (input.newPassword) {
      const passwordMatches = await comparePassword(input.currentPassword ?? "", existing.password);
      if (!passwordMatches) {
        throw new ApiError(400, "Current password is incorrect");
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        email: input.email,
        password: input.newPassword ? await hashPassword(input.newPassword) : undefined
      },
      select: publicUserSelect
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { user, token };
  },

  cookieOptions() {
    return {
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    };
  }
};
