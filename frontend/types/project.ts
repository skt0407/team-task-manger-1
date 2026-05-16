import type { User } from "./auth";
import type { Task } from "./task";

export type ProjectMember = {
  id: string;
  userId: string;
  projectId: string;
  user?: User;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  members: ProjectMember[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
};
