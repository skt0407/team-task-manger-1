import type { User } from "./auth";

export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  status: TaskStatus;
  projectId: string;
  assignedToId?: string | null;
  assignedTo?: Pick<User, "id" | "name" | "email"> | null;
  createdAt: string;
  updatedAt: string;
};
