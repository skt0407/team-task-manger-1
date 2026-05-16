import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
  async summary(req: Request, res: Response) {
    const summary = await dashboardService.summary(req.user!);
    res.status(200).json({ summary });
  }
};
