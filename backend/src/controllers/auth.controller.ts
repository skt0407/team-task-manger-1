import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
  async signup(req: Request, res: Response) {
    const result = await authService.signup(req.body);
    res.cookie("accessToken", result.token, authService.cookieOptions());
    res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.cookie("accessToken", result.token, authService.cookieOptions());
    res.status(200).json(result);
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("accessToken", authService.cookieOptions());
    res.status(200).json({ message: "Logged out successfully" });
  },

  async me(req: Request, res: Response) {
    const user = await authService.me(req.user!.id);
    res.status(200).json({ user });
  },

  async updateMe(req: Request, res: Response) {
    const result = await authService.updateMe(req.user!.id, req.body);
    res.cookie("accessToken", result.token, authService.cookieOptions());
    res.status(200).json(result);
  }
};
