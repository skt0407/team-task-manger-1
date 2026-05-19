import { z } from "zod";

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid()
  }),
  body: z.object({
    role: z.enum(["ADMIN", "MEMBER"])
  })
});
