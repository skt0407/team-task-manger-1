import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";

export const userController = {
  async list(_req: Request, res: Response) {
    const users = await userService.list();
    res.status(200).json({ users });
  },

  async updateRole(req: Request, res: Response) {
    const user = await userService.updateRole(req.user!.id, req.params.userId as string, req.body.role);
    res.status(200).json({ user });
  }
};
