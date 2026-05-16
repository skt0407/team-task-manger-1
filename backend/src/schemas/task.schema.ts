import { z } from "zod";

const priority = z.enum(["LOW", "MEDIUM", "HIGH"]);
const status = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const taskFiltersSchema = z.object({
  query: z.object({
    projectId: z.string().uuid().optional(),
    status: status.optional(),
    priority: priority.optional()
  })
});

export const taskIdParam = z.object({
  params: z.object({
    taskId: z.string().uuid()
  })
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(160),
    description: z.string().max(1000).optional(),
    dueDate: z.string().datetime().optional(),
    priority: priority.default("MEDIUM"),
    status: status.default("TODO"),
    projectId: z.string().uuid(),
    assignedToId: z.string().uuid().nullable().optional()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    taskId: z.string().uuid()
  }),
  body: z.object({
    title: z.string().min(2).max(160).optional(),
    description: z.string().max(1000).nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    priority: priority.optional(),
    status: status.optional(),
    assignedToId: z.string().uuid().nullable().optional()
  })
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    taskId: z.string().uuid()
  }),
  body: z.object({
    status
  })
});
