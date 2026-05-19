import { Router } from "express";
import { Role } from "@prisma/client";
import { taskController } from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createTaskSchema,
  taskFiltersSchema,
  taskIdParam,
  updateTaskSchema,
  updateTaskStatusSchema
} from "../schemas/task.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", validate(taskFiltersSchema), asyncHandler(taskController.list));
router.post("/", requireRole(Role.ADMIN), validate(createTaskSchema), asyncHandler(taskController.create));
router.get("/:taskId", validate(taskIdParam), asyncHandler(taskController.getById));
router.patch(
  "/:taskId",
  requireRole(Role.ADMIN),
  validate(updateTaskSchema),
  asyncHandler(taskController.update)
);
router.put("/:taskId", validate(updateTaskSchema), asyncHandler(taskController.update));
router.patch("/:taskId/status", validate(updateTaskStatusSchema), asyncHandler(taskController.updateStatus));
router.delete("/:taskId", requireRole(Role.ADMIN), validate(taskIdParam), asyncHandler(taskController.remove));

export default router;
