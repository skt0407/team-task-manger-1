import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const projectInclude = {
  members: {
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      }
    }
  },
  tasks: {
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" as const }
  }
};

export const projectService = {
  async list(user: Express.Request["user"]) {
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    return prisma.project.findMany({
      where:
        user.role === "ADMIN"
          ? undefined
          : {
              members: {
                some: { userId: user.id }
              }
            },
      include: {
        members: true,
        tasks: true
      },
      orderBy: { updatedAt: "desc" }
    });
  },

  async getById(projectId: string, user: Express.Request["user"]) {
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    const project = await prisma.project.findFirst({
      where:
        user.role === "ADMIN"
          ? { id: projectId }
          : {
              id: projectId,
              members: {
                some: { userId: user.id }
              }
            },
      include: projectInclude
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return project;
  },

  async create(input: { name: string; description?: string }, userId: string) {
    const project = await prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        members: {
          create: {
            userId
          }
        },
        activities: {
          create: {
            message: `Created project "${input.name}"`,
            userId
          }
        }
      },
      include: projectInclude
    });

    return project;
  },

  async update(projectId: string, input: { name?: string; description?: string | null }, userId: string) {
    await this.ensureProject(projectId);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: input.name,
        description: input.description
      },
      include: projectInclude
    });

    await prisma.activity.create({
      data: {
        message: `Updated project "${project.name}"`,
        projectId,
        userId
      }
    });

    return project;
  },

  async remove(projectId: string) {
    await this.ensureProject(projectId);
    await prisma.project.delete({ where: { id: projectId } });
  },

  async addMember(projectId: string, userId: string, actorId: string) {
    await this.ensureProject(projectId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const member = await prisma.projectMember.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      },
      update: {},
      create: {
        userId,
        projectId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    await prisma.activity.create({
      data: {
        message: `Added ${user.name} to the project`,
        projectId,
        userId: actorId
      }
    });

    return member;
  },

  async listMembers(projectId: string) {
    await this.ensureProject(projectId);

    return prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: {
        user: {
          name: "asc"
        }
      }
    });
  },

  async removeMember(projectId: string, userId: string, actorId: string) {
    await this.ensureProject(projectId);

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      },
      include: { user: true }
    });

    if (!member) {
      throw new ApiError(404, "Project member not found");
    }

    await prisma.projectMember.delete({ where: { id: member.id } });
    await prisma.activity.create({
      data: {
        message: `Removed ${member.user.name} from the project`,
        projectId,
        userId: actorId
      }
    });
  },

  async ensureProject(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    return project;
  }
};
