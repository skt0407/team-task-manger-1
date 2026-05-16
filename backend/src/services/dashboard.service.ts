import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

type UserContext = NonNullable<Express.Request["user"]>;

export const dashboardService = {
  async summary(user: UserContext) {
    const taskScope: Prisma.TaskWhereInput =
      user.role === "ADMIN"
        ? {}
        : {
            assignedToId: user.id
          };

    const [totalTasks, tasksByStatus, tasksByPriority, overdueTasks, tasksPerUser, recentActivity] =
      await Promise.all([
        prisma.task.count({ where: taskScope }),
        prisma.task.groupBy({
          by: ["status"],
          where: taskScope,
          _count: { status: true }
        }),
        prisma.task.groupBy({
          by: ["priority"],
          where: taskScope,
          _count: { priority: true }
        }),
        prisma.task.count({
          where: {
            ...taskScope,
            dueDate: { lt: new Date() },
            status: { not: "DONE" }
          }
        }),
        prisma.task.groupBy({
          by: ["assignedToId"],
          where: taskScope,
          _count: { assignedToId: true }
        }),
        prisma.activity.findMany({
          where:
            user.role === "ADMIN"
              ? undefined
              : {
                  OR: [
                    { userId: user.id },
                    {
                      task: {
                        assignedToId: user.id
                      }
                    }
                  ]
                },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            project: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 8
        })
      ]);

    const userIds = tasksPerUser
      .map((item) => item.assignedToId)
      .filter((id): id is string => Boolean(id));

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    });

    return {
      totalTasks,
      tasksByStatus: tasksByStatus.map((item) => ({
        status: item.status,
        count: item._count.status
      })),
      tasksByPriority: tasksByPriority.map((item) => ({
        priority: item.priority,
        count: item._count.priority
      })),
      overdueTasks,
      tasksPerUser: tasksPerUser.map((item) => ({
        assignedToId: item.assignedToId,
        count: item._count.assignedToId,
        user: users.find((candidate) => candidate.id === item.assignedToId) ?? null
      })),
      recentActivity
    };
  }
};
