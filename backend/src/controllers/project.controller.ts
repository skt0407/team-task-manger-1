import type { Request, Response } from "express";
import { projectService } from "../services/project.service.js";

export const projectController = {
  async list(req: Request, res: Response) {
    const projects = await projectService.list(req.user);
    res.status(200).json({ projects });
  },

  async getById(req: Request, res: Response) {
    const project = await projectService.getById(req.params.projectId as string, req.user);
    res.status(200).json({ project });
  },

  async create(req: Request, res: Response) {
    const project = await projectService.create(req.body, req.user!.id);
    res.status(201).json({ project });
  },

  async update(req: Request, res: Response) {
    const project = await projectService.update(req.params.projectId as string, req.body, req.user!.id);
    res.status(200).json({ project });
  },

  async remove(req: Request, res: Response) {
    await projectService.remove(req.params.projectId as string);
    res.status(204).send();
  },

  async addMember(req: Request, res: Response) {
    const member = await projectService.addMember(req.params.projectId as string, req.body.userId, req.user!.id);
    res.status(201).json({ member });
  },

  async removeMember(req: Request, res: Response) {
    await projectService.removeMember(req.params.projectId as string, req.params.userId as string, req.user!.id);
    res.status(204).send();
  }
};
