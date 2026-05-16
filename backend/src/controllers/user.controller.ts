import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";

export const userController = {
  async list(_req: Request, res: Response) {
    const users = await userService.list();
    res.status(200).json({ users });
  }
};
