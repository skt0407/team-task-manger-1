import { Router } from "express";
import { Role } from "@prisma/client";
import { projectController } from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createProjectSchema,
  memberSchema,
  projectIdParam,
  removeMemberSchema,
  updateProjectSchema
} from "../schemas/project.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(projectController.list));
router.post("/", requireRole(Role.ADMIN), validate(createProjectSchema), asyncHandler(projectController.create));
router.get("/:projectId", validate(projectIdParam), asyncHandler(projectController.getById));
router.get("/:projectId/members", validate(projectIdParam), asyncHandler(projectController.listMembers));
router.patch(
  "/:projectId",
  requireRole(Role.ADMIN),
  validate(updateProjectSchema),
  asyncHandler(projectController.update)
);
router.put(
  "/:projectId",
  requireRole(Role.ADMIN),
  validate(updateProjectSchema),
  asyncHandler(projectController.update)
);
router.delete(
  "/:projectId",
  requireRole(Role.ADMIN),
  validate(projectIdParam),
  asyncHandler(projectController.remove)
);
router.post(
  "/:projectId/members",
  requireRole(Role.ADMIN),
  validate(memberSchema),
  asyncHandler(projectController.addMember)
);
router.delete(
  "/:projectId/members/:userId",
  requireRole(Role.ADMIN),
  validate(removeMemberSchema),
  asyncHandler(projectController.removeMember)
);

export default router;
