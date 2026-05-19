import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(128)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(128)
  })
});

export const updateMeSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(80).optional(),
      email: z.string().email().toLowerCase().optional(),
      currentPassword: z.string().min(8).max(128).optional(),
      newPassword: z.string().min(8).max(128).optional()
    })
    .refine((data) => !data.newPassword || Boolean(data.currentPassword), {
      message: "Current password is required to change password",
      path: ["currentPassword"]
    })
});
