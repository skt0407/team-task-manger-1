import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
  const password = await hashPassword("Password123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@teamtask.com" },
    update: {},
    create: {
      name: "Aarav Admin",
      email: "admin@teamtask.com",
      password,
      role: "ADMIN"
    }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@teamtask.com" },
    update: {},
    create: {
      name: "Meera Member",
      email: "member@teamtask.com",
      password,
      role: "MEMBER"
    }
  });

  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Launch a polished company website refresh.",
      members: {
        createMany: {
          data: [{ userId: admin.id }, { userId: member.id }],
          skipDuplicates: true
        }
      },
      tasks: {
        create: [
          {
            title: "Create landing page wireframes",
            description: "Prepare responsive desktop and mobile wireframes.",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: "HIGH",
            status: "IN_PROGRESS",
            assignedToId: member.id,
            createdById: admin.id
          },
          {
            title: "Set up deployment pipeline",
            description: "Configure Railway services and environment variables.",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            priority: "MEDIUM",
            status: "TODO",
            assignedToId: admin.id,
            createdById: admin.id
          }
        ]
      },
      activities: {
        create: {
          message: "Seeded demo project",
          userId: admin.id
        }
      }
    }
  });

  console.log(`Seeded users and project: ${project.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
