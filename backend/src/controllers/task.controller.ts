import type { Request, Response } from "express";
import { taskService } from "../services/task.service.js";

export const taskController = {
  async list(req: Request, res: Response) {
    const tasks = await taskService.list(req.user!, req.query);
    res.status(200).json({ tasks });
  },

  async getById(req: Request, res: Response) {
    const task = await taskService.getById(req.params.taskId as string, req.user!);
    res.status(200).json({ task });
  },

  async create(req: Request, res: Response) {
    const task = await taskService.create(req.body, req.user!.id);
    res.status(201).json({ task });
  },

  async update(req: Request, res: Response) {
    const task = await taskService.update(req.params.taskId as string, req.body, req.user!.id);
    res.status(200).json({ task });
  },

  async updateStatus(req: Request, res: Response) {
    const task = await taskService.updateStatus(req.params.taskId as string, req.body.status, req.user!);
    res.status(200).json({ task });
  },

  async remove(req: Request, res: Response) {
    await taskService.remove(req.params.taskId as string, req.user!.id);
    res.status(204).send();
  }
};
