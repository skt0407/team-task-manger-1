import { z } from "zod";

export const projectIdParam = z.object({
  params: z.object({
    projectId: z.string().uuid()
  })
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    description: z.string().max(500).optional()
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    projectId: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    description: z.string().max(500).nullable().optional()
  })
});

export const memberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid()
  }),
  body: z.object({
    userId: z.string().uuid()
  })
});

export const removeMemberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid(),
    userId: z.string().uuid()
  })
});
