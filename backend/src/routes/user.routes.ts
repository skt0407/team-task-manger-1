import { Router } from "express";
import { Role } from "@prisma/client";
import { userController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateUserRoleSchema } from "../schemas/user.schema.js";

const router = Router();

router.use(authenticate);
router.get("/", requireRole(Role.ADMIN), asyncHandler(userController.list));
router.patch(
  "/:userId/role",
  requireRole(Role.ADMIN),
  validate(updateUserRoleSchema),
  asyncHandler(userController.updateRole)
);

export default router;
