import type { Prisma, TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const taskInclude = {
  project: {
    select: { id: true, name: true }
  },
  assignedTo: {
    select: { id: true, name: true, email: true }
  },
  createdBy: {
    select: { id: true, name: true, email: true }
  }
};

type UserContext = NonNullable<Express.Request["user"]>;

export const taskService = {
  async list(
    user: UserContext,
    filters: { projectId?: string; status?: TaskStatus; priority?: "LOW" | "MEDIUM" | "HIGH" }
  ) {
    const where: Prisma.TaskWhereInput = {
      projectId: filters.projectId,
      status: filters.status,
      priority: filters.priority,
      ...(user.role === "MEMBER"
        ? {
            assignedToId: user.id,
            project: {
              members: {
                some: { userId: user.id }
              }
            }
          }
        : {})
    };

    return prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }]
    });
  },

  async getById(taskId: string, user: UserContext) {
    const task = await prisma.task.findFirst({
      where:
        user.role === "ADMIN"
          ? { id: taskId }
          : {
              id: taskId,
              assignedToId: user.id
            },
      include: taskInclude
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return task;
  },

  async create(
    input: {
      title: string;
      description?: string;
      dueDate?: string;
      priority: "LOW" | "MEDIUM" | "HIGH";
      status: TaskStatus;
      projectId: string;
      assignedToId?: string | null;
    },
    userId: string
  ) {
    await this.ensureAssigneeInProject(input.projectId, input.assignedToId);

    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        priority: input.priority,
        status: input.status,
        projectId: input.projectId,
        assignedToId: input.assignedToId,
        createdById: userId,
        activities: {
          create: {
            message: `Created task "${input.title}"`,
            userId,
            projectId: input.projectId
          }
        }
      },
      include: taskInclude
    });

    return task;
  },

  async update(
    taskId: string,
    input: {
      title?: string;
      description?: string | null;
      dueDate?: string | null;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      status?: TaskStatus;
      assignedToId?: string | null;
    },
    userId: string
  ) {
    const existing = await this.ensureTask(taskId);
    await this.ensureAssigneeInProject(existing.projectId, input.assignedToId);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: input.title,
        description: input.description,
        dueDate:
          input.dueDate === undefined ? undefined : input.dueDate === null ? null : new Date(input.dueDate),
        priority: input.priority,
        status: input.status,
        assignedToId: input.assignedToId
      },
      include: taskInclude
    });

    await prisma.activity.create({
      data: {
        message: `Updated task "${task.title}"`,
        projectId: task.projectId,
        taskId: task.id,
        userId
      }
    });

    return task;
  },

  async updateStatus(taskId: string, status: TaskStatus, user: UserContext) {
    const task = await this.ensureTask(taskId);

    if (user.role === "MEMBER" && task.assignedToId !== user.id) {
      throw new ApiError(403, "Members can only update their assigned tasks");
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: taskInclude
    });

    await prisma.activity.create({
      data: {
        message: `Moved task "${updated.title}" to ${status.replace("_", " ").toLowerCase()}`,
        projectId: updated.projectId,
        taskId: updated.id,
        userId: user.id
      }
    });

    return updated;
  },

  async remove(taskId: string, userId: string) {
    const task = await this.ensureTask(taskId);

    await prisma.activity.create({
      data: {
        message: `Deleted task "${task.title}"`,
        projectId: task.projectId,
        userId
      }
    });

    await prisma.task.delete({ where: { id: taskId } });
  },

  async ensureTask(taskId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    return task;
  },

  async ensureAssigneeInProject(projectId: string, assignedToId?: string | null) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (!assignedToId) {
      return;
    }

    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: assignedToId,
          projectId
        }
      }
    });

    if (!membership) {
      throw new ApiError(400, "Assigned user must be a project member");
    }
  }
};
